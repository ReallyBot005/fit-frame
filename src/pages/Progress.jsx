import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../lib/api';

const data = [
    { name: 'Mon', workouts: 1 },
    { name: 'Tue', workouts: 1 },
    { name: 'Wed', workouts: 0 },
    { name: 'Thu', workouts: 1 },
    { name: 'Fri', workouts: 1 },
    { name: 'Sat', workouts: 0 },
    { name: 'Sun', workouts: 1 },
];

export function Progress() {
    const [stats, setStats] = useState({ totalWorkouts: 0 });

    useEffect(() => {
        api.getWorkoutStatus().then(setStats).catch(console.error);
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Your Progress</h1>
                <p className="text-gray-400">Track your consistency over time.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-2 lg:col-span-1 h-[400px]">
                    <h2 className="text-xl font-semibold mb-6">Weekly Frequency</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                />
                                <Bar dataKey="workouts" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="col-span-2 lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Stats Overview</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                            <span className="text-gray-400">Total Workouts</span>
                            <span className="text-2xl font-bold text-white">{stats.totalWorkouts}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                            <span className="text-gray-400">Current Streak</span>
                            <span className="text-2xl font-bold text-indigo-400">3 Days</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                            <span className="text-gray-400">Plans Completed</span>
                            <span className="text-2xl font-bold text-white">1</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
