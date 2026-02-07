import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PLANS = [
    {
        title: 'Beginner Full Body',
        difficulty: 'Beginner',
        duration: '4 Weeks',
        image_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Perfect for starting your fitness journey. Builds a solid foundation.',
    },
    {
        title: 'HIIIT Cardio Blast',
        difficulty: 'Intermediate',
        duration: '6 Weeks',
        image_url: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'High intensity interval training to burn fat and improve endurance.',
    },
    {
        title: 'Advanced Hypertrophy',
        difficulty: 'Advanced',
        duration: '8 Weeks',
        image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Maximize muscle growth with this intense split routine.',
    }
];

const EXERCISES = [
    { name: 'Bench Press', target_muscle_group: 'Chest', description: 'Compound push exercise for chest, shoulders, and triceps.' },
    { name: 'Squat', target_muscle_group: 'Legs', description: 'Compound leg exercise for quads, glutes, and core.' },
    { name: 'Deadlift', target_muscle_group: 'Back', description: 'Full body compound pull exercise.' },
    { name: 'Overhead Press', target_muscle_group: 'Shoulders', description: 'Compound vertical push.' },
    { name: 'Pull Up', target_muscle_group: 'Back', description: 'Compound vertical pull.' },
    { name: 'Dumbbell Row', target_muscle_group: 'Back', description: 'Unilateral back exercise.' },
    { name: 'Lunges', target_muscle_group: 'Legs', description: 'Unilateral leg exercise.' },
    { name: 'Plank', target_muscle_group: 'Core', description: 'Isometric core stability.' },
];

async function seed() {
    console.log('Starting seed...');

    // 1. Insert Plans
    console.log('Seeding Plans...');
    const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .upsert(PLANS, { onConflict: 'title' })
        .select();

    if (plansError) {
        console.error('Error seeding plans:', plansError);
    } else {
        console.log(`Inserted ${plansData.length} plans.`);
    }

    // 2. Insert Exercises
    console.log('Seeding Exercises...');
    const { data: exData, error: exError } = await supabase
        .from('exercises')
        .upsert(EXERCISES, { onConflict: 'name' })
        .select();

    if (exError) {
        console.error('Error seeding exercises:', exError);
    } else {
        console.log(`Inserted ${exData.length} exercises.`);
    }

    if (!plansData || !exData) return;

    // 3. Link Exercises to Plans (Simple Mock Schedule)
    console.log('Linking Exercises to Plans...');
    const planExercises = [];
    const beginnerPlan = plansData.find(p => p.title === 'Beginner Full Body');

    if (beginnerPlan) {
        // Day 1
        planExercises.push(
            { plan_id: beginnerPlan.id, exercise_id: exData.find(e => e.name === 'Squat').id, day_number: 1, sets: 3, reps: '10', order_index: 1 },
            { plan_id: beginnerPlan.id, exercise_id: exData.find(e => e.name === 'Bench Press').id, day_number: 1, sets: 3, reps: '10', order_index: 2 },
            { plan_id: beginnerPlan.id, exercise_id: exData.find(e => e.name === 'Dumbbell Row').id, day_number: 1, sets: 3, reps: '12', order_index: 3 }
        );
        // Day 2
        planExercises.push(
            { plan_id: beginnerPlan.id, exercise_id: exData.find(e => e.name === 'Deadlift').id, day_number: 2, sets: 3, reps: '5', order_index: 1 },
            { plan_id: beginnerPlan.id, exercise_id: exData.find(e => e.name === 'Overhead Press').id, day_number: 2, sets: 3, reps: '10', order_index: 2 },
            { plan_id: beginnerPlan.id, exercise_id: exData.find(e => e.name === 'Pull Up').id, day_number: 2, sets: 3, reps: 'AMRAP', order_index: 3 }
        );
    }

    if (planExercises.length > 0) {
        const { error: linkError } = await supabase.from('plan_exercises').insert(planExercises);
        if (linkError) console.error('Error linking exercises:', linkError);
        else console.log('Linked exercises to plans successfully.');
    }

    console.log('Seed completed!');
}

seed();
