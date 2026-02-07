import { Navbar } from './Navbar';

export function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#242424] text-gray-100">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
