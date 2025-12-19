import { useSelector } from 'react-redux';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toDate } from '../utils/timestampUtils';



export default function NotesGrid({ thoughts, onSelectThought, selectedThoughtId, onDelete, user, onToggleLike, onStartWriting }) {
        const uniqueThoughts = Array.from(
                new Map(thoughts.map(t => [t.id, t])).values()
            );

    return (
       <div className="w-full mt-8 md:mt-14">
             {/* welcome header */}
            <div className="text-center mb-6 md:mb-12">
                <div className="inline-flex items-center gap-1 md:gap-3 mb-2 md:mb-4">
                    <span className="text-xl md:text-4xl">🌟</span>
                    <h2 className="text-sm sm:text-base md:text-4xl font-extrabold text-stone-800 leading-tight">
                        Welcome back, <span className="text-xs md:text-base">{user && user.username}</span>!
                    </h2>
                    <span className="text-xl md:text-4xl">✨</span>
                </div>
                <p className="text-stone-600 text-xs md:text-xl leading-relaxed max-w-xl mx-auto">
                    Ready to capture some beautiful thoughts today?
                </p>
            </div>
             
            {thoughts.length === 0 && (
                <div className="text-center py-8 md:py-16">
                    <div className="mb-3 md:mb-6">
                        <span className="text-3xl md:text-6xl">📝</span>
                    </div>
                    <h3 className="text-base md:text-xl font-semibold text-stone-700 mb-1 md:mb-3">No thoughts yet</h3>
                    <p className="text-stone-600 text-xs md:text-lg leading-relaxed mb-3 md:mb-6">
                        Click "+ Add new Thought" in the sidebar to create your first memory!
                    </p>
                    <div className="flex flex-col items-center gap-1 md:gap-3">
                        <p className="text-stone-500 text-xs md:text-sm">
                            ⭐ Make your first thought public
                        </p>
                        <button
                            onClick={onStartWriting}
                            className="inline-flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-6 md:py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-xs md:text-base"
                        >
                            ✨ Start Writing
                        </button>
                    </div>
                </div>
            )}
             
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                {uniqueThoughts.map((thought)  => {
                    const isSelected = thought.id === selectedThoughtId;
                    const isOwner = user && thought.userId === user.uid;
                    const isAdmin = user && user.isAdmin;
                     
                    // ✅ Fix: Check likedBy array directly on the thought object
                    const isLiked = user && thought.likedBy && thought.likedBy.includes(user.uid);
                     
                    // Get visibility icon and label
                    const thoughtVisibility = thought.visibility || 'public';
                    const visibilityIcon = thoughtVisibility === 'public' ? '🌍' : '🔒';
                    const visibilityLabel = thoughtVisibility === 'public' ? 'Public' : 'Private';
                     
                    return (
                        <div
                            key={thought.id}
                            onClick={() => onSelectThought(thought.id)}
                            className={`group bg-white rounded-2xl shadow-md hover:shadow-xl border border-stone-100 p-3 md:p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[200px] md:min-h-[280px] ${
                                isSelected ? 'ring-2 ring-violet-400 shadow-lg' : ''
                            }`}
                        >
                            <div className="flex-1">
                                {/* Thought Header with Visibility */}
                                <div className="flex items-center justify-between mb-2 md:mb-4">
                                    <div className="flex items-center gap-1 md:gap-3">
                                        <span className="text-base md:text-2xl">💭</span>
                                        <span
                                            className="text-xs font-medium px-1.5 py-0.5 md:px-2 md:py-1 rounded-full flex items-center gap-1"
                                            style={{
                                                backgroundColor: thoughtVisibility === 'public' ? '#dcfce7' : '#fef3c7',
                                                color: thoughtVisibility === 'public' ? '#166534' : '#92400e'
                                            }}
                                            title={thoughtVisibility === 'public' ? '🌍 Public — visible to everyone' : '🔒 Private — only visible to you'}
                                        >
                                            <span>{visibilityIcon}</span>
                                            {visibilityLabel}
                                        </span>
                                    </div>
                                    <span className="text-xs text-stone-400 font-medium px-1.5 py-0.5 md:px-2 md:py-1 bg-stone-50 rounded-full">
                                        {toDate(thought.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
 
                                {/* Title */}
                                <h3 className="text-xs md:text-xl font-bold text-stone-800 mb-2 md:mb-4 line-clamp-2 leading-relaxed group-hover:text-violet-700 transition-colors">
                                    {thought.title}
                                </h3>
 
                                {/* Description (truncated) */}
                                <p className="text-stone-600 text-xs md:text-sm mb-3 md:mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed">
                                    {thought.description}
                                </p>
                            </div>
                             
                            <div>
                                {/* Username and Stats */}
                                <div className="flex items-center justify-between mb-2 md:mb-4">
                                    <p className="text-stone-500 text-xs md:text-sm font-medium">
                                        by {thought.username || 'Unknown'}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => {
                                               e.stopPropagation();
                                                if (isOwner || thought.visibility === 'public') {
                                                    onToggleLike(thought.id);
                                                }
                                            }}
                                            className="focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95"
                                        >
                                            {isLiked ? (
                                                <FaHeart className="text-xs md:text-lg drop-shadow-sm" style={{ color: '#ed4956' }} />
                                            ) : (
                                                <FaRegHeart className="text-stone-400 text-xs md:text-lg hover:text-pink-500" />
                                            )}
                                        </button>
                                        <span className="text-xs md:text-sm text-stone-600 font-semibold min-w-[16px] md:min-w-[20px]">
                                            {thought.likedBy ? thought.likedBy.length : 0}
                                        </span>
                                    </div>
                                </div>
                                 
                                {/* Action Buttons */}
                                <div className="flex gap-1 md:gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectThought(thought.id);
                                        }}
                                        className="flex-1 px-2 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-xs md:text-sm font-medium hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        📖 Read More
                                    </button>
                                     
                                   {(isOwner || (isAdmin && thought.visibility === 'public')) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(thought.id);
                                            }}
                                            className="px-2 py-1.5 md:px-4 md:py-2 bg-stone-100 text-stone-600 rounded-xl text-xs md:text-sm font-medium hover:bg-red-100 hover:text-red-600 transition-all duration-200"
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
