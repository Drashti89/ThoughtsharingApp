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
        <div className="w-[35rem] mt-16">
            <div className="p-6 bg-white rounded-xl shadow-lg">
                <div className="flex flex-col">
                    <div className="w-full">
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="w-full text-xl font-semibold text-stone-700 mb-4 p-2 border rounded-lg"
                                />
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    className="w-full text-stone-600 whitespace-pre-wrap p-2 border rounded-lg mb-4 text-base"
                                    rows="6"
                                />
                                <div className="flex gap-3">
                                    <button
                                        className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h1 className="text-xl font-semibold text-stone-800 flex-1 mr-4">
                                        {thought.title}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => onToggleLike(thought.id)}
                                            className="focus:outline-none transition-transform active:scale-125 hover:scale-110"
                                        >
                                            {isLiked ? (
                                                <FaHeart className="text-2xl drop-shadow-sm" style={{ color: '#ed4956' }} />
                                            ) : (
                                                <FaRegHeart className="text-stone-400 text-2xl hover:text-stone-600" />
                                            )}
                                        </button>
                                        <span className="text-base text-stone-600 font-semibold">
                                            {thought.likesCount || 0}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-stone-500 text-sm mb-4">
                                    {thought.username || 'Unknown'} • Created: {new Date(thought.createdAt?.toDate ? thought.createdAt.toDate() : thought.createdAt || Date.now()).toLocaleDateString()}
                                </p>
                                <p className="text-stone-700 whitespace-pre-wrap text-base leading-relaxed mt-4">
                                    {thought.description}
                                </p>
                            </div>
                        )}
                    </div>
                    {!isEditing && (
                        <div className="flex gap-3 mt-6">
                            {user && thought.userId === user.uid && (
                                <button
                                    className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                className="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                                onClick={onCancel}
                            >
                                Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}