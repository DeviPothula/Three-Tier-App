import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  console.log('appHost', process.env.REACT_APP_API_BASE_URL)
  const apiEndPoint = process.env.REACT_APP_API_BASE_URL || '/api'
  useEffect(() => {
    // Fetch users from the backend API
    axios
      .get(`${apiEndPoint}/users`)
      .then((response) => {
        console.log('response:', response);
        setUsers(response.data); // Update state with fetched users
      })
      .catch((error) => {
        console.error("There was an error fetching the users:", error);
      });
  }, []);

  const handleAddUser = (event) => {
    event.preventDefault();
    // Send a POST request to create a new user
    axios
      .post(`${apiEndPoint}/users`, { name })
      .then((response) => {
        setUsers([...users, response.data]); // Update users list
        setName(""); // Reset the input field
      })
      .catch((error) => {
        console.error("There was an error adding the user:", error);
      });
  };

  return (
    <div className="App">
      <h1>Three Tier APP With React + Node + Postgres....</h1>
      <p>Deployed successfully</p>
      <p>Git hub hook as build trigger!!</p>
      <h2>Add User</h2>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Add User</button>
      </form>

      <h1>User List</h1>
      <div>
        {users?.length > 0 ? (
          users?.map((user) => (
            <div key={user.id}>
              <p>{user.name}</p>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
