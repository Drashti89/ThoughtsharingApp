import Tasks  from "./Tasks";
import { useState, useEffect } from 'react';

export default function selectedProjects ({project , onDelete , onAddTask ,onDeleteTask ,tasks, onEdit}){
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(project.title);
    const [editedDescription, setEditedDescription] = useState(project.description);
    
    // Update edited values when project changes
    useEffect(() => {
        setEditedTitle(project.title);
        setEditedDescription(project.description);
        setIsEditing(false);
    }, [project.id]);
    
    const formattedDate = new Date(project.dueDate).toLocaleDateString('en-US',{
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
    
    const handleSave = () => {
        onEdit({
            ...project,
            title: editedTitle,
            description: editedDescription
        });
        setIsEditing(false);
    };
    
    return (
        <div className="w-[35rem] mt-16">
            <header className="pb-4 mb-5 border-stone-300">
                <div className="flex items-center justify-between">

                    {isEditing ? (
                        <div className="flex-1">
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full text-3xl font-bold text-stone-600 mb-2 p-1 border rounded"
                            />
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="w-full text-stone-600 whitespace-pre-wrap p-1 border rounded mb-2"
                                rows="3"
                            />
                            <p className="text-stone-600 hover:text-green-500 cursor-pointer mr-2 text-lg mt-2 mb-1 font-semibold"
                                onClick={handleSave}>
                                Save
                            </p>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold text-stone-600 mb-2">
                                {project.title}
                            </h1>
                            <div className="flex gap-4">
                                <p className="text-stone-600 hover:text-blue-500 cursor-pointer"
                                    onClick={() => setIsEditing(true)}>
                                    Edit
                                </p>
                                <p className="text-stone-600 hover:text-red-500 cursor-pointer"
                                    onClick={onDelete}>
                                    Delete
                                </p>
                            </div>
                        </>
                    )}

                </div>
                <p className="mb-4 text-stone-400">{formattedDate}</p>
                <p className="text-stone-600 whitespace-pre-wrap">{project.description}</p>
            </header>
             <hr className="border-stone-300 mb-5 border-2" />
                 <Tasks onAdd = {onAddTask} onDelete = {onDeleteTask} tasks={tasks}/>
        </div>
    );
}