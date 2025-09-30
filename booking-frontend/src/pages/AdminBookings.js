import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  // Cek login & role admin
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login";
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "admin") {
      alert("Hanya admin yang bisa mengakses halaman ini!");
      window.location.href = "/dashboard";
      return;
    }
    fetchBookings();
  }, []);

  // Ambil semua booking
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Gagal ambil booking:", err);
      alert("Gagal mengambil booking");
    }
  };

  // Update status booking
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/admin/bookings/${id}`, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error(err);
      alert("Gagal update status");
    }
  };

  // Warna status
  const getStatusColor = (status) => {
    if (status === "pending") return "#ffcc00";
    if (status === "confirmed") return "#4caf50";
    if (status === "rejected") return "#f44336";
    return "#ccc";
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Daftar Booking User</h1>
      {bookings.length === 0 ? (
        <p>Belum ada booking</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {bookings.map((b) => (
            <div
              key={b.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                background: "#f9f9f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 5px 0" }}>{b.field_name} ({b.field_type})</h3>
                <p style={{ margin: "0" }}>Tanggal: {new Date(b.date).toLocaleDateString("id-ID")}</p>
                <p style={{ margin: "0" }}>Jam: {b.start_time} - {b.end_time}</p>
                <p style={{ margin: "0" }}>Harga/jam: Rp{b.price_per_hour}</p>
                <p style={{ margin: "0" }}>User: {b.user_name} ({b.user_email})</p>
                <p style={{ margin: "0", fontWeight: "bold", color: getStatusColor(b.status) }}>
                  Status: {b.status}
                </p>
              </div>
              {b.status === "pending" && (
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    onClick={() => handleUpdateStatus(b.id, "confirmed")}
                    style={{
                      padding: "5px 10px",
                      background: "#4caf50",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Konfirmasi
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(b.id, "rejected")}
                    style={{
                      padding: "5px 10px",
                      background: "#f44336",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
