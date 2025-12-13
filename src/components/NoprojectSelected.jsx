import noProjectImage from '../assets/no-projects.png';
import Button from './Button.jsx';

export default function NoProjectSelected({onStartAddProject}){
    

    
    return(
        <div className='mt-24 w-2/3 text-center'>
            <img 
                src={noProjectImage} 
                alt="an empty task" 
                className='w-16 h-16 object-contain mx-auto'/>

            <h2 className='text-xl font-bold text-stone-500 my-4'>
                No project Selected
            </h2>

            <p className='text-stone-500 mb-4'>
                Select a Project or get started with a New One
            </p>
            <p className='mt-8'>
                <Button variant="secondary" onClick={onStartAddProject}>Create a New Project</Button>
            </p>
        </div>
    );
}