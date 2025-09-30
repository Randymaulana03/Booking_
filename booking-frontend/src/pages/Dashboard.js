import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [date, setDate] = useState(today);
  const [expandedSlot, setExpandedSlot] = useState(null);
  const [fields, setFields] = useState([]);

  const slots = Array.from({ length: 16 }, (_, i) => i + 8);

  // cek login user
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!user) {
      alert("Login dulu!");
      navigate("/login");
    }
  }, [user, navigate]);

  // ambil lapangan
  useEffect(() => {
    axios
      .get("http://localhost:5000/fields")
      .then((res) => setFields(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleNext = () => setDate(new Date(date.setDate(date.getDate() + 1)));
  const handlePrev = () =>
    date > today && setDate(new Date(date.setDate(date.getDate() - 1)));

  const getDayName = (d) =>
    d.toLocaleDateString("id-ID", { weekday: "long" });
  const getFormattedDate = (d) =>
    d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const handleBooking = async (hour, fieldId, price) => {
    if (!user) {
      alert("Login dulu!");
      navigate("/login");
      return;
    }

    const confirmBooking = window.confirm(
      `Booking lapangan jam ${hour}:00? Rp${price}`
    );
    if (!confirmBooking) return;

    const bookingData = {
      user_id: user.id,
      field_id: fieldId,
      date: date.toISOString().split("T")[0],
      start_time: `${hour}:00:00`,
      end_time: `${hour + 1}:00:00`,
    };

    try {
      const res = await axios.post("http://localhost:5000/book", bookingData);
      alert(res.data.message);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Booking gagal");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Booking Lapangan</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={handlePrev} disabled={date <= today}>
          ⬅ Prev
        </button>
        <span style={{ margin: "0 15px", fontWeight: "bold" }}>
          {getDayName(date)} - {getFormattedDate(date)}
        </span>
        <button onClick={handleNext}>Next ➡</button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {slots.map((hour) => {
          const now = new Date();
          const slotTime = new Date(date);
          slotTime.setHours(hour, 0, 0, 0);
          let status = "Tersedia";
          if (slotTime < now && date.toDateString() === today.toDateString())
            status = "Berlangsung";

          return (
            <div key={hour} style={{ width: "350px" }}>
              <div
                onClick={() =>
                  status === "Tersedia" &&
                  setExpandedSlot(expandedSlot === hour ? null : hour)
                }
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderRadius: "8px",
                  background: status === "Tersedia" ? "#ffcc00" : "#ccc",
                  color: status === "Tersedia" ? "#000" : "#666",
                  cursor: status === "Tersedia" ? "pointer" : "not-allowed",
                }}
              >
                <span>{status}</span>
                <span>Jam {hour}:00</span>
              </div>

              {expandedSlot === hour && (
                <div style={{ marginTop: "8px", paddingLeft: "10px" }}>
                  {fields.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        marginBottom: "8px",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        background: "#f9f9f9",
                        textAlign: "left",
                      }}
                    >
                      <div>
                        <strong>{f.name}</strong> - {f.type}
                      </div>
                      <button
                        onClick={() => handleBooking(hour, f.id, f.price_per_hour)}
                        style={{ marginTop: "5px", padding: "5px 10px" }}
                      >
                        Booking Rp{f.price_per_hour}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
