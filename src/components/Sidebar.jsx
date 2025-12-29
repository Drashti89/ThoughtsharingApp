import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toDate } from '../utils/timestampUtils';

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

    const userId = user?.uid;

    // Check if current view is mobile (below md breakpoint - 768px)
    const isMobileView = () => {
        return typeof window !== 'undefined' && window.innerWidth < 768;
    };

    // Handle thought selection with mobile sidebar close
    const handleThoughtSelect = (thoughtId) => {
        onSelectThought(thoughtId);
        // Close sidebar on mobile view only
        if (isMobileView() && isOpen) {
            onClose();
        }
    };

    // 1️⃣ filter
    const filteredThoughts = thoughts.filter(thought =>
    userId &&
    thought.userId === userId &&
    thought.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2️⃣ dedupe
    const uniqueFilteredThoughts = Array.from(
    new Map(filteredThoughts.map(t => [t.id, t])).values()
    );

  
     

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden animate-in fade-in"
                    style={{ animationDuration: '1.5s' }}
                    onClick={onClose}
                />
            )}
             
          <aside
            className={`
                w-[85%] md:w-[380px] lg:w-[360px]
                px-3 md:px-8 py-4 md:py-10
                bg-stone-900 text-stone-50
                md:rounded-r-xl
                flex flex-col

                fixed md:static
                top-0 left-0 bottom-0
                h-screen

                overflow-y-auto
                scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900

                mt-0 md:mt-6 lg:mt-8
                z-50

                slow-soft-transition
                ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
                md:translate-x-0 md:opacity-100
                md:transition-none
            `}
            
            >

              {/* HEADER */}
                   <div className="mb-4 md:mb-6  relative">

                    <div className="mb-4 md:mb-6 mt-2 md:mt-4">

                    {/* Hi Username (now on top, centered & bigger) */}
                    <div className="flex justify-center mt-10 mb-3 md:mb-0">
                    <div className="flex items-center gap-1 md:gap-2 bg-stone-800/70 px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                        <span className="text-sm">👋</span>
                        <p className="text-sm sm:text-base font-semibold text-stone-100">
                        Hi, {user?.username}
                        </p>
                    </div>
                    </div>


                    {/* My Thoughts + Actions */}
                    <div className="px-4 pt-6 md:pt-8">
                    <div className="flex items-center justify-between">

                        {/* Left: My Thoughts */}
                        
                        <div className="flex items-center gap-1 md:gap-3">
                        <span className="text-base md:text-2xl">💭</span>
                        <div>
                            <h2 className="font-bold text-xs sm:text-sm md:text-lg text-stone-100 leading-tight">
                            My Thoughts
                            </h2>
                            <p className="text-xs sm:text-xs text-stone-400 mt-0.5">
                            Your personal space
                            </p>
                        </div>
                        </div>

                        {/* Right: Logout + Reset */}
                        <div className="flex flex-col items-start gap-1 md:gap-2 mt-0 md:mt-1">
                        <button
                            onClick={handleLogoutClick}
                            className="
                                w-full
                                flex items-center gap-1 md:gap-2
                                px-2 py-1 md:px-5 md:py-2
                                text-xs md:text-base font-semibold
                                rounded-xl
                                text-stone-300
                                hover:text-red-400
                                hover:bg-red-500/10
                                transition-all
                            "
                        >
                             <span className="w-3 md:w-5 text-center">🚪</span>
                             <span className='ml-1 md:ml-4 text-xs sm:text-sm'>Logout</span>
                         </button>

                          <button
                            onClick={onResetUsername}
                            className="
                                w-full
                                flex items-center gap-1 md:gap-2
                                px-2 py-1 md:px-5 md:py-2
                                text-xs md:text-base font-semibold
                                rounded-xl
                                text-stone-400
                                hover:text-blue-400
                                hover:bg-blue-500/10
                                transition-all
                            "
                        >
                             <span className="w-3 md:w-5 text-center">🔄</span>
                             <span className='text-xs sm:text-sm'> Reset Name</span>
                        </button>
                    </div>


                </div>
            </div>
        </div>
        </div>

                 <div className="bg-stone-800/50 rounded-xl p-2 md:p-4 mb-4 md:mb-8">
                     
                    {!selectedThoughtId && (
                        <button onClick={onStartAddThought} className="w-full px-2 py-1.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-sm rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                            ✨ Add new Thought
                        </button>
                    )}
                </div>
                 
                {/* Search Input */}
                <div className="mb-3 md:mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="🔍 Search your thoughts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-2 py-1.5 md:px-4 md:py-3 bg-stone-800 text-stone-200 rounded-xl border border-stone-700 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 placeholder-stone-400 transition-all duration-200 text-xs sm:text-sm md:text-sm"
                        />
                    </div>
                </div>

                {/* Thoughts List */}
                <div className="flex-1 overflow-y-auto pr-1 pb-6">
                    <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
                        <span className="text-xs md:text-lg">📚</span>
                        <h3 className="text-xs sm:text-sm md:text-sm font-semibold text-stone-300">Your Thoughts ({uniqueFilteredThoughts.length})</h3>
                    </div>
                     

                    {filteredThoughts.length === 0 && searchQuery && (
                        <div className="text-center py-4 md:py-8">
                            <span className="text-xl md:text-3xl block mb-2">🔍</span>
                            <p className="text-stone-500 text-xs md:text-sm">No thoughts found</p>
                        </div>
                    )}
                     
                    
                    {filteredThoughts.length === 0 && !searchQuery && (
                        <div className="text-center py-4 md:py-8">
                            <span className="text-xl md:text-3xl block mb-2">📝</span>
                            <p className="text-stone-500 text-xs md:text-sm">No thoughts yet</p>
                            <p className="text-stone-600 text-xs mt-1">Create your first one above!</p>
                        </div>
                    )}
                    
                     

                    <ul className="space-y-1 md:space-y-2">
                        {uniqueFilteredThoughts.map((thought)=> {
                            return (
                                <li key={thought.id}>
                                    <button
                                        onClick={() => handleThoughtSelect(thought.id)}
                                        className={`w-full text-left px-1.5 py-1 md:px-3 md:py-2 rounded-xl transition-all duration-200 ${
                                            thought.id === selectedThoughtId
                                                ? 'bg-violet-500/20 text-violet-100 border border-violet-400/30'
                                                : 'text-stone-300 hover:bg-stone-800/50 hover:text-stone-100'
                                        }`}
                                    >
                                        <div className="flex items-start gap-1 md:gap-2">
                                            <span className="text-xs md:text-sm mt-0.5">💭</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm md:text-sm font-medium truncate">{thought.title}</p>
                                                <p className="text-xs sm:text-xs text-stone-500 mt-0.5">
                                                    {toDate(thought.createdAt).toLocaleDateString()}
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
                            <p className="text-stone-600">Are you sure you want to leave your memory area ?</p>
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