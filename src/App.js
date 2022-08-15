import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Todo from "./Todo";
import { db } from "./firebase";
import { async } from "@firebase/util";

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-purple-300 text-slate-100`,
  count: `text-center`,
};

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  // Create todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Please enter a valid todo");
      return;
    }
    await addDoc(collection(db, "todos"), {
      text: input,
      completed: false,
    });
  };

  // Read todo from firebase
  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);

  // Update todo in firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };
  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>Todo App</h3>
        <form action="" className={style.form} onSubmit={createTodo}>
          <input
            type="text"
            className={style.input}
            placeholder="Add Todo"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className={style.button}>
            <AiOutlinePlus />
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => {
            return (
              <Todo
                key={index}
                todo={todo}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
              />
            );
          })}
        </ul>
        {todos.length < 1 ? null : (
          <p className={style.count}>You have {todos.length} todos</p>
        )}
      </div>
    </div>
  );
}

export default App;
