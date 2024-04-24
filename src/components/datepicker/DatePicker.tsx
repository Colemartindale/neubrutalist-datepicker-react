import React, { useEffect, useRef, useState } from 'react';
import './DatePicker.css';
import { DatePickerProps } from './DatePicker.types';


const DatePicker: React.FC<DatePickerProps> = ({ 
  selected,
  onChange,
  onSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const getDaysInMonth = (date: Date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month + 1, 0).getDate();
  };

  const createCalendar = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthStartDayOfWeek = monthStart.getDay(); // Sunday - 0, Saturday - 6

    // Calculate days to prepend from previous month
    const daysFromPrevMonth = monthStartDayOfWeek === 0 ? 6 : monthStartDayOfWeek - 1; // Adjust based on week start day, assuming Monday start
    const prevMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    const daysInPrevMonth = getDaysInMonth(prevMonth);

    const dates = [];
    // Days from previous month
    for (let i = daysFromPrevMonth; i > 0; i--) {
      dates.push(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i + 1));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    // Days from next month to complete the week
    const totalCells = dates.length % 7 === 0 ? dates.length : dates.length + (7 - dates.length % 7);
    for (let i = 1; dates.length < totalCells; i++) {
      dates.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
    }

    return dates;
  };

  const dates = createCalendar(currentDate);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={selectedDate}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Select a date"
        className='input'
      />
      {isOpen && (
        <div className="datePickerDropdown">
          <div className="datePickerContainer">
            {/* HEADER */}
            <div className="header">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="monthNavigationButton"
              >
                Prev
              </button>
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="monthNavigationButton"
              >
                Next
              </button>
            </div>
            {/* DAYS OF THE WEEK */}
            <div className="daysOfWeek">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div className="day" key={day}>{day}</div>
              ))}
            </div>
            {/* DATE GRID */}
            <div className="dateGrid">
              {dates.map((date, index) => (
                <div
                  key={index}
                  className={`day ${date.getMonth() !== currentDate.getMonth() ? 'otherMonth' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  {date.getDate()}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
