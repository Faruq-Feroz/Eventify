import { useState } from "react";
import axios from "axios";

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    event_date: "",
    time: "",
    location: "",
    organizer: "",
    max_attendees: "",
    category: "",
    image: null,
  });

  const [alert, setAlert] = useState({ message: "", visible: false });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setEventData({ ...eventData, image: e.target.files[0] });
  };

  // Show alert popup
  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000); // Auto-hide after 3s
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(eventData).forEach((key) => {
      formData.append(key, eventData[key]);
    });

    try {
      await axios.post("http://localhost:5000/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showAlert("✅ Event added successfully!");

      setEventData({
        title: "",
        description: "",
        event_date: "",
        time: "",
        location: "",
        organizer: "",
        max_attendees: "",
        category: "",
        image: null,
      });

      document.getElementById("event-image").value = ""; // Reset file input
    } catch (error) {
      showAlert("❌ Failed to add event. Try again.");
    }
  };

  return (
    <section className="add-event-section">
      <h1>Create New Event</h1>
      <form id="add-event-form" onSubmit={handleSubmit}>
        {/* Event Title */}
        <div className="form-group">
          <label htmlFor="event-title">Event Title:</label>
          <input type="text" id="event-title" name="title" value={eventData.title} onChange={handleChange} placeholder="Enter event title" required />
        </div>

        {/* Event Description */}
        <div className="form-group">
          <label htmlFor="event-description">Event Description:</label>
          <textarea id="event-description" name="description" rows="5" value={eventData.description} onChange={handleChange} placeholder="Enter event description" required></textarea>
        </div>

        {/* Event Date */}
        <div className="form-group">
          <label htmlFor="event-date">Event Date:</label>
          <input type="date" id="event-date" name="event_date" value={eventData.event_date} onChange={handleChange} required />
        </div>

        {/* Event Time */}
        <div className="form-group">
          <label htmlFor="event-time">Event Time:</label>
          <input type="time" id="event-time" name="time" value={eventData.time} onChange={handleChange} required />
        </div>

        {/* Event Location */}
        <div className="form-group">
          <label htmlFor="event-location">Event Location:</label>
          <input type="text" id="event-location" name="location" value={eventData.location} onChange={handleChange} placeholder="Enter event location" required />
        </div>

        {/* Event Organizer */}
        <div className="form-group">
          <label htmlFor="event-organizer">Organizer Name:</label>
          <input type="text" id="event-organizer" name="organizer" value={eventData.organizer} onChange={handleChange} placeholder="Enter organizer name" />
        </div>

        {/* Max Attendees */}
        <div className="form-group">
          <label htmlFor="event-attendees">Maximum Attendees:</label>
          <input type="number" id="event-attendees" name="max_attendees" value={eventData.max_attendees} onChange={handleChange} placeholder="Enter maximum number of attendees" min="1" />
        </div>

        {/* Event Category */}
        <div className="form-group">
          <label htmlFor="event-category">Event Category:</label>
          <select id="event-category" name="category" value={eventData.category} onChange={handleChange} required>
            <option value="" disabled>Select a category</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="webinar">Webinar</option>
            <option value="party">Party</option>
            <option value="concert">Concert</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Event Image */}
        <div className="form-group">
          <label htmlFor="event-image">Upload Event Image:</label>
          <input type="file" id="event-image" name="image" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn">Add Event</button>
          <a href="/" className="btn cancel-btn">Cancel</a>
        </div>
      </form>

      {/* Alert Popup */}
      {alert.visible && (
        <div id="alert-popup" className="alert-popup">
          <p id="alert-message">{alert.message}</p>
          <button onClick={() => setAlert({ message: "", visible: false })}>OK</button>
        </div>
      )}
    </section>
  );
};

export default AddEvent;
