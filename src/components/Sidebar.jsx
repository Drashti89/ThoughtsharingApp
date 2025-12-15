import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({isOpen, onClose, onStartAddThought , thoughts , onSelectThought , selectedThoughtId, onLogout, user, onResetUsername}){
    const [searchQuery, setSearchQuery] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = async () => {
        await onLogout();
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
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={onClose}
                />
            )}
            
            <aside className={`w-[80%] md:w-96 lg:w-72 px-4 md:px-8 py-6 md:py-10 bg-stone-900 text-stone-50 md:rounded-r-xl md:h-screen flex flex-col fixed top-0 left-0 bottom-0 md:relative md:static z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">💭</span>
                        <div>
                            <h2 className="font-bold md:text-xl text-stone-100 leading-tight">
                                My Thoughts
                            </h2>
                            <p className="text-xs text-stone-400 mt-1">Your personal space</p>
                        </div>
                        {/* Close button for mobile */}
                        <button onClick={onClose} className="md:hidden p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-all duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 items-end md:items-center">
                        <button onClick={handleLogoutClick} className="px-4 py-2 text-sm font-semibold rounded-xl text-stone-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
                            🚪 Logout
                        </button>
                        <button onClick={onResetUsername} className="px-4 py-2 text-sm font-semibold rounded-xl text-stone-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200">
                            🔄 Reset Name
                        </button>
                    </div>
                </div>
                
                <div className="bg-stone-800/50 rounded-xl p-4 mb-8">
                    <h3 className="text-sm font-semibold text-stone-300 mb-3">✨ Quick Actions</h3>
                    {!selectedThoughtId && (
                        <button onClick={onStartAddThought} className="w-full px-4 py-3 text-sm md:text-base rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                            ✨ Add new Thought
                        </button>
                    )}
                </div>
                
                {/* Search Input */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="🔍 Search your thoughts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 bg-stone-800 text-stone-200 rounded-xl border border-stone-700 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 placeholder-stone-400 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Thoughts List */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">📚</span>
                        <h3 className="text-sm font-semibold text-stone-300">Your Thoughts ({filteredThoughts.length})</h3>
                    </div>
                    
                    {filteredThoughts.length === 0 && searchQuery && (
                        <div className="text-center py-8">
                            <span className="text-3xl block mb-2">🔍</span>
                            <p className="text-stone-500 text-sm">No thoughts found</p>
                        </div>
                    )}
                    
                    {filteredThoughts.length === 0 && !searchQuery && (
                        <div className="text-center py-8">
                            <span className="text-3xl block mb-2">📝</span>
                            <p className="text-stone-500 text-sm">No thoughts yet</p>
                            <p className="text-stone-600 text-xs mt-1">Create your first one above!</p>
                        </div>
                    )}
                    
                    <ul className="space-y-2">
                        {filteredThoughts.map((thought) => {
                            return (
                                <li key={thought.id}>
                                    <button
                                        onClick={() => onSelectThought(thought.id)}
                                        className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 ${
                                            thought.id === selectedThoughtId
                                                ? 'bg-violet-500/20 text-violet-100 border border-violet-400/30'
                                                : 'text-stone-300 hover:bg-stone-800/50 hover:text-stone-100'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <span className="text-sm mt-0.5">💭</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{thought.title}</p>
                                                <p className="text-xs text-stone-500 mt-0.5">
                                                    {new Date(thought.createdAt?.toDate ? thought.createdAt.toDate() : thought.createdAt || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-stone-100">
                        <div className="text-center mb-6">
                            <span className="text-4xl block mb-3">🚪</span>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">Ready to leave?</h3>
                            <p className="text-stone-600">Are you sure you want to logout?</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelLogout}
                                className="flex-1 px-4 py-3 text-stone-600 hover:bg-stone-100 rounded-xl transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}