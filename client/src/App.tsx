import {useState, useEffect } from 'react';

import axios from 'axios';

const API_BASE = "http://localhost:3000/";

interface Todo {
    _id: string,
    text: string,
    complete: boolean,
    timestamp: string,
}

function App() {
    const[todos, setTodos] = useState<Todo[]>([]);
    const[popupActive, setPopupActive] = useState(false);
    const[newTodo, setNewTodo] = useState("");

    useEffect(() => {
        GetTodos();
    }, [])

    const GetTodos = () => {
            fetch(API_BASE + "todos")
            .then(res => res.json())
            .then(res => {
                setTodos(res.data);
            }).catch(err => console.error(err));
        }

    const completeTodo =  async (id: any) => {
        const data = await fetch(API_BASE + "todo/complete/" + id).then(res => res.json());

        setTodos(todos => todos.map(todo => {
            if(todo._id === data._id){
                todo.complete = data.complete;
            }
            return todo;
        }))
    }

    const deleteTodo = async (id:any) => {
        const data = await fetch(API_BASE + "todo/delete/" + id, {
             method: "DELETE" 
            }).then(res => res.json());

        setTodos(todos => todos.filter(todo => todo._id != data._id))

        
    }

    const addTodo = async () => {
        const data = await fetch(API_BASE + "todo/new", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                text: newTodo
            })
        }).then(res => res.json());

        setTodos([...todos, data]);
        setPopupActive(false);
        setNewTodo("");
    }

  return (
    <div className="app">
        <h1>Welcome, Raphael</h1>
        <h4>Your tasks</h4>
        
        <div className="todos">
            {todos.map(todo => (
                <div className={
                    "todo " + (todo.complete ? "is-complete" : "todo")} key={ todo._id } onClick={() => completeTodo(todo._id)}>
                    <div className="checkbox"></div>

                    <div className="text">{ todo.text }</div>

                    <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
                </div>
            ))}
        </div>
        <div className="addPopUp" onClick={() => setPopupActive(true)}>+</div>

        { popupActive ? (
            <div className="popUp">
                <div className="closePopUp" onClick={() => setPopupActive(false)}>X</div>
                <div className="content">
                    <h3>Add Task</h3>
                    <input 
                    type="text" 
                    className="add-todo-input" 
                    onChange={ e => setNewTodo(e.target.value) } 
                    value={newTodo}
                    />
                    <div className="button" onClick={addTodo}>Create Task</div>
                </div>
            </div>
        ) : "" }
    </div>
  )
}

export default App
