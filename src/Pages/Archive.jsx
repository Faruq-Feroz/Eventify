// Frontend: Archive.jsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTh,
  faList,
  faArchive,
  faCalendarAlt,
  faMapMarkerAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

const Archive = () => {
  const [viewType, setViewType] = useState('grid');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Fetch archived events on component mount
  useEffect(() => {
    const fetchArchivedEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events/archived");
        if (!response.ok) throw new Error("Failed to fetch archived events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching archived events:", error);
        setAlertMessage("Failed to load archived events.");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedEvents();
  }, []);

  const toggleView = (type) => {
    setViewType(type);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  // Toggle archive status (i.e. unarchive) for an event
  const toggleArchive = async (eventId) => {
    try {
      // We send a JSON body to indicate that we want to unarchive this event.
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/archive`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        // Sending is_archived: false to unarchive the event
        body: JSON.stringify({ is_archived: false })
      });
      if (!response.ok) throw new Error("Failed to update archive status");
      const data = await response.json();

      // If the event is now unarchived, remove it from the list.
      if (!data.event.is_archived) {
        setEvents(events.filter(event => event._id !== eventId));
      } else {
        setEvents(events.map(event =>
          event._id === eventId ? { ...event, is_archived: data.event.is_archived } : event
        ));
      }
      setAlertMessage(data.message);
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating archive status:", error);
      setAlertMessage("Failed to update archive status.");
      setShowAlert(true);
    }
  };

  // Delete an event from the archive
  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
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
    <section className="archived-section">
      <div className="section-header">
        <h1>Archived Events</h1>
        <div className="view-controls">
          <button 
            className={`view-toggle grid-view ${viewType === 'grid' ? 'active' : ''}`}
            onClick={() => toggleView('grid')}
          >
            <FontAwesomeIcon icon={faTh} />
          </button>
          <button 
            className={`view-toggle list-view ${viewType === 'list' ? 'active' : ''}`}
            onClick={() => toggleView('list')}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
        </div>
      </div>
      
      {loading ? (
        <p className="loading-text">Loading archived events...</p>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <FontAwesomeIcon icon={faArchive} size="3x" />
          <h2>No Archived Events</h2>
          <p>Events you archive will appear here</p>
        </div>
      ) : (
        <div id="event-list" className={`events-${viewType}`}>
          {events.map(event => (
            <div key={event._id} className="event-card">
              {event.image_url && (
                <img 
                  src={`http://localhost:5000${event.image_url}`} 
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
                {/* Unarchive button */}
                <button 
                  onClick={() => toggleArchive(event._id)}
                  className="archive-btn"
                  title="Unarchive Event"
                >
                  <FontAwesomeIcon icon={faArchive} />
                </button>
                {/* Delete button */}
                <button 
                  onClick={() => deleteEvent(event._id)}
                  className="delete-btn"
                  title="Delete Event"
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
          <button onClick={closeAlert}>OK</button>
        </div>
      )}
    </section>
  );
};

export default Archive;
