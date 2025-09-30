import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Ambil booking user
    axios
      .get(`http://localhost:5000/bookings?user_id=${userData.id}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Gagal ambil booking:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profil Saya</h1>
      {user ? (
        <>
          <p><strong>Nama:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </>
      ) : (
        <p>Loading profil...</p>
      )}

      <h2>Riwayat Booking</h2>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              <strong>{b.field_name}</strong> ({b.field_type}) - {b.date} jam {b.start_time} s/d {b.end_time} [{b.status || "pending"}]
            </li>
          ))}
        </ul>
      ) : (
        <p>Belum ada booking</p>
      )}
    </div>
  );
}
