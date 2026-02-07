import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

export function LogWorkout() {
    const [loading, setLoading] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [formData, setFormData] = useState({
        exercise_id: '',
        reps: '',
        sets: '',
        weight: '',
        notes: '',
    });

    useEffect(() => {
        api.getExercises().then(setExercises).catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { error } = await supabase
                    .from('workout_logs')
                    .insert([
                        {
                            user_id: user.id,
                            exercise_id: formData.exercise_id ? parseInt(formData.exercise_id) : null,
                            sets: parseInt(formData.sets),
                            reps: parseInt(formData.reps),
                            weight: parseFloat(formData.weight),
                            notes: formData.notes
                        }
                    ]);
                if (error) throw error;
                alert('Workout logged successfully!');
                setFormData({ exercise_id: '', reps: '', sets: '', weight: '', notes: '' });
            } else {
                // fallback for demo without auth
                console.log('Logged (Local):', formData);
                alert('Workout logged (Demo Mode - Auth not connected)');
                setFormData({ exercise_id: '', reps: '', sets: '', weight: '', notes: '' });
            }

        } catch (error) {
            console.error('Error logging workout:', error);
            alert('Error logging workout. See console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Log Workout</h1>
                <p className="mt-2 text-gray-400">Record your progress and keep the streak alive.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="exercise" className="mb-2 block text-sm font-medium text-gray-300">
                            Exercise
                        </label>
                        <select
                            id="exercise"
                            required
                            className="block w-full rounded-lg border border-gray-600 bg-gray-800 p-2.5 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.exercise_id}
                            onChange={(e) => setFormData({ ...formData, exercise_id: e.target.value })}
                        >
                            <option value="">Select an exercise</option>
                            {exercises.map((ex) => (
                                <option key={ex.id} value={ex.id}>{ex.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <Input
                                label="Sets"
                                id="sets"
                                type="number"
                                placeholder="3"
                                required
                                value={formData.sets}
                                onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                            />
                        </div>
                        <div>
                            <Input
                                label="Reps"
                                id="reps"
                                type="number"
                                placeholder="10"
                                required
                                value={formData.reps}
                                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                            />
                        </div>
                        <div>
                            <Input
                                label="Weight (kg)"
                                id="weight"
                                type="number"
                                placeholder="60"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-300">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            rows={4}
                            className="block w-full rounded-lg border border-gray-600 bg-gray-800 p-2.5 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="How did it feel? Any pain or PRs?"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Saving...' : 'Log Workout'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
