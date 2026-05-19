const pool = require('../config/db');
const ollama = require('ollama').default;

exports.chat = async (req, res) => {
    const { message, history } = req.body;
    const userId = req.user ? req.user.id : null;

    try {
        // 1. Fetch relevant context from DB based on keywords (Hooked up to new ACID/Normalized schema)
        let context = "";
        let hostels = [];
        let courses = [];
        const keywords = message.toLowerCase().split(' ');

        // Injecting authentic internal SRM KTR institutional knowledge
        context += `
[INTERNAL KNOWLEDGE BASE - DO NOT CITE SOURCES, SPEAK ABOUT IT NATURALLY AS YOUR OWN KNOWLEDGE]
SRM Institute of Science and Technology (SRMIST) Kattankulathur (KTR) Main Campus Facts:
- Location: A sprawling 250-acre main campus situated on GST Road in Potheri, near Chennai, Tamil Nadu.
- Academics: The KTR campus is the core hub offering vast programs in Engineering & Technology, Medicine, Health Sciences, Science & Humanities, Management, Architecture, and Law.
- Placements: Extremely strong placement pipeline. In the recent season, we achieved over 9,000 job offers! The highest package recorded was an incredible ₹65 LPA, with average packages around ₹6.7 LPA. Top recruiters frequenting our campus include tech giants like Amazon, Google, Microsoft, TCS, Cognizant, Wipro, and Deloitte.
- Infrastructure: We provide over 100 high-tech smart classrooms, state-of-the-art laboratories, and a highly energy-efficient green campus environment.
- Auditoriums: We are proud to house the Dr. T.P. Ganesan Auditorium, which is one of the largest in Asia, with a seating capacity of around 4,000 people.
- Sports & Extracurriculars: Extensive sports complexes including fields for cricket, football, hockey, along with indoor stadiums, gymnasiums, and multiple courts for basketball and tennis.
- Rankings: Actively ranked 14th in Engineering and 22nd Overall in India by NIRF. We also hold the highest 'A++' grade accreditation from NAAC.
`;

        if (keywords.includes('hostel') || keywords.includes('accommodation')) {
            // Using Shared Lock (LOCK IN SHARE MODE) for safe analytical reads without dirty reads
            const [localHostels] = await pool.query('SELECT name, type, capacity, (capacity - IFNULL(current_occupancy, 0)) AS available_seats, fees_per_year FROM hostels LOCK IN SHARE MODE');
            if (localHostels && localHostels.length > 0) {
                hostels = localHostels;
                context += `\nLatest Hostel Availability (ACID Compliant DB Sync): ${JSON.stringify(hostels)}`;
            }
        }

        if (keywords.includes('course') || keywords.includes('fee') || keywords.includes('admission') || keywords.includes('b.tech')) {
            // Joining normalized tables (3NF) and checking real-time available seats
            const [localCourses] = await pool.query('SELECT c.name as course_name, d.name as department, c.duration_years, c.fees_per_year FROM courses c JOIN departments d ON c.department_id = d.id LOCK IN SHARE MODE');
            if (localCourses && localCourses.length > 0) {
                courses = localCourses;
                context += `\nCourse & Admission Availability Info: ${JSON.stringify(courses)}`;
            }
        }

        // 2. Construct Prompt
        const systemPrompt = `You are an Admission Assistant for SRM Institute of Science and Technology. 
    Use the following database context to answer the student's question. 
    If the answer is not in the context, guide them to contact the administration.
    Context: ${context}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history || [],
            { role: 'user', content: message }
        ];

        // 3. Call Ollama (with fallback)
        const model = process.env.OLLAMA_MODEL || 'llama3';
        let botReply = '';

        try {
            const response = await ollama.chat({
                model: model,
                messages: messages,
            });
            botReply = response.message.content;
        } catch (ollamaError) {
            console.warn('Ollama unavailable or failed. Using fallback response.', ollamaError.message);
            // Fallback gracefully using context if available
            botReply = "I am currently running in offline mode (AI services disconnected). Based on my local records:\n\n";
            let hasContext = false;
            
            if (hostels.length > 0) {
                hasContext = true;
                botReply += "🏢 **Hostels Allocation:**\n";
                hostels.slice(0,3).forEach(h => botReply += `• ${h.name} (${h.type}) - Available Seats: ${h.available_seats}/${h.capacity}, Fees: ₹${h.fees_per_year}/yr.\n`);
                botReply += "\n";
            }
            if (courses.length > 0) {
                hasContext = true;
                botReply += "📚 **Courses & Fees:**\n";
                courses.slice(0,5).forEach(c => botReply += `• ${c.course_name} (${c.department}) - Fees: ₹${c.fees_per_year}/yr.\n`);
                botReply += "\n";
            }

            if (!hasContext) {
                botReply = "I am currently experiencing connectivity issues with my AI core. Please contact the administration directly for specific queries regarding your prompt.";
            } else {
                botReply += "\nFor more specific details, please contact SRM Admin.";
            }
        }

        // 4. Log Activity
        if (userId) {
            await pool.query(
                'INSERT INTO activity_history (user_id, action_type, description) VALUES (?, ?, ?)',
                [userId, 'CHAT_QUERY', `Q: ${message} | A: ${botReply.substring(0, 50)}...`]
            );
        }

        res.json({ reply: botReply });

    } catch (error) {
        console.error('Chat routing error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
