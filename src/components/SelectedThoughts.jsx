import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function SelectedThoughts ({thought , onDelete , onEdit, onCancel, user, onToggleLike}){
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(thought.title);
    const [editedDescription, setEditedDescription] = useState(thought.description);
     
    // ✅ Fix: Check likedBy array directly on the thought object
    const isLiked = user && thought.likedBy && thought.likedBy.includes(user.uid);

    // Update edited values when thought changes
    useEffect(() => {
        setEditedTitle(thought.title);
        setEditedDescription(thought.description);
        setIsEditing(false);
    }, [thought.id]);
     
    const handleSave = () => {
        onEdit({
            ...thought,
            title: editedTitle,
            description: editedDescription
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset to original values
        setEditedTitle(thought.title);
        setEditedDescription(thought.description);
        setIsEditing(false);
    };
     
    return (
        <div className="w-full">
            {/* Back Button */}
            <button
                onClick={onCancel}
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-stone-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-200 font-medium"
            >
                <span>←</span>
                Back to Thoughts
            </button>

            <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
                {/* Thought Header */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-6 border-b border-stone-100">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">💭</span>
                                <span className="text-sm text-stone-500 font-medium px-3 py-1 bg-white rounded-full shadow-sm">
                                    {thought.username || 'Unknown'}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 leading-tight">
                                {thought.title}
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-6">
                            <button
                                onClick={() => onToggleLike(thought.id)}
                                className="focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95 p-2 rounded-full hover:bg-white/50"
                            >
                                {isLiked ? (
                                    <FaHeart className="text-2xl drop-shadow-sm" style={{ color: '#ed4956' }} />
                                ) : (
                                    <FaRegHeart className="text-stone-400 text-2xl hover:text-pink-500" />
                                )}
                            </button>
                            <span className="text-lg text-stone-700 font-semibold min-w-[30px]">
                                {thought.likesCount || 0}
                            </span>
                        </div>
                    </div>
                    
                    <p className="text-stone-600 text-sm mt-3">
                        📅 Created: {new Date(thought.createdAt?.toDate ? thought.createdAt.toDate() : thought.createdAt || Date.now()).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Thought Content */}
                <div className="p-8">
                    {isEditing ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">
                                    ✏️ Title
                                </label>
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="w-full text-xl font-semibold text-stone-800 px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">
                                    💝 Your Thought
                                </label>
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    className="w-full text-stone-700 whitespace-pre-wrap px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors leading-relaxed"
                                    rows="10"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                    onClick={handleSave}
                                >
                                    💾 Save Changes
                                </button>
                                <button
                                    className="px-6 py-3 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-all duration-200 font-medium"
                                    onClick={handleCancel}
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="prose prose-stone max-w-none">
                                <p className="text-stone-700 text-lg leading-relaxed whitespace-pre-wrap">
                                    {thought.description}
                                </p>
                            </div>
                            
                            {!isEditing && (
                                <div className="flex gap-3 mt-8 pt-6 border-t border-stone-100">
                                    {user && thought.userId === user.uid && (
                                        <button
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            ✏️ Edit Thought
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}