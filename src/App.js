import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventList from '../src/components/EventList';
import BookingModal from '../src/components/BookingModal';
import MyBookings from '../src/components/MyBookings';
import '../src/styles/App.css';

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  
  // Load bookings from localStorage on initial render
  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem('eventBookings');
    return savedBookings ? JSON.parse(savedBookings) : [];
  });

  // Delete single booking
  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const updatedBookings = bookings.filter(booking => booking.bookingId !== bookingId);
      setBookings(updatedBookings);
    }
  };

  // Save to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('eventBookings', JSON.stringify(bookings));
  }, [bookings]);

  const events = [
    {
      id: 1,
      title: "Tech Conference 2023",
      date: "2023-12-15",
      location: "Mumbai",
      description: "Annual technology conference featuring top industry speakers",
      price: "$300",
      category: "conference",
      image: "https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaCUyMGNvbmZlcmVuY2V8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: 2,
      title: "Music Festival",
      date: "2023-10-30",
      location: "Mumbai",
      description: "Get ur groove on at the biggest music festival of the year",
      price: "$699",
      category: "Music",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bXVzaWMlMjBmZXN0aXZhbHxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 3,
      title: "Business Workshop",
      date: "2023-10-30",
      location: "Cyber, Kolhapur",
      description: "Interactive workshop for entrepreneurs and startups",
      price: "$799",
      category: "workshop",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVzaW5lc3MlMjB3b3Jrc2hvcHxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 4,
      title: "Birthday Party",
      date: "Kolhapur",
      location: "",
      description: "Get ur Birthday done with a bang & have a lots of fun ",
      price: "$599",
      category: "Party",
      image: "https://images.unsplash.com/photo-1562967005-a3c85514d3e9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QmlydGhkYXklMjBwYXJ0eXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 5,
      title: "Wedding Ceremony ",
      date: "2023-10-30",
      location: "Mumbai",
      description: "Get ur Wedding done with a bang & Professional way ",
      price: "$999",
      category: "Party",
      image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdlZGRpbmclMjBwbGFubmluZ3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 6,
      title: "Tech Workshop",
      date: "2023-10-30",
      location: "Mumbai",
      description: " Get & apply Unique Tech Skills",
      price: "$899",
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaCUyMGNvbmZlcmVuY2V8ZW58MHx8MHx8fDA%3D"
    }
  ];

  const handleBookNow = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleBookingSubmit = (bookingData) => {
    const newBooking = {
      ...bookingData,
      event: selectedEvent,
      bookingId: Date.now(), // Unique ID for each booking
      bookingDate: new Date().toISOString()
    };
    setBookings([...bookings, newBooking]);
    setShowModal(false);
  };

  // Clear all bookings
  const clearBookings = () => {
    if (window.confirm("Are you sure you want to clear all bookings?")) {
      localStorage.removeItem('eventBookings');
      setBookings([]);
    }
  };

  return (
    <div className="app">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container"
      >
        <h1 className="main-title">
          Event<span className="accent">Hub</span>
        </h1>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Upcoming Events
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings ({bookings.length})
          </button>
        </div>

        {activeTab === 'events' ? (
          <EventList events={events} onBookNow={handleBookNow} />
        ) : (
          <>
            <MyBookings 
              bookings={bookings} 
              onDeleteBooking={handleDeleteBooking}
            />
            {bookings.length > 0 && (
              <button 
                onClick={clearBookings}
                className="clear-bookings-btn"
              >
                Clear All Bookings
              </button>
            )}
          </>
        )}

        <AnimatePresence>
          {showModal && (
            <BookingModal
              event={selectedEvent}
              onClose={() => setShowModal(false)}
              onSubmit={handleBookingSubmit}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;