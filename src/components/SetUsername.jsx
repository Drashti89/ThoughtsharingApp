import { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SetUsername() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const checkUsernameExists = async (username) => {
        const q = query(collection(db, 'users'), where('username', '==', username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const trimmedUsername = username.trim();

        // Validation
        if (trimmedUsername.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        setLoading(true);

        try {
            // Check if username already exists
            const exists = await checkUsernameExists(trimmedUsername);
            if (exists) {
                setError('Username already taken. Please choose another.');
                setLoading(false);
                return;
            }

            // Save username to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                username: trimmedUsername,
                createdAt: serverTimestamp(),
            });

            // Redirect to main app
            navigate('/');
        } catch (err) {
            setError('Failed to set username. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h1 className="text-2xl font-bold text-stone-800 mb-2">Welcome!</h1>
                <p className="text-stone-600 mb-6">Please set your username to continue</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-stone-700 text-sm font-semibold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                            placeholder="Enter username (min 3 characters)"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 disabled:bg-stone-400 transition-colors"
                    >
                        {loading ? 'Setting username...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
