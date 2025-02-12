// src/pages/Home.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt,
  faUsers,
  faStar,
  faBell
} from '@fortawesome/free-solid-svg-icons'
// import '../styles/home.css'

const Home = () => {
  return (
    <section className="event-overview-section">
      <h1>Event Overview</h1>

      <div className="event-highlights">
        <div className="highlight-item">
          <FontAwesomeIcon icon={faCalendarAlt} />
          <h3>Upcoming Events</h3>
          <p>Keep track of all your upcoming events in one place.</p>
        </div>
        
        <div className="highlight-item">
          <FontAwesomeIcon icon={faUsers} />
          <h3>Organize Effortlessly</h3>
          <p>Collaborate with others and organize events with ease.</p>
        </div>
        
        <div className="highlight-item">
          <FontAwesomeIcon icon={faStar} />
          <h3>Favorites</h3>
          <p>Highlight your favorite events for quick access.</p>
        </div>
        
        <div className="highlight-item">
          <FontAwesomeIcon icon={faBell} />
          <h3>Event Notifications</h3>
          <p>Stay updated with instant notifications about upcoming events and changes.</p>
        </div>
      </div>
    </section>
  )
}

export default Home