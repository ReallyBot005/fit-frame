import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, Clock, Target } from 'lucide-react';
import { api } from '../lib/api';

export function Home() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPlans() {
            try {
                const data = await api.getPlans();
                setPlans(data);
            } catch (error) {
                console.error("Failed to load plans:", error);
                // Optionally handle empty state or error UI here
            } finally {
                setLoading(false);
            }
        }
        loadPlans();
    }, []);

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-indigo-900/20 px-6 py-16 sm:px-12 sm:py-24 lg:py-32">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        alt="Gym background"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="relative mx-auto max-w-2xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        FitFrame
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Build habits, build strength. Track your gains the smart way.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/log">
                            <Button className="px-8 py-3 text-lg">Start Tracking</Button>
                        </Link>
                        <Link to="/contact" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors">
                            Contact Support <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recommended Plans */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Recommended Plans</h2>
                    <Button variant="ghost" className="text-sm">View All</Button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading plans...</div>
                ) : plans.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No plans found. Please seed the database.</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <Card key={plan.id} className="group overflow-hidden border-0 bg-[#1a1a1a] p-0 transition-all hover:bg-[#242424]">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={plan.image_url || 'https://via.placeholder.com/800'}
                                        alt={plan.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${plan.difficulty === 'Beginner' ? 'text-green-400 ring-green-400/30 bg-green-400/10' :
                                            plan.difficulty === 'Intermediate' ? 'text-yellow-400 ring-yellow-400/30 bg-yellow-400/10' :
                                                'text-red-400 ring-red-400/30 bg-red-400/10'
                                            }`}>
                                            {plan.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                        {plan.title}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {plan.duration}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Target className="h-4 w-4" />
                                            Goal-oriented
                                        </div>
                                    </div>
                                    <p className="mt-4 line-clamp-2 text-sm text-gray-400">
                                        {plan.description}
                                    </p>
                                    <div className="mt-6">
                                        <Link to={`/plan/${plan.id}`} className="w-full">
                                            <Button variant="outline" className="w-full group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                                                View Plan
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
