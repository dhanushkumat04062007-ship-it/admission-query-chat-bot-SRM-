"use client";



interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    children: React.ReactNode;
}

export function Card({ title, children, className, ...props }: CardProps) {
    return (
        <div className={`pro-card p-6 ${className || ''}`} {...props}>
            {title && <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{title}</h3>}
            <div className="text-gray-600">
                {children}
            </div>
        </div>
    );
}
