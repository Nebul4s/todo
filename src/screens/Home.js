import { useState, useEffect } from "react";
import axios from "axios";
import Row from "../components/Row";
import "./Home.css";
import useUser from "../context/useUser";

const url = "http://localhost:3001";

function Home() {
  const { user } = useUser();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        alert(err.response.data.error ? err.response.data.error : err);
      });
  }, []);

  const addTask = () => {
    const headers = { headers: { Authorization: user.token } };

    axios
      .post(
        `${url}/create`,
        {
          description: task,
        },
        headers
      )
      .then((res) => {
        setTasks([...tasks, { id: res.data.id, description: task }]);
        setTask("");
      })
      .catch((err) => {
        alert(err.response.data.error ? err.response.data.error : err);
      });
  };

  const deleteTask = (id) => {
    const headers = { headers: { Authorization: user.token } };
    axios
      .delete(`${url}/delete/${id}`, headers)
      .then((res) => {
        const withoutRemoved = tasks.filter((item) => item.id !== id);
        setTasks(withoutRemoved);
      })
      .catch((err) => {
        alert(err.response.data.error ? err.response.data.error : err);
      });
  };

  return (
    <div className="App">
      <h3>Todo List</h3>
      <form>
        <input
          type="text"
          placeholder="Add new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTask();
            }
          }}
        />
      </form>
      <ul>
        {tasks.map((item) => (
          <Row key={item.id} item={item} deleteTask={deleteTask} />
        ))}
      </ul>
    </div>
  );
}

export default Home;
