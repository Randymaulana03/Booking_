import { useState } from "react";
import axios from "axios";

export default function RegisterAdmin() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register-admin", form);
      alert(res.data.message);
      setForm({ name: "", email: "", password: "" }); // reset form
    } catch (err) {
      console.error("Error register admin:", err); // lihat error lengkap di console
      alert(
        err.response?.data?.error?.sqlMessage || // error dari MySQL
        err.response?.data?.message ||          // error dari server
        err.message ||                          // error JS umum
        "Terjadi error"                         // fallback
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register Admin (sementara)</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register Admin</button>
      </form>
    </div>
  );
}
