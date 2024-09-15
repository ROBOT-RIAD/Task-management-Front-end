import React, { useState } from 'react';
import Task from './Task';
const Home = () => {
  const [task, setTask] = useState({
    title: '',
    description: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const userId = localStorage.getItem('userId'); 
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage('Please log in or sign up to create a task.');
      return;
    }

    const taskData = {
      ...task,
      created_by: userId
    };

    fetch('http://127.0.0.1:8000/task/all/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    })
    .then(response => {
      if (response.status === 401) {
        setErrorMessage('Unauthorized. Please log in or sign up to create a task.');
        throw new Error('Unauthorized');
      }
      return response.json();
    })
    .then(data => {
      console.log('Task created:', data);
      setErrorMessage(''); 
      window.location.reload();
    })
    .catch(error => {
      console.error('Error creating task:', error);
    });
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent: 'center', alignItems: 'center' }}>
      <form 
        onSubmit={handleSubmit} 
        style={{ width: '600px', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.9)', borderRadius:"10px" }}>
        <h2 style={{textAlign:"center"}}>Create Task</h2>
        {errorMessage && (
          <div style={{ color: 'red', marginBottom: '15px' }}>
            {errorMessage}
          </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <label>Title</label>
          <input 
            type="text" 
            name="title" 
            value={task.title} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Description</label>
          <textarea 
            name="description" 
            value={task.description} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', height: '50px' }} 
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#0a0a22', color: '#fff', border: 'none',borderRadius:"10px" }}>Create Task</button>
      </form>
    </div>

    <Task/>

    </div> 
  );
};

export default Home;
