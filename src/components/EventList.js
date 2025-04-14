import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiDollarSign } from 'react-icons/fi';


const EventList = ({ events, onBookNow }) => {
  return (
    <div className="events-container">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          className="event-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div 
            className="event-image"
            style={{ backgroundImage: `url(${event.image})` }}
          >
            <span className={`event-category ${event.category}`}>
              {event.category}
            </span>
          </div>
          
          <div className="event-content">
            <h3>{event.title}</h3>
            <p className="event-description">{event.description}</p>
            
            <div className="event-details">
              <div className="detail-item">
                <FiCalendar className="icon" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className="detail-item">
                <FiMapPin className="icon" />
                <span>{event.location}</span>
              </div>
              
              <div className="detail-item">
                <FiDollarSign className="icon" />
                <span>{event.price}</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="book-now-btn"
              onClick={() => onBookNow(event)}
            >
              Book Now
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EventList;