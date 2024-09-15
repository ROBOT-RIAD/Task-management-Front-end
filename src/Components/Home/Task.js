import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Subtask from './Subtask';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSubtaskModal, setShowSubtaskModal] = useState(false); 
  const [newSubtask, setNewSubtask] = useState({ title: '', description: '' }); 
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .get(`http://127.0.0.1:8000/task/all/?created_by_id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTasks(response.data);
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
        });
    } else {
      console.log('User is not authenticated');
    }
  }, [token, userId]);

  const handleDetailClick = (taskId) => {
    axios
      .get(`http://127.0.0.1:8000/task/all/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSelectedTask(response.data);
        setShowModal(true);
      })
      .catch((error) => {
        console.error('Error fetching task details:', error);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    setShowSubtaskModal(false);
  };

  const handleAddSubtaskClick = () => {
    setShowSubtaskModal(true);
  };

  const handleSubtaskChange = (e) => {
    const { name, value } = e.target;
    setNewSubtask((prevSubtask) => ({
      ...prevSubtask,
      [name]: value,
    }));
  };

  const handleSubtaskSubmit = () => {
    if (selectedTask && token) {
      axios
        .post(
          `http://127.0.0.1:8000/task/subtasks/?parent_task_id=${selectedTask.id}`,
          {
            ...newSubtask,
            parent_task: selectedTask.id, 
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log('Subtask added:', response.data);
          setShowSubtaskModal(false); 
        })
        .catch((error) => {
          console.error('Error adding subtask:', error);
        });
    }
  };

  const taskContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
  };

  const taskCardStyle = {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    width: '600px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  };

  const titleStyle = {
    marginTop: '0',
  };

  const modalStyle = {
    display: showModal ? 'flex' : 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    width: '1000px',
    margin: 'auto',
    marginTop: '20px',
    position: 'relative',
  };

  return (
    <div className='container mt-4 gap-5'>
      <div style={taskContainerStyle}>
        {tasks.map((task) => (
          <div key={task.id} style={taskCardStyle}>
            <h3 style={titleStyle}>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
            <button
              type='button'
              style={{
                width: '100%',
                padding: '10px',
                background: '#0a0a22',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
              }}
              onClick={() => handleDetailClick(task.id)}
            >
              Detail Task
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={modalStyle} onClick={closeModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            {selectedTask && (
              <>
                <h2>{selectedTask.title}</h2>
                <p>Description: {selectedTask.description}</p>
                <p>Status: {selectedTask.status}</p>
                <p>Deadline: {new Date(selectedTask.deadline).toLocaleString()}</p>
                <button
                  style={{
                    padding: '10px',
                    background: '#0a0a22',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  onClick={handleAddSubtaskClick}
                >
                  Add subtask
                </button>
                <Subtask parentTaskId={selectedTask.id} />
                <button
                  onClick={closeModal}
                  style={{
                    padding: '10px',
                    background: '#0a0a22',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

{showSubtaskModal && (
  <div style={modalStyle} onClick={() => setShowSubtaskModal(false)}>
    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
      <h3>Add Subtask</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type='text'
          name='title'
          placeholder='Subtask Title'
          value={newSubtask.title}
          onChange={handleSubtaskChange}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            width: '100%',
            fontSize: '16px',
            outline: 'none',
            transition: 'border 0.3s ease',
          }}
        />
        <textarea
          name='description'
          placeholder='Subtask Description'
          value={newSubtask.description}
          onChange={handleSubtaskChange}
          rows={4}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            width: '100%',
            fontSize: '16px',
            outline: 'none',
            transition: 'border 0.3s ease',
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              padding: '10px',
              background: '#0a0a22',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}
            onClick={handleSubtaskSubmit}
            onMouseOver={(e) => (e.target.style.background = '#1a1a33')}
            onMouseOut={(e) => (e.target.style.background = '#0a0a22')}
          >
            Save Subtask
          </button>
          <button
            style={{
              padding: '10px',
              background: '#0a0a22',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}
            onClick={() => setShowSubtaskModal(false)}
            onMouseOver={(e) => (e.target.style.background = '#1a1a33')}
            onMouseOut={(e) => (e.target.style.background = '#0a0a22')}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Task;
