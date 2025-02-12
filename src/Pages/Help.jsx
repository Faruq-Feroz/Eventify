
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlusCircle, faCalendarCheck, faLifeRing } from '@fortawesome/free-solid-svg-icons';

const HelpSection = () => {
    return (
        <section className="help-section">
            <h1>Help & Support</h1>
            <div className="help-highlights">
                <div className="help-item">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <h3>Getting Started</h3>
                    <p>Learn how to navigate and use Event Manager effectively.</p>
                </div>
                <div className="help-item">
                    <FontAwesomeIcon icon={faPlusCircle} />
                    <h3>Creating Events</h3>
                    <p>Step-by-step guide to creating and managing your events.</p>
                </div>
                <div className="help-item">
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    <h3>Viewing Events</h3>
                    <p>Discover how to view your events in the list or calendar view.</p>
                </div>
                <div className="help-item">
                    <FontAwesomeIcon icon={faLifeRing} />
                    <h3>Need More Help?</h3>
                    <p>Contact support or explore FAQs for additional assistance.</p>
                </div>
            </div>
        </section>
    );
};

export default HelpSection;
