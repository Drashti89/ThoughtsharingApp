
import Button from './Button.jsx';

export default function Sidebar({onStartAddProject , projects , onSelectProject , selectedProjectId, onLogout, user}){
    return <aside className="w-1/3 px-8 py-16 bg-stone-900 text-stone-50 md:w-72 rounded-r-xl">
        <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold uppercase md:text-xl text-stone-200">
                YOUR PROJECTS
            </h2>
            {user && (
                <div>
                    <button onClick={onLogout} className="text-stone-600 hover:text-red-500 cursor-pointer text-lg font-semibold ml-4">Logout</button>
                </div>
            )}
        </div>
        <div>
            <Button variant="secondary" onClick={onStartAddProject}> + Add new Project</Button>
        </div>

        <ul className='mt-6'>
            {projects.map((project) => {
                let cssClasses = 'w-full text-left px-2 py-1 rounded-sm my-1 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                
                if(project.id === selectedProjectId){
                    cssClasses += 'bg-stone-800 text-stone-200'
                }else {
                    cssClasses += 'text-stone-400'
                }
                
                return <li key={project.id}>
                     <button 
                        className={cssClasses}
                        onClick={() => onSelectProject(project.id)}
                    >
                            {project.title}
                    </button>
                </li>
            }
                
            ) }
             
        </ul>
    </aside>
}