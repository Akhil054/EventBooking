import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiX, FiUser, FiMail, FiPhone, FiUsers, FiEdit2, FiDollarSign, FiChevronLeft, FiChevronRight, FiArrowLeft } from 'react-icons/fi';

const BookingModal = ({ event, onClose, onSubmit, onBackClick, allowPastDates = false }) => {
  const basePrice = Number(event.price.replace('$', ''));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendees: 1,
    eventDate: new Date(event.date),
    specialRequests: '',
    catering: false,
    parking: false,
    premiumSeating: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(basePrice);

  // Calculate total price when options change
  useEffect(() => {
    let calculatedPrice = basePrice;
    
    if (formData.catering) calculatedPrice += 50;
    if (formData.parking) calculatedPrice += 20;
    if (formData.premiumSeating) calculatedPrice += 75;
    
    calculatedPrice *= formData.attendees;
    setTotalPrice(calculatedPrice);
  }, [formData.catering, formData.parking, formData.premiumSeating, formData.attendees, basePrice]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^[0-9]{10,15}$/.test(formData.phone)) newErrors.phone = 'Invalid phone';
    if (formData.attendees < 1) newErrors.attendees = 'Must have at least 1 attendee';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onSubmit({
          ...formData,
          eventDate: formData.eventDate.toISOString(),
          totalPrice: totalPrice
        });
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div className="custom-header">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="nav-button"
      >
        <FiChevronLeft />
      </button>
      <div className="month-year-display">
        <select
          value={date.getMonth()}
          onChange={({ target: { value }}) => {
            const newDate = new Date(date);
            newDate.setMonth(parseInt(value));
            setFormData({...formData, eventDate: newDate});
          }}
          className="month-dropdown"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select
          value={date.getFullYear()}
          onChange={({ target: { value }}) => {
            const newDate = new Date(date);
            newDate.setFullYear(parseInt(value));
            setFormData({...formData, eventDate: newDate});
          }}
          className="year-dropdown"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() + i - 1;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="nav-button"
      >
        <FiChevronRight />
      </button>
    </div>
  );

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-content"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <div className="modal-header">
          {onBackClick && (
            <button className="back-button" onClick={onBackClick}>
              <FiArrowLeft />
            </button>
          )}
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <h2>
          <FiEdit2 className="icon" />
          Book {event.title}
        </h2>
        
        <div className="date-picker-section">
          <label>Event Date</label>
          <DatePicker
            selected={formData.eventDate}
            onChange={(date) => setFormData({...formData, eventDate: date})}
            minDate={allowPastDates ? null : new Date()}
            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
            inline
            showMonthDropdown={false}
            showYearDropdown={false}
            renderCustomHeader={renderCustomHeader}
            calendarClassName="custom-calendar"
            dayClassName={(date) => {
              const isToday = new Date().toDateString() === date.toDateString();
              return isToday ? 'highlight-today' : undefined;
            }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className={`form-group ${formData.name ? 'filled' : ''}`}>
              <FiUser className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Full Name</label>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className={`form-group ${formData.email ? 'filled' : ''}`}>
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Email Address</label>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${formData.phone ? 'filled' : ''}`}>
              <FiPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Phone Number</label>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className={`form-group ${formData.attendees ? 'filled' : ''}`}>
              <FiUsers className="input-icon" />
              <input
                type="number"
                name="attendees"
                min="1"
                value={formData.attendees}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Number of Attendees</label>
              {errors.attendees && <span className="error-message">{errors.attendees}</span>}
            </div>
          </div>

          <div className="additional-options">
            <h4>Additional Services</h4>
            
            <div className="option-group">
              <label className="option-item">
                <input
                  type="checkbox"
                  name="catering"
                  checked={formData.catering}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Catering Service (+$50)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Parking Pass (+$20)
              </label>
              
              <label className="option-item">
                <input
                  type="checkbox"
                  name="premiumSeating"
                  checked={formData.premiumSeating}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Premium Seating (+$75)
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3"
              placeholder="Any special requirements or notes for the organizer..."
            />
          </div>

          <div className="price-summary">
            <div className="price-item">
              <span>Base Price:</span>
              <span>${basePrice} x {formData.attendees}</span>
            </div>
            
            {formData.catering && (
              <div className="price-item">
                <span>Catering:</span>
                <span>+$50 x {formData.attendees}</span>
              </div>
            )}
            
            {formData.parking && (
              <div className="price-item">
                <span>Parking:</span>
                <span>+$20 x {formData.attendees}</span>
              </div>
            )}
            
            {formData.premiumSeating && (
              <div className="price-item">
                <span>Premium Seating:</span>
                <span>+$75 x {formData.attendees}</span>
              </div>
            )}
            
            <div className="price-total">
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
          
          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              <>
                <FiDollarSign /> Confirm Booking (${totalPrice})
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;