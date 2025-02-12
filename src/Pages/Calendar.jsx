import { useState, useEffect } from 'react';

// Define your deployed backend URL here
const API_URL = "https://eventify-backend-o3lh.onrender.com";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Use the full URL to your deployed backend server
        const response = await fetch(`${API_URL}/api/events/upcoming`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        
        // Log the response status and headers for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get the raw response text first
        const rawResponse = await response.text();
        console.log('Raw API response:', rawResponse);
        
        // Only try to parse if we have content
        if (rawResponse) {
          const data = JSON.parse(rawResponse);
          console.log("Parsed Events:", data);
          setEvents(Array.isArray(data) ? data : []);
          setError(null);
        } else {
          console.log('No content in response');
          setEvents([]);
          setError('No events data received');
        }
        
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.message);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayDate = new Date(year, month, day);
      const dateString = currentDayDate.toISOString().split('T')[0];
      
      const dayEvents = events.filter(event => event.event_date === dateString);

      days.push(
        <div key={day} className={`calendar-day ${dayEvents.length > 0 ? 'has-event' : ''}`}>
          <div className="day-number">{day}</div>
          <div className="event-list">
            {dayEvents.map((event, index) => (
              <div 
                key={index} 
                className="event-marker"
                title={`${event.title} - ${event.time || 'No time specified'}`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="move-btn" onClick={() => navigateMonth(-1)}>&lt; Previous</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button className="move-btn" onClick={() => navigateMonth(1)}>Next &gt;</button>
      </div>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', margin: '10px 0' }}>
          Error loading events: {error}
        </div>
      )}

      <div className="day-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;
