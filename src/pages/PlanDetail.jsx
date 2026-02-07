import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChevronDown, ChevronRight, Info, Dumbbell } from 'lucide-react';
import { api } from '../lib/api';

export function PlanDetail() {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDay, setExpandedDay] = useState(null);

    useEffect(() => {
        async function loadPlanDetails() {
            try {
                const { plan, exercises } = await api.getPlanDetails(id);
                setPlan(plan);

                // Group exercises by day
                const daysMap = new Map();
                exercises.forEach(ex => {
                    if (!daysMap.has(ex.day_number)) {
                        daysMap.set(ex.day_number, {
                            day: ex.day_number,
                            exercises: []
                        });
                    }
                    daysMap.get(ex.day_number).exercises.push(ex);
                });

                // Convert map to array and sort
                const daysArray = Array.from(daysMap.values()).sort((a, b) => a.day - b.day);
                setDays(daysArray);

            } catch (error) {
                console.error("Failed to load plan details:", error);
            } finally {
                setLoading(false);
            }
        }
        loadPlanDetails();
    }, [id]);

    if (loading) return <div className="text-center py-12 text-gray-400">Loading plan...</div>;
    if (!plan) return <div className="text-center py-12 text-gray-400">Plan not found.</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">{plan.title}</h1>
                    <p className="text-gray-400">{plan.description}</p>
                </div>
                <Button>Unenroll / Edit</Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
                        <div className="space-y-4">
                            {days.length === 0 ? (
                                <p className="text-gray-500">No exercises scheduled for this plan yet.</p>
                            ) : (
                                days.map((dayItem) => (
                                    <div key={dayItem.day} className="rounded-lg bg-white/5 overflow-hidden transition-colors">
                                        <div
                                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/10"
                                            onClick={() => setExpandedDay(expandedDay === dayItem.day ? null : dayItem.day)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                                                    <span className="font-bold">{dayItem.day}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-white">Day {dayItem.day}</h3>
                                                    <p className="text-sm text-gray-400">{dayItem.exercises.length} Exercises</p>
                                                </div>
                                            </div>
                                            {expandedDay === dayItem.day ?
                                                <ChevronDown className="h-5 w-5 text-gray-500" /> :
                                                <ChevronRight className="h-5 w-5 text-gray-500" />
                                            }
                                        </div>

                                        {/* Exercises List (Expanded) */}
                                        {expandedDay === dayItem.day && (
                                            <div className="border-t border-white/10 bg-black/20 p-4 space-y-3">
                                                {dayItem.exercises.map((item, idx) => (
                                                    <div key={item.id} className="flex items-start gap-3 text-sm">
                                                        <Dumbbell className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between">
                                                                <span className="font-medium text-gray-200">{item.exercises?.name || 'Unknown Exercise'}</span>
                                                                <span className="text-gray-400 tabular-nums">{item.sets} x {item.reps}</span>
                                                            </div>
                                                            {item.notes && <p className="text-gray-500 text-xs mt-0.5">{item.notes}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/20">
                        <div className="flex items-start gap-4">
                            <Info className="h-6 w-6 text-indigo-400 mt-1" />
                            <div>
                                <h3 className="font-medium text-white">Coach Tip</h3>
                                <p className="mt-2 text-sm text-gray-300">
                                    Remember to progressively overload. Try to increase weight or reps each week for main lifts.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-medium text-white mb-2">Plan Details</h3>
                        <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex justify-between">
                                <span>Duration</span>
                                <span className="text-white">{plan.duration || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Difficulty</span>
                                <span className="text-white">{plan.difficulty || 'N/A'}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
