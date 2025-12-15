import { useRef } from 'react';
import Input from "./input.jsx";
import ErrorModal from './ErrorModal.jsx';

export default function NewThoughtModal({ isOpen, onClose, onAdd, user }) {
    const modal = useRef();
    const title = useRef();
    const description = useRef();

    if (!isOpen) return null;

    function handleSave() {
        const enteredTitle = title.current.value;
        const enteredDescription = description.current.value;

        if (enteredTitle.trim() === '' || enteredDescription.trim() === '') {
            modal.current.open();
            return;
        }

        // Create thought object - userId and username will be added by App.jsx
        const thoughtData = {
            title: enteredTitle,
            description: enteredDescription,
        };

        onAdd(thoughtData);
        
        // Clear form after save
        if (title.current) title.current.value = '';
        if (description.current) description.current.value = '';
        
        // Close the modal
        onClose();
    }

    function handleCancel() {
        // Clear form
        if (title.current) title.current.value = '';
        if (description.current) description.current.value = '';
        
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
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleCancel}
            >
                {/* Modal Content */}
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-stone-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-6 border-b border-stone-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">✨</span>
                                <h2 className="text-2xl md:text-3xl font-bold text-stone-800">Add New Thought</h2>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="text-stone-400 hover:text-stone-600 text-2xl font-bold p-2 hover:bg-white/50 rounded-full transition-all duration-200"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-stone-600 mt-2">Capture your beautiful thoughts and ideas</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <Input type="text" ref={title} label="📝 Title" />
                        <Input ref={description} label="💭 Your Thought" textarea />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-4 px-8 py-6 bg-stone-50 border-t border-stone-100">
                        <button
                            className="px-6 py-3 text-stone-600 hover:text-stone-800 font-semibold hover:bg-stone-100 rounded-xl transition-all duration-200"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
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
