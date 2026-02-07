import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={twMerge(
                'rounded-xl border border-white/10 bg-[#1a1a1a] p-6 shadow-xl',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
