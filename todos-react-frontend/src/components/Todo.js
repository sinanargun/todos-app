import React, { useState, useEffect } from "react";
import { getTodos, addTodo, updateTodoStatus } from "../api/todo";
import "./css/Todo.css"; // Import CSS file
import { TODO_STATUS } from "../constant";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newText, setNewText] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Fetch todos on component mount
  useEffect(() => {
    getTodos().then(res => setTodos(res.data?.todos || []));
  }, []);

  // Add a new todo with dueDate
  const handleAddTodo = () => {
    if (!newText) return alert("Text is required!");
    addTodo(newText, dueDate).then(res => {
      setTodos([res.data?.todo, ...todos]);
      setNewText("");
      setDueDate("");
    });
  };

  // Edit a todo's text or due date
  const handleEditTodo = (id, updatedText, updatedDueDate) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, text: updatedText, due_date: updatedDueDate } : todo)));
  };

  // Save changes to an existing todo
  const handleUpdateTodo = (id, text, due_date, status) => {
    updateTodoStatus(id, text, due_date, status).then(() => {
      if(status === TODO_STATUS.DONE) {
        setTodos(todos.map(todo => (todo.id === id ? { ...todo, status: TODO_STATUS.DONE } : todo)));
      };
      alert("Todo updated successfully!");
    });
  };

  return (
    <div className="todo-container">
      <div className="todo-add-container">
        <h3>Add New Todo</h3>
        <div className="todo-input-row">
          <input
            type="text"
            placeholder="Task"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="todo-input"
          />
          <div>
            <label htmlFor="due-date">Due Date(Optional):</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="todo-input"
            />
          </div>
        </div>
        <button onClick={handleAddTodo} className="todo-action-button create-button">Add Todo</button>
      </div>

      {/* Todo List Section */}
      <div className="todo-list-container">
        <h2>Todos</h2>
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={todo.status === TODO_STATUS.DONE ? "done" : ""}>
              <input
                type="text"
                value={todo.text}
                onChange={(e) => handleEditTodo(todo.id, e.target.value, todo.dueDate)}
                className="todo-edit-input"
                disabled={todo.status === TODO_STATUS.DONE}
              />
              <input
                type="date"
                value={todo?.due_date?.split("T")[0]}
                onChange={(e) => handleEditTodo(todo.id, todo.text, e.target.value)}
                className="todo-edit-input"
                disabled={todo.status === TODO_STATUS.DONE}
              />
              {todo.status !== TODO_STATUS.DONE && (
                <div className="todo-button-group">
                  <button onClick={() => handleUpdateTodo(todo.id, todo.text, todo.due_date, TODO_STATUS.DONE)} className="todo-action-button done-button">Mark as Done</button>
                  <button onClick={() => handleUpdateTodo(todo.id, todo.text, todo.due_date, todo.status)} className="todo-action-button update-button">Update</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
