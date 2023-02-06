import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      const data = await response.json();
      console.table(data);
      alert("Registration successful, Now you can log in");
      navigate("/login");
    } catch (err) {
      alert("registration failed please try again");
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
        <button type="submit" onClick={registerUser}>
          Sign up
        </button>
      </form>
    </div>
  );
}
