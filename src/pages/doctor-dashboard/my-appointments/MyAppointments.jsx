import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyAppointments.css";
import { BsThreeDotsVertical } from "react-icons/bs";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/appointments/appointments/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // New useEffect to auto-hide messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleCancel = async (doctorId, appointmentId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/appointments/appointments/${doctorId}/${appointmentId}/status`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Appointment cancelled successfully.");
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setMessage("Failed to cancel the appointment.");
    }
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
    setOpenDropdownId(null);
    setMessage("Are you sure you want to delete this appointment?");
  };

  const handleDelete = async (doctorId, appointmentId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5000/api/appointments/appointments/${doctorId}/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Appointment deleted successfully.");
      setConfirmDeleteId(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setMessage("Failed to delete the appointment.");
    }
  };

  return (
    <div className="appointments-container">
      <header className="header-section">
        <h1 className="page-title">My Appointments</h1>
        <p className="slogan">
          Stay on Track with Your Health – Your Appointments, Simplified!
        </p>
        <p className="slogan-secondary">
          Managing your appointments is now easier than ever – Scroll, View,
          and Stay Updated!
        </p>
      </header>

      <main className="appointments-section">
        {message && <div className="message-banner">{message}</div>}

        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments booked yet.</p>
        ) : (
          <div className="appointments-scroll">
            {appointments.map((appt) => (
              <div className="appointment-card zoom-in" key={appt.id}>
                <div className="card-header">
                  <BsThreeDotsVertical
                    className="options-icon"
                    onClick={() =>
                      setOpenDropdownId(openDropdownId === appt.id ? null : appt.id)
                    }
                  />
                  {openDropdownId === appt.id && (
                    <div className="dropdown-menu">
                      <button
                        className="dropdown-item delete"
                        onClick={() => confirmDelete(appt.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="appointment-details">
                  <h3>{appt.doctor?.full_name || "N/A"}</h3>
                  <p>
                    <strong>Specialization:</strong>{" "}
                    {appt.doctor?.specialization || "N/A"}
                  </p>
                </div>
                <div className="appointment-meta">
                  <p>
                    <strong>Date:</strong> {appt.appointment_date}
                  </p>
                  <p>
                    <strong>Time:</strong> {appt.appointment_time}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </p>

                  {appt.status.toLowerCase() !== "cancelled" && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(appt.doctor_id, appt.id)}
                    >
                      Cancel
                    </button>
                  )}

                  {confirmDeleteId === appt.id && (
                    <div className="confirm-box">
                      <p>Are you sure you want to delete this appointment?</p>
                      <button
                        className="confirm-btn"
                        onClick={() => handleDelete(appt.doctor_id, appt.id)}
                      >
                        Yes, Delete
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setConfirmDeleteId(null);
                          setMessage("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAppointments;
