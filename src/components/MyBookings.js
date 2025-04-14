import React from 'react';
import { FiCalendar, FiMapPin, FiDollarSign, FiUser, FiUsers, FiTrash2 } from 'react-icons/fi';

const MyBookings = ({ bookings, onDeleteBooking }) => {
  if (bookings.length === 0) {
    return (
      <div className="empty-bookings">
        <FiCalendar className="icon" />
        <h3>No bookings yet</h3>
        <p>Book an event to see it here</p>
      </div>
    );
  }

  const handleDelete = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      onDeleteBooking(bookingId);
    }
  };

  return (
    <div className="bookings-container">
      {bookings.map((booking) => (
        <div key={booking.bookingId} className="booking-card">
          <div className="booking-header">
            <h3>{booking.event.title}</h3>
            <div className="booking-actions">
              <span className="booking-date">
                Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
              </span>
              <button 
                onClick={() => handleDelete(booking.bookingId)}
                className="delete-btn"
                aria-label="Delete booking"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
          
          <div className="booking-details">
            <div className="detail-item">
              <FiCalendar className="icon" />
              <span>
                Event Date: {new Date(booking.eventDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="detail-item">
              <FiMapPin className="icon" />
              <span>{booking.event.location}</span>
            </div>

            <div className="detail-item">
              <FiUser className="icon" />
              <span>Booked by: {booking.name}</span>
            </div>

            <div className="detail-item">
              <FiUsers className="icon" />
              <span>Attendees: {booking.attendees}</span>
            </div>
          </div>
          
          <div className="booking-footer">
            <div className="price-info">
              <span className="label">Total Paid:</span>
              <span className="value">${booking.totalPrice}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;