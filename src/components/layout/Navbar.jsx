import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Calendar, LineChart, MessageSquare, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import clsx from 'clsx';

export function Navbar() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { to: '/', label: 'Plans', icon: Dumbbell },
        { to: '/log', label: 'Log Workout', icon: Calendar },
        { to: '/progress', label: 'Progress', icon: LineChart },
        { to: '/contact', label: 'Contact', icon: MessageSquare },
    ];

    return (
        <nav className="border-b border-white/10 bg-[#1a1a1a]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg">
                                <Dumbbell className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                FitFrame
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.to;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={clsx(
                                            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                            isActive
                                                ? 'bg-white/10 text-white'
                                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-[#1a1a1a]">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={clsx(
                                        'flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium',
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
