import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Fields from "./pages/Fields";
import Bookings from "./pages/Bookings";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RegisterAdmin from "./pages/RegisterAdmin";


function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/register">Register</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/fields">Fields</Link> |{" "}
        <Link to="/bookings">Bookings</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/profile">Profile</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Login />} /> {/* fallback */}
        <Route path="/register-admin" element={<RegisterAdmin />} />

      </Routes>
    </Router>
  );
}



export default App;
