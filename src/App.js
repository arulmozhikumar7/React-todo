import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPending, setShowPending] = useState(true); // State to determine which column to display
  const [newTaskDateTime, setNewTaskDateTime] = useState('');
  useEffect(() => {
    const fetchTasks = () => {
      const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      setTasks(storedTasks);
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  const addTask = () => {
    if (newTask.trim() !== '') {
      const taskToAdd = {
        id: Date.now(),
        text: newTask,
        completed: false,
        deadline: newTaskDateTime || null,
      };

      setTasks([...tasks, taskToAdd]);
      setNewTask('');
      setNewTaskDateTime('');
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };



  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter tasks based on completion status
  const pendingTasks = filteredTasks.filter((task) => !task.completed);
  const finishedTasks = filteredTasks.filter((task) => task.completed);

  return (
    <div className="app" style={{ background: '#C1F2B0' }}>
      <div className="header">To-Do List</div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          autoFocus
        />
        <input
          type="datetime-local" // Change the input type to include date and time
          placeholder="Set a deadline (optional)"
          value={newTaskDateTime}
          onChange={(e) => setNewTaskDateTime(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <div className="controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="switch-buttons">
        <button onClick={() => setShowPending(true)} className={showPending ? 'active' : ''}>
          Pending
        </button>
        <button onClick={() => setShowPending(false)} className={!showPending ? 'active' : ''}>
          Finished
        </button>
      </div>
      <div className="tasks">
        {showPending ? (
          <div className="column">
            <h2>Pending Tasks</h2>
            {pendingTasks.map((task) => (
              <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`} style={{ background: '#65B741' }}>
                <span className="task-text">{task.text}</span>
                {task.deadline && <span className="deadline">Deadline: {task.deadline}</span>}
                <div className="task-buttons">
                  <button onClick={() => toggleComplete(task.id)}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="column">
            <h2>Finished Tasks</h2>
            {finishedTasks.map((task) => (
              <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`} style={{ background: '#65B741' }}>
                <span className="task-text">{task.text}</span>
                {task.deadline && <span className="deadline">Deadline: {task.deadline}</span>}
                <div className="task-buttons">
                  <button onClick={() => toggleComplete(task.id)}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
