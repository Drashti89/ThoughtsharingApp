import {useRef} from 'react';
import Input from "./input.jsx";
import ErrorModal from './ErrorModal.jsx';

export default function NewProject({onAdd , onCancel}){
    const modal = useRef();
    const title = useRef();
    const description = useRef(); 
    const dueDate = useRef(); 

    function handleSave(){
        const enteredTitle = title.current.value;
        const enteredDescription = description.current.value;
        const enteredDueDate = dueDate.current.value;

        if(enteredTitle.trim() === '' || enteredDescription.trim() === '' || enteredDueDate.trim() === '')
        {
            modal.current.open();
            return;
        }

        onAdd ({
            title : enteredTitle,
            description : enteredDescription,
            dueDate :enteredDueDate
        });
    }

    

    return(
        <>
        <ErrorModal  ref = {modal} buttonCaption = "Okay">
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

        <div className="w-[35rem] mt-16">        
            <menu className="flex items-center justify-end gap-4 my-4">
                <li>
                    <button className="text-stone-800 hover:text-stone-950" onClick={onCancel}>
                        Cancel
                    </button>
                </li>
                <li>
                     <button className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
                     onClick={handleSave}>
                        Save
                    </button>
                </li>
            </menu>
            <div>
                <Input type="text" ref={title} label ="title" />
                <Input ref={description} label ="Discription" textarea /> 
                <Input type="date" ref={dueDate} label ="Due date"/> 

            </div>
        </div>
        </>
    );
}