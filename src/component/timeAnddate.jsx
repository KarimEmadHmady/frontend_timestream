import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './timeAnddate.css';

const Clock = () => {
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      setTime(moment().format('h:mm:ss A')); 
      setDay(moment().format('dddd'));
      setDate(moment().format('D. MMMM YYYY'));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="clock" className="clock">
      <div id="day">{day}</div>
      <div id="date">{date}</div>
      <div id="time">{time}</div>
    </div>
  );
};

export default Clock;
