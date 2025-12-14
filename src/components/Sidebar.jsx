import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({onStartAddThought , thoughts , onSelectThought , selectedThoughtId, onLogout, user, onResetUsername}){
    const [searchQuery, setSearchQuery] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        onLogout();
        setShowLogoutConfirm(false);
        navigate('/');
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const filteredThoughts = thoughts.filter(thought => 
        (thought.userId === user.uid) &&
        thought.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <>
            <aside className=" w-1/2 px-8 py-10 bg-stone-900 text-stone-50 md:w-80 rounded-r-xl h-screen flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="font-bold uppercase md:text-xl text-stone-200 mt-1">
                    MY THOUGHTS
                    </h2>
                    <div className="flex flex-col gap-2 items-end">
                        <button onClick={handleLogoutClick} className="px-3 py-1 text-sm md:text-base font-semibold rounded-md text-stone-400 hover:text-red-500 transition-colors">
                            Logout
                        </button>
                        <button onClick={onResetUsername} className="px-3 py-1 text-sm md:text-sm font-semibold rounded-md text-stone-500 hover:text-blue-500 transition-colors">
                            Reset Name
                        </button>
                    </div>
                </div>
                
                <hr className="border-stone-800 mb-8" />
                
                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search thoughts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-800 text-stone-200 rounded border border-stone-700 focus:outline-none focus:border-stone-500"
                    />
                </div>

                <div className="mb-6">
                    {!selectedThoughtId && (
                        <button onClick={onStartAddThought} className="w-full px-4 py-2 text-xs md:text-base rounded-md bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-100 transition-colors">
                            + Add new Thought
                        </button>
                    )}
                </div>

                <ul className="mt-4 flex-1 overflow-y-auto">
                    {filteredThoughts.length === 0 && searchQuery && (
                        <li className="text-stone-500 text-sm px-2 py-1">No thoughts found</li>
                    )}
                    {filteredThoughts.map((thought) => {
                        return (
                            <li key={thought.id}>
                                <button
                                    onClick={() => onSelectThought(thought.id)}
                                    className={`w-full text-left px-2 py-1 rounded-md my-1 hover:text-stone-100 ${
                                        thought.id === selectedThoughtId
                                            ? 'bg-stone-800 text-stone-100'
                                            : 'text-stone-400'
                                    }`}
                                >
                                    {thought.title}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-xl font-bold text-stone-800 mb-4">Confirm Logout</h3>
                        <p className="text-stone-600 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={cancelLogout}
                                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}