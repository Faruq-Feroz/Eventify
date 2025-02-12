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
  faBoxArchive 
} from "@fortawesome/free-solid-svg-icons";

// Define your deployed backend URL here.
const API_URL = "https://eventify-backend-o3lh.onrender.com";

const Favorites = () => {
  const [viewType, setViewType] = useState("grid");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/favorites`);
        if (!response.ok) throw new Error("Failed to fetch favorite events");
        
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching favorite events:", error);
        setAlertMessage("Failed to load favorite events.");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}/favorite`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to update favorite status");
      
      const data = await response.json();
      // If the event is no longer a favorite, remove it from the list
      if (!data.event.is_favorite) {
        setEvents(events.filter(event => event._id !== eventId));
      } else {
        // Otherwise update the event's favorite status
        setEvents(events.map(event => 
          event._id === eventId ? { ...event, is_favorite: data.event.is_favorite } : event
        ));
      }
      setAlertMessage(data.message);
      setShowAlert(true);
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error("Error updating favorite status:", error);
      setAlertMessage("Failed to update favorite status.");
      setShowAlert(true);
    }
  };

  const toggleArchive = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}/archive`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to update archive status");
      
      const data = await response.json();
      setEvents(events.map(event => 
        event._id === eventId ? data.event : event
      ));
      setAlertMessage("Event archived successfully!");
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating archive status:", error);
      setAlertMessage("Failed to archive event.");
      setShowAlert(true);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");
      
      setEvents(events.filter(event => event._id !== eventId));
      setAlertMessage("Event deleted successfully.");
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting event:", error);
      setAlertMessage("Failed to delete event.");
      setShowAlert(true);
    }
  };

  return (
    <section className="events-section">
      <div className="events-header">
        <h1>Favorite Events</h1>
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

      {loading ? (
        <p className="loading-text">Loading events...</p>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <p>No favorite events available</p>
        </div>
      ) : (
        <div className={`event-grid events-${viewType}`}>
          {events.map(event => (
            <div key={event._id} className="event-card">
              {event.image_url && (
                <img 
                  src={`${API_URL}${event.image_url}`} 
                  alt={event.title} 
                  className="event-image" 
                />
              )}
              <h3 className="event-title">{event.title}</h3>
              <div className="event-details">
                <p>
                  <FontAwesomeIcon icon={faCalendarAlt} className="icon" /> {event.event_date} &bull; 
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" /> {event.location}
                </p>
              </div>
              <div className="event-actions">
                <button 
                  onClick={() => toggleFavorite(event._id)} 
                  className={`favorite-btn ${event.is_favorite ? 'active' : ''}`}
                >
                  <FontAwesomeIcon icon={faStar} />
                </button>
                <button 
                  onClick={() => toggleArchive(event._id)} 
                  className={`archive-btn ${event.is_archived ? 'active' : ''}`}
                >
                  <FontAwesomeIcon icon={faBoxArchive} />
                </button>
                <button className="edit-btn">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  onClick={() => deleteEvent(event._id)} 
                  className="delete-btn"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAlert && (
        <div className="alert-popup">
          <p>{alertMessage}</p>
          <button onClick={() => setShowAlert(false)} className="alert-button">
            OK
          </button>
        </div>
      )}
    </section>
  );
};

export default Favorites;
