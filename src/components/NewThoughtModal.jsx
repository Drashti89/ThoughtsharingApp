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
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={handleCancel}
            >
                {/* Modal Content */}
                <div 
                    className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-2xl font-bold text-stone-800">Add New Thought</h2>
                        <button
                            onClick={handleCancel}
                            className="text-stone-400 hover:text-stone-600 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        <Input type="text" ref={title} label="title" />
                        <Input ref={description} label="Thought" textarea />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-4 p-6 border-t">
                        <button 
                            className="px-6 py-2 text-stone-800 hover:text-stone-950 font-semibold" 
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
