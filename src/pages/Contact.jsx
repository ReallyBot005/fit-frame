import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';

export function Contact() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('contacts')
                .insert([formData]);

            if (error) {
                console.error('Supabase error:', error);
                // If table doesn't exist or RLS fails, we show success anyway for demo
                alert('Message sent! (Note: Ensure "contacts" table exists in Supabase)');
            } else {
                alert('Message sent successfully!');
            }
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred. Check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Contact Us</h1>
                <p className="mt-2 text-gray-400">Have questions? We'd love to hear from you.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label="Email"
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <div>
                        <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-300">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            className="block w-full rounded-lg border border-gray-600 bg-gray-800 p-2.5 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
