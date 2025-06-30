import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PatientHome.css";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../api/apiConfig";

const PatientHome = () => {
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    patient_id: localStorage.getItem("userId"),
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${BASE_URL}/api/users/doctors`).then((res) => {
      setDoctors(res.data);
      const specs = [...new Set(res.data.map((doc) => doc.specialization))];
      setSpecializations(specs);
    });
  }, []);

  // (`${BASE_URL}/api/users/register`)

  useEffect(() => {
    if (selectedDoctorId) {
      axios
        .get(`${BASE_URL}/api/slots/${selectedDoctorId}`)
        .then((res) => setSlots(res.data));
    }
  }, [selectedDoctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/appointments/appointments`,
        {
          ...appointment,
          doctor_id: selectedDoctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({ type: "success", text: res.data.message });
    } catch (err) {
      setMessage({ type: "error", text: "Booking failed" });
      console.error(err);
    }
  };

  return (
    <div className="patient-home">
      <h1 className="app-title">MediConnect</h1>
      <p className="slogan">Your Health, Our Priority — Book Your Doctor in Seconds!</p>

      <div className="form-card">
        <h2 className="form-title">Book Appointment</h2>
        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Specialization:</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => {
                setSelectedSpecialization(e.target.value);
                setSelectedDoctorId("");
                setSlots([]);
                setMessage("");
              }}
            >
              <option value="">Select</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Doctor:</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => {
                setSelectedDoctorId(e.target.value);
                setAppointment({ ...appointment, doctor_id: e.target.value });
                setMessage("");
              }}
              disabled={!selectedSpecialization}
            >
              <option value="">Select</option>
              {doctors
                .filter((doc) => doc.specialization === selectedSpecialization)
                .map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.full_name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Available Slots:</label>
            <select
              onChange={(e) => {
                const [date, time] = e.target.value.split(" ");
                setAppointment({
                  ...appointment,
                  appointment_date: date,
                  appointment_time: time,
                });
              }}
              disabled={!selectedDoctorId}
            >
              <option value="">Select</option>
              {slots.map((slot) => (
                <option key={slot.id} value={`${slot.available_date} ${slot.start_time}`}>
                  {slot.available_date} at {slot.start_time} - {slot.end_time}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="primary-btn">Book Appointment</button>
        </form>

        <button
          className="secondary-btn"
          onClick={() => navigate("/appointments")}
        >
          View My Appointments
        </button>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHome;
