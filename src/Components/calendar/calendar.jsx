import React, { useState, useEffect } from 'react';
import { supabase } from '../../client';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './calendar.css';

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
      const { data, error } = await supabase
        .from('Calendar')
        .select('*')
        .gte('Date/time', startOfMonth.toISOString())
        .lte('Date/time', endOfMonth.toISOString());

      if (error) throw error;
  
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.Event,
        start: new Date(event['Date/time']),
        end: event['End date'] ? new Date(event['End date']) : null,
        type: event.type || 'appointment'
      }));
  
      setEvents(formattedEvents);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Detailed error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (eventType) => {
    try {
      const newEvent = {
        Event: 'New ' + eventType,
        'Date/time': new Date().toISOString(),
        type: eventType,
        ...(eventType === 'medication' && { 'End date': new Date().toISOString() })
      };

      const { data, error } = await supabase
        .from('Calendar')
        .insert([newEvent])
        .select();

      if (error) throw error;

      const updatedEvent = {
        id: data[0].id,
        title: data[0].Event,
        start: new Date(data[0]['Date/time']),
        end: data[0]['End date'] ? new Date(data[0]['End date']) : null,
        type: data[0].type
      };

      setEvents([...events, updatedEvent]);
    } catch (err) {
      setError('Failed to add event');
      console.error('Error:', err);
    }
  };

  const handleAddAppointment = async (appointmentData) => {
    try {
      const { data, error } = await supabase
        .from('Calendar')
        .insert([
          {
            Event: appointmentData.appointmentName,
            'Date/time': appointmentData.dateTime
          }
        ])
        .select();

      if (error) throw error;

      const newEvent = {
        id: data[0].id,
        title: data[0].Event,
        start: new Date(data[0]['Date/time'])
      };

      setEvents([...events, newEvent]);
    } catch (err) {
      console.error('Error adding appointment:', err);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  };

  const isSameDay = (date1, date2) => {
    return date1 && date2 &&
           date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1 className="calendar-title">{formatDate(currentDate)}</h1>
        <div className="calendar-controls">
          <button onClick={prevMonth} className="calendar-button">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextMonth} className="calendar-button">
            <ChevronRight size={24} />
          </button>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="calendar-search"
          />
          <button
            onClick={() => addEvent('medication')}
            className="calendar-add-button"
          >
            Add Medication
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="calendar-add-button"
          >
            Add Appointment
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate.toISOString()}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {getDaysInMonth(currentDate).map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${
                  isSameDay(day, new Date()) ? 'calendar-day-today' : ''
                }`}
              >
                {day && (
                  <>
                    <div className="calendar-date">{day.getDate()}</div>
                    <div>
                      {events
                        .filter(event => isSameDay(event.start, day))
                        .map(event => (
                          <div
                            key={event.id}
                            className={`calendar-event ${
                              event.type === 'medication' ? 'calendar-event-medication' : 'calendar-event-appointment'
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {isModalOpen && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddAppointment}
        />
      )}
    </div>
  );
};


const AppointmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [appointmentName, setAppointmentName] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ appointmentName, dateTime });
    setAppointmentName('');
    setDateTime('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add New Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label htmlFor="appointmentName" className="modal-label">
              Appointment Name
            </label>
            <input
              type="text"
              id="appointmentName"
              value={appointmentName}
              onChange={(e) => setAppointmentName(e.target.value)}
              className="modal-input"
              required
            />
          </div>
          <div className="modal-form-group">
            <label htmlFor="dateTime" className="modal-label">
              Date and Time
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="modal-input"
              required
            />
          </div>
          <div className="modal-button-group">
            <button
              type="button"
              onClick={onClose}
              className="modal-button modal-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-button modal-button-primary"
            >
              Add Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default CalendarApp;