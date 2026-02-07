import { twMerge } from 'tailwind-merge';

export function Input({ className, label, id, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={twMerge(
                    'block w-full rounded-lg border border-gray-600 bg-gray-800 p-2.5 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500',
                    className
                )}
                {...props}
            />
        </div>
    );
}
