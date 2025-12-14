import { useSelector } from 'react-redux';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function NotesGrid({ thoughts, onSelectThought, selectedThoughtId, onDelete, user, onToggleLike }) {
    const likedThoughtIds = useSelector(state => state.ui.likedThoughtIds);

    return (
        <div className="w-full mt-16 px-8">
            <h2 className="text-3xl font-bold text-stone-700 mb-8">Welcome {user && user.username} ❤️</h2>
            
            {thoughts.length === 0 && (
                <p className="text-stone-600 text-center py-12">
                    No notes yet. <br /> Click "+ Add new Thought" to create one!
                </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg flex flex-col justify-between min-h-[250px] ${
                                isSelected ? 'ring-2 ring-blue-500' : ''
                            }`}
                        >
                            <div>
                                {/* Title */}
                                <h3 className="text-lg font-semibold text-stone-800 mb-6 line-clamp-1 tracking-wide">
                                    {thought.title}
                                </h3>

                                {/* Description (truncated) */}
                                <p className="text-stone-600 text-sm mb-4 line-clamp-3 tracking-wide">
                                    {thought.description}
                                </p>
                            </div>
                            
                            <div>
                                {/* Likes */}
                                <div className="flex items-center gap-1.5 mb-3">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleLike(thought.id);
                                        }}
                                        className="focus:outline-none transition-transform active:scale-125 hover:scale-110"
                                    >
                                        {isLiked ? (
                                            <FaHeart className="text-xl drop-shadow-sm" style={{ color: '#ed4956' }} />
                                        ) : (
                                            <FaRegHeart className="text-stone-400 text-xl hover:text-stone-600" />
                                        )}
                                    </button>
                                    <span className="text-sm text-stone-600 font-semibold min-w-[20px]">
                                        {thought.likesCount || 0}
                                    </span>
                                </div>
                                
                                {/* Username and Date - ABOVE View Details */}
                                <p className="text-stone-500 text-xs mb-3 font-medium">
                                    {thought.username || 'Unknown'} • Created: {new Date(thought.createdAt?.toDate ? thought.createdAt.toDate() : thought.createdAt || Date.now()).toLocaleDateString()}
                                </p>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectThought(thought.id);
                                        }}
                                        className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                                    >
                                        View Details
                                    </button>
                                    
                                    {(isOwner || isAdmin) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(thought.id);
                                            }}
                                            className="px-3 py-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                                        >
                                            Delete
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
