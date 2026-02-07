import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', ...props }) {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#242424] disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500',
        outline: 'border border-gray-600 text-gray-300 hover:bg-gray-800 focus:ring-gray-500',
        ghost: 'text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-gray-500',
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        />
    );
}
