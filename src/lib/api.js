import { supabase } from './supabase';

const FALLBACK_PLANS = [
    {
        id: 1,
        title: 'Beginner Full Body',
        difficulty: 'Beginner',
        duration: '4 Weeks',
        image_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Perfect for starting your fitness journey. Builds a solid foundation.',
    },
    {
        id: 2,
        title: 'HIIIT Cardio Blast',
        difficulty: 'Intermediate',
        duration: '6 Weeks',
        image_url: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'High intensity interval training to burn fat and improve endurance.',
    },
    {
        id: 3,
        title: 'Advanced Hypertrophy',
        difficulty: 'Advanced',
        duration: '8 Weeks',
        image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Maximize muscle growth with this intense split routine.',
    }
];

const FALLBACK_EXERCISES = [
    { id: 1, name: 'Bench Press', target_muscle_group: 'Chest', description: 'Compound push exercise.' },
    { id: 2, name: 'Squat', target_muscle_group: 'Legs', description: 'Compound leg exercise.' },
    { id: 3, name: 'Deadlift', target_muscle_group: 'Back', description: 'Full body compound pull.' },
    { id: 4, name: 'Overhead Press', target_muscle_group: 'Shoulders', description: 'Compound vertical push.' },
    { id: 5, name: 'Pull Up', target_muscle_group: 'Back', description: 'Compound vertical pull.' },
    { id: 6, name: 'Dumbbell Row', target_muscle_group: 'Back', description: 'Unilateral back exercise.' },
    { id: 7, name: 'Lunges', target_muscle_group: 'Legs', description: 'Unilateral leg exercise.' },
    { id: 8, name: 'Plank', target_muscle_group: 'Core', description: 'Isometric core stability.' },
];

export const api = {
    // Fetch all plans
    async getPlans() {
        try {
            const { data, error } = await supabase
                .from('plans')
                .select('*')
                .order('id');

            if (error || !data || data.length === 0) throw error || new Error('No data');
            return data;
        } catch (e) {
            console.warn('API Error (getPlans) - Using Fallback:', e);
            return FALLBACK_PLANS;
        }
    },

    // Fetch a single plan with its exercises
    async getPlanDetails(planId) {
        try {
            // 1. Get Plan Info
            const { data: plan, error: planError } = await supabase
                .from('plans')
                .select('*')
                .eq('id', planId)
                .single();

            if (planError) throw planError;

            // 2. Get Exercises for this plan
            const { data: exercises, error: exercisesError } = await supabase
                .from('plan_exercises')
                .select(`
                    id,
                    day_number,
                    sets,
                    reps,
                    notes,
                    exercises (
                        id,
                        name,
                        target_muscle_group,
                        description,
                        video_url
                    )
                `)
                .eq('plan_id', planId)
                .order('day_number', { ascending: true })
                .order('order_index', { ascending: true });

            if (exercisesError) throw exercisesError;

            return { plan, exercises };
        } catch (e) {
            console.warn('API Error (getPlanDetails) - Using Fallback:', e);
            // Fallback for details
            const plan = FALLBACK_PLANS.find(p => p.id == planId) || FALLBACK_PLANS[0];

            // Create some dummy schedule
            const exercises = [
                { id: 101, day_number: 1, sets: 3, reps: '10', notes: 'Focus on form', exercises: FALLBACK_EXERCISES[1] }, // Squat
                { id: 102, day_number: 1, sets: 3, reps: '10', notes: 'Touch chest', exercises: FALLBACK_EXERCISES[0] }, // Bench
                { id: 103, day_number: 1, sets: 3, reps: '12', notes: 'Keep back straight', exercises: FALLBACK_EXERCISES[5] }, // Row

                { id: 104, day_number: 2, sets: 3, reps: '5', notes: 'Heavy', exercises: FALLBACK_EXERCISES[2] }, // Deadlift
                { id: 105, day_number: 2, sets: 3, reps: '8', notes: 'Full BOM', exercises: FALLBACK_EXERCISES[3] }, // OHP
            ];
            return { plan, exercises };
        }
    },

    // Fetch all exercises for the log page
    async getExercises() {
        try {
            const { data, error } = await supabase
                .from('exercises')
                .select('*')
                .order('name');

            if (error || !data || data.length === 0) throw error || new Error('No data');
            return data;
        } catch (e) {
            console.warn('API Error (getExercises) - Using Fallback:', e);
            return FALLBACK_EXERCISES;
        }
    },

    // Get basic stats
    async getWorkoutStatus() {
        try {
            const { count, error } = await supabase
                .from('workout_logs')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;
            return { totalWorkouts: count };
        } catch (e) {
            console.warn('API Error (getWorkoutStatus) - Using Fallback:', e);
            return { totalWorkouts: 0 };
        }
    }
};
