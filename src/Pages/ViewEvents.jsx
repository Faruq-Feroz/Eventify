// Frontend: ViewEvents.js
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faList,
  faCalendarAlt,
  faMapMarkerAlt,
  faStar,
  faEdit,
  faTrash,
  faBoxArchive,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Truncate the event description to a given number of words.
 * Example: truncateWords("Hello world from React", 2) => "Hello world..."
 */
function truncateWords(text = "", wordLimit = 20) {
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) {
    return text; // No truncation needed
  }
  return words.slice(0, wordLimit).join(" ") + "...";
}

const ViewEvents = () => {
  // State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  // View/sorting/search states
  const [viewType, setViewType] = useState("grid");
  const [sortOrder, setSortOrder] = useState("earliest");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://eventify-backend-o3lh.onrender.com/api/events");
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setAlertMessage("Failed to load events.");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handlers
  const toggleFavorite = async (eventId) => {
    try {
      const response = await fetch(
        `https://eventify-backend-o3lh.onrender.com/api/events/${eventId}/favorite`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to update favorite status");

      const data = await response.json();
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev._id === eventId
            ? { ...ev, is_favorite: data.event.is_favorite }
            : ev
        )
      );
      setAlertMessage(data.message);
      setShowAlert(true);

      // Notify other components (if any) that favorites changed
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (error) {
      console.error("Error updating favorite status:", error);
      setAlertMessage("Failed to update favorite status.");
      setShowAlert(true);
    }
  };

  const toggleArchive = async (eventId) => {
    try {
      const response = await fetch(
        `https://eventify-backend-o3lh.onrender.com/api/events/${eventId}/archive`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to update archive status");

      const data = await response.json();
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev._id === eventId ? data.event : ev))
      );
      setAlertMessage("Event archived successfully!");
      setShowAlert(true);
    } catch (error) {
      console.error("Error archiving event:", error);
      setAlertMessage("Failed to archive event.");
      setShowAlert(true);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `https://eventify-backend-o3lh.onrender.com/api/events/${eventId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete event");

      setEvents((prevEvents) => prevEvents.filter((ev) => ev._id !== eventId));
      setAlertMessage("Event deleted successfully.");
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting event:", error);
      setAlertMessage("Failed to delete event.");
      setShowAlert(true);
    }
  };

  // Close alert
  const closeAlert = () => setShowAlert(false);

  // Sort & Filter
  const sortedEvents = [...events].sort((a, b) => {
    // Convert date strings to Date objects
    const dateA = new Date(a.event_date);
    const dateB = new Date(b.event_date);

    return sortOrder === "earliest" ? dateA - dateB : dateB - dateA;
  });

  const filteredEvents = sortedEvents.filter((ev) => {
    const query = searchQuery.toLowerCase();
    return (
      ev.title.toLowerCase().includes(query) ||
      (ev.description && ev.description.toLowerCase().includes(query)) ||
      (ev.location && ev.location.toLowerCase().includes(query))
    );
  });

  return (
    <section className="events-section">
      {/* HEADER */}
      <div className="events-header">
        <h1>All Events</h1>
        {/* Sort & View Controls */}
        <div className="header-controls">
          <div className="sort-control">
            <label htmlFor="sortByDate">Date</label>
            <select
              id="sortByDate"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-select"
            >
              <option value="earliest">Earliest First</option>
              <option value="latest">Latest First</option>
            </select>
          </div>
          <div className="view-controls">
            <button
              className={`view-toggle ${viewType === "grid" ? "active" : ""}`}
              onClick={() => setViewType("grid")}
            >
              <FontAwesomeIcon icon={faTh} />
            </button>
            <button
              className={`view-toggle ${viewType === "list" ? "active" : ""}`}
              onClick={() => setViewType("list")}
            >
              <FontAwesomeIcon icon={faList} />
            </button>
          </div>
        </div>
      </div>

      {/* LOADING / EMPTY / EVENTS */}
      {loading ? (
        <p className="loading-text">Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state">
          <p>No events available</p>
        </div>
      ) : (
        <div className={`event-grid events-${viewType}`}>
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              {/* Image (if available) */}
              {event.image_url && (
                <div className="event-card-image">
                  <img
                    src={`https://eventify-backend-o3lh.onrender.com${event.image_url}`}
                    alt={event.title}
                    className="event-image"
                  />
                </div>
              )}
              {/* Content */}
              <div className="event-card-content">
                <div className="event-card-header">
                  <h3 className="event-title">{event.title}</h3>
                </div>
                <div className="event-details">
                  <p>
                    <FontAwesomeIcon icon={faCalendarAlt} className="icon" />{" "}
                    {event.event_date}{" "}
                    {event.time && `at ${event.time}`} &bull;{" "}
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />{" "}
                    {event.location}
                  </p>
                </div>
                {/* Truncated Description */}
                {event.description && (
                  <p className="event-description">
                    {truncateWords(event.description, 10)}
                  </p>
                )}
                {/* Actions */}
                <div className="event-actions">
                  <button
                    onClick={() => toggleFavorite(event._id)}
                    className={`favorite-btn ${
                      event.is_favorite ? "active" : ""
                    }`}
                    title="Toggle Favorite"
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </button>
                  <button
                    onClick={() => toggleArchive(event._id)}
                    className={`archive-btn ${
                      event.is_archived ? "active" : ""
                    }`}
                    title="Archive"
                  >
                    <FontAwesomeIcon icon={faBoxArchive} />
                  </button>
                  <button className="edit-btn" title="Edit Event">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="delete-btn"
                    title="Delete Event"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ALERT POPUP */}
      {showAlert && (
        <div className="alert-popup">
          <p>{alertMessage}</p>
          <button onClick={closeAlert} className="alert-button">
            OK
          </button>
        </div>
      )}
    </section>
  );
};

export default ViewEvents;
