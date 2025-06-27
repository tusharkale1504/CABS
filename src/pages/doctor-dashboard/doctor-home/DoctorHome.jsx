import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorHome.css";
import { jwtDecode } from "jwt-decode"; // ✅ correct import

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotMessage, setSlotMessage] = useState("");
  const [slotData, setSlotData] = useState({
    available_date: "",
    start_time: "",
    end_time: "",
  });

  const doctorId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  let doctorName = "Doctor";
  if (token) {
    const decoded = jwtDecode(token); // ✅ fixed usage
    doctorName = decoded.full_name || "Doctor";
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/doctor/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching doctor appointments", err);
      }
    };

    fetchAppointments();
  }, [doctorId, token]);

  const updateStatus = async (appointmentId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/appointments/${doctorId}/${appointmentId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status } : appt
        )
      );
    } catch (err) {
      console.error("Error updating appointment status", err);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/appointments/appointments/${doctorId}/${appointmentId}`, // Adjust URL if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Remove deleted appointment from state
      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== appointmentId)
      );
    } catch (err) {
      console.error("Error deleting appointment", err);
    }
  };

  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/availability",
        { doctor_id: doctorId, ...slotData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSlotMessage("Slot created successfully!");
      setShowSlotForm(false);
      setSlotData({ available_date: "", start_time: "", end_time: "" });
      setTimeout(() => setSlotMessage(""), 3000);
    } catch (err) {
      console.error("Error creating slot", err);
      setSlotMessage("Failed to create slot.");
      setTimeout(() => setSlotMessage(""), 3000);
    }
  };

  const totalAppointments = appointments.length;
  const confirmed = appointments.filter(
    (a) => a.status?.toLowerCase() === "confirmed"
  ).length;
  const pending = appointments.filter(
    (a) => a.status?.toLowerCase() === "pending"
  ).length;

  return (
    <div className="doctor-dashboard">
      <h2 className="dashboard-heading">Welcome, {doctorName}!</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <p>{totalAppointments}</p>
        </div>
        <div className="stat-card confirmed">
          <h3>Confirmed</h3>
          <p>{confirmed}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>
      </div>

      <div className="slot-header">
        <button
          className="slot-button"
          onClick={() => setShowSlotForm(!showSlotForm)}
        >
          {showSlotForm ? "Close Slot Form" : "Add Availability Slot"}
        </button>
      </div>

      {slotMessage && <p className="slot-message">{slotMessage}</p>}

      {showSlotForm && (
        <form className="slot-form" onSubmit={handleSlotSubmit}>
          <label>
            Date:
            <input
              type="date"
              value={slotData.available_date}
              onChange={(e) =>
                setSlotData({ ...slotData, available_date: e.target.value })
              }
              required
            />
          </label>
          <label>
            Start Time:
            <input
              type="time"
              value={slotData.start_time}
              onChange={(e) =>
                setSlotData({ ...slotData, start_time: e.target.value })
              }
              required
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              value={slotData.end_time}
              onChange={(e) =>
                setSlotData({ ...slotData, end_time: e.target.value })
              }
              required
            />
          </label>
          <button type="submit" className="submit-slot-btn">
            Submit Slot
          </button>
        </form>
      )}

      <h3 className="upcoming-title">Upcoming Appointments</h3>
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments scheduled.</p>
        ) : (
          appointments.map((appt) => (
            <div className="appointment-card" key={appt.id}>
              <div>
                <strong>Patient:</strong>
                <br />
                {appt.patient?.full_name || "N/A"}
              </div>
              <div>
                <strong>Date:</strong>
                <br />
                {appt.appointment_date}
              </div>
              <div>
                <strong>Time:</strong>
                <br />
                {appt.appointment_time}
              </div>
              <div>
                <strong>Status:</strong>
                <br />
                <span className={`status ${appt.status.toLowerCase()}`}>
                  {appt.status}
                </span>
              </div>

          <div className="action-buttons">
  {appt.status.toLowerCase() === "pending" && (
    <>
      <button
        className="approve-btn"
        onClick={() => updateStatus(appt.id, "confirmed")}
      >
        Approve
      </button>
      <button
        className="cancel-btn"
        onClick={() => updateStatus(appt.id, "cancelled")}
      >
        Cancel
      </button>
    </>
  )}
  <button
    className="done-btn"
    onClick={() => deleteAppointment(appt.id)}
  >
    Done
  </button>
</div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorHome;
