import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Subtask = ({ parentTaskId }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const response = await fetch(`https://task-management-mstv.onrender.com/task/subtasks/?parent_task_id=${parentTaskId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSubtasks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubtasks();
  }, [parentTaskId]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedSubtasks = Array.from(subtasks);
    const [movedItem] = updatedSubtasks.splice(result.source.index, 1);
    updatedSubtasks.splice(result.destination.index, 0, movedItem);

    setSubtasks(updatedSubtasks); 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div  style={{marginBottom:"50px"}}>
      <h3>All Subtasks Show: {subtasks.length}</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="subtaskList">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {subtasks.map((subtask, index) => (
                <Draggable key={subtask.id} draggableId={subtask.id.toString()} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        padding: '5px',
                        marginBottom: '8px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <h4>{subtask.title}</h4>
                      <p>{subtask.description}</p>
                      <p>Status: {subtask.compiled ? 'Compiled' : 'Not Compiled'}</p>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Subtask;
