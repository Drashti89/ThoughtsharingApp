import { useRef, useEffect, useState } from 'react';
import Input from "./input.jsx";
import ErrorModal from './ErrorModal.jsx';
import { getSecureItem, setSecureItem } from "../utils/secureStorage";

export default function NewThoughtModal({ isOpen, onClose, onAdd, user }) {
    const modal = useRef();
    const title = useRef();
    const description = useRef();
    const [visibility, setVisibility] = useState('public'); // Default to public
    const [showTooltip, setShowTooltip] = useState(null);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setVisibility('public');
        }
    }, [isOpen]);

    // Load draft data on mount
    useEffect(() => {
        if (!user) return;
        if (!isOpen) return;


        const draft = getSecureItem(user.uid, "draftThought");
        if (draft) {
            if (title.current) title.current.value = draft.title || "";
            if (description.current) description.current.value = draft.description || "";
            if (draft.visibility) setVisibility(draft.visibility);
        }
    }, [user]);

    // Auto-save draft with visibility
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            setSecureItem(user.uid, "draftThought", {
                title: title.current?.value || "",
                description: description.current?.value || "",
                visibility: visibility
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [user, visibility]);

    if (!isOpen) return null;

    function handleSave() {
        if (!user) return;

        const enteredTitle = title.current.value;
        const enteredDescription = description.current.value;

        if (enteredTitle.trim() === '' || enteredDescription.trim() === '') {
            modal.current?.open();
            return;
        }

        // Create thought object - userId and username will be added by App.jsx
        const thoughtData = {
            title: enteredTitle,
            description: enteredDescription,
            visibility: visibility
        };

        onAdd(thoughtData);

        if (user) {
            localStorage.removeItem(`secure_${user.uid}_draftThought`);
        }

        // Clear form after save
        if (title.current) title.current.value = '';
        if (description.current) description.current.value = '';
        setVisibility('public');

        // Close the modal
        onClose();
    }

    function handleCancel() {
        // Clear form
        if (title.current) title.current.value = '';
        if (description.current) description.current.value = '';
        setVisibility('public');

        // Close modal
        onClose();
    }

    return (
        <>
            <ErrorModal ref={modal} buttonCaption="Okay">
                <h2 className='text-xl font-bold text-stone-700 my-4'>
                    Invalid Input
                </h2>
                <p className='text-stone-600 mb-2'>
                    Oops.. looks like you forgot to enter value
                </p>
                <p className='text-stone-600 mb-4'>
                    please enter valid input for every input field..!!!
                </p>
            </ErrorModal>

            {/* Modal Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
                onClick={handleCancel}
            >
                {/* Modal Content */}
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-2xl border border-stone-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-3 sm:px-8 sm:py-6 border-b border-stone-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-xl sm:text-3xl">✨</span>
                                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-stone-800">
                                    Add New Thought
                                </h2>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="text-stone-400 hover:text-stone-600 text-xl sm:text-2xl font-bold p-1 sm:p-2 hover:bg-white/50 rounded-full transition-all duration-200"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-stone-600 mt-1 sm:mt-2 text-sm">
                            Capture your beautiful thoughts and ideas
                        </p>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="overflow-y-auto max-h-[70vh] modal-scrollbar">
                        <div className="p-4 sm:p-8">
                            <Input type="text" ref={title} label="📝 Title" />
                            <Input ref={description} label="💭 Your Thought" textarea />

                            {/* Visibility Toggle */}
                            <div className="mt-4 sm:mt-6">
                                <label className="block text-sm font-semibold text-stone-700 mb-2 sm:mb-3">
                                    🔒 Who can see this thought?
                                </label>

                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setVisibility('public')}
                                        className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                            visibility === 'public'
                                                ? 'border-violet-400 bg-violet-50'
                                                : 'border-stone-200 hover:border-stone-300'
                                        }`}
                                        onMouseEnter={() => setShowTooltip('public')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <span className="text-lg sm:text-2xl">🌍</span>
                                            <div>
                                                <div className="font-semibold text-stone-800 text-sm">Public</div>
                                                <div className="text-xs sm:text-sm text-stone-600">
                                                    Visible to everyone
                                                </div>
                                            </div>
                                        </div>

                                        {showTooltip === 'public' && (
                                            <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-800 text-white text-xs rounded-lg whitespace-nowrap">
                                                🌍 Public — visible to everyone
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-stone-800"></div>
                                            </div>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setVisibility('private')}
                                        className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                            visibility === 'private'
                                                ? 'border-violet-400 bg-violet-50'
                                                : 'border-stone-200 hover:border-stone-300'
                                        }`}
                                        onMouseEnter={() => setShowTooltip('private')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <span className="text-lg sm:text-2xl">🔒</span>
                                            <div>
                                                <div className="font-semibold text-stone-800 text-sm">Private</div>
                                                <div className="text-xs sm:text-sm text-stone-600">
                                                    Only visible to you
                                                </div>
                                            </div>
                                        </div>

                                        {showTooltip === 'private' && (
                                            <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-800 text-white text-xs rounded-lg whitespace-nowrap">
                                                🔒 Private — only visible to you
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-stone-800"></div>
                                            </div>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs sm:text-sm">
                                    <span className="text-stone-600">Selected:</span>
                                    <span className="font-medium">
                                        {visibility === 'public' ? '🌍 Public' : '🔒 Private'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 sm:gap-4 px-4 py-3 sm:px-8 sm:py-6 bg-stone-50 border-t border-stone-100">
                        <button
                            className="px-4 py-2 sm:px-6 sm:py-3 text-stone-600 hover:text-stone-800 font-semibold hover:bg-stone-100 rounded-xl transition-all duration-200 text-sm sm:text-base"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 sm:px-8 sm:py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base"
                            onClick={handleSave}
                        >
                            💝 Save Thought
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
