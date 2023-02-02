import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (ev) => {
    ev.preventDefault();
    try {
      // port must match with backend listener port in this case 4500
      const response = await fetch("http://127.0.0.1:4500/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // data we want to submit
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Register</h1>
      <form onSubmit={registerUser}>
        <input
          type="text"
          placeholder="Fullname"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default App;
