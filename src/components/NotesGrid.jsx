import { useSelector } from 'react-redux';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function NotesGrid({ thoughts, onSelectThought, selectedThoughtId, onDelete, user, onToggleLike }) {
    const likedThoughtIds = useSelector(state => state.ui.likedThoughtIds);

    return (
        <div className="w-full mt-8 md:mt-12">
            {/* Welcome Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-4">
                    <span className="text-4xl">🌟</span>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-stone-800 leading-tight">
                        Welcome back, {user && user.username}!
                    </h2>
                    <span className="text-4xl">✨</span>
                </div>
                <p className="text-stone-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                    Ready to capture some beautiful thoughts today?
                </p>
            </div>
            
            {thoughts.length === 0 && (
                <div className="text-center py-16">
                    <div className="mb-6">
                        <span className="text-6xl">📝</span>
                    </div>
                    <h3 className="text-xl font-semibold text-stone-700 mb-3">No thoughts yet</h3>
                    <p className="text-stone-600 text-lg leading-relaxed">
                        Click "+ Add new Thought" in the sidebar to create your first memory!
                    </p>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {thoughts.map((thought) => {
                    const isSelected = thought.id === selectedThoughtId;
                    const isOwner = user && thought.userId === user.uid;
                    const isAdmin = user && user.isAdmin;
                    
                    // ✅ Fix: Check likedBy array directly on the thought object
                    const isLiked = user && thought.likedBy && thought.likedBy.includes(user.uid);
                    
                    return (
                        <div
                            key={thought.id}
                            onClick={() => onSelectThought(thought.id)}
                            className={`group bg-white rounded-2xl shadow-md hover:shadow-xl border border-stone-100 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[280px] ${
                                isSelected ? 'ring-2 ring-violet-400 shadow-lg' : ''
                            }`}
                        >
                            <div className="flex-1">
                                {/* Thought Emoji/Icon */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl">💭</span>
                                    <span className="text-xs text-stone-400 font-medium px-2 py-1 bg-stone-50 rounded-full">
                                        {new Date(thought.createdAt?.toDate ? thought.createdAt.toDate() : thought.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-stone-800 mb-4 line-clamp-2 leading-relaxed group-hover:text-violet-700 transition-colors">
                                    {thought.title}
                                </h3>

                                {/* Description (truncated) */}
                                <p className="text-stone-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                    {thought.description}
                                </p>
                            </div>
                            
                            <div>
                                {/* Username and Stats */}
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-stone-500 text-sm font-medium">
                                        by {thought.username || 'Unknown'}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleLike(thought.id);
                                            }}
                                            className="focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95"
                                        >
                                            {isLiked ? (
                                                <FaHeart className="text-lg drop-shadow-sm" style={{ color: '#ed4956' }} />
                                            ) : (
                                                <FaRegHeart className="text-stone-400 text-lg hover:text-pink-500" />
                                            )}
                                        </button>
                                        <span className="text-sm text-stone-600 font-semibold min-w-[20px]">
                                            {thought.likesCount || 0}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectThought(thought.id);
                                        }}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        📖 Read More
                                    </button>
                                    
                                    {(isOwner || isAdmin) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(thought.id);
                                            }}
                                            className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl text-sm font-medium hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
