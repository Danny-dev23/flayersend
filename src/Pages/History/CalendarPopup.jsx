import React, { useState } from "react";

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  // 0 (вс) -> 6, 1 (пн) -> 0, ...
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

const isDateBefore = (date, min) => min && date < new Date(min).setHours(0,0,0,0);
const isDateAfter = (date, max) => max && date > new Date(max).setHours(23,59,59,999);

const CalendarPopup = ({ selected, onSelect, onClose, initialMonth, minDate, maxDate }) => {
  const initial = selected ? new Date(selected) : (initialMonth ? new Date(initialMonth) : new Date());
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const today = new Date();

  // Генерируем массив дней для сетки
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="calendar-popup">
      <div className="calendar-header">
        <button className="calendar-arrow" onClick={handlePrevMonth}>&lt;</button>
        <span className="calendar-title">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="calendar-arrow" onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-days-row">
        {DAYS.map(day => (
          <div key={day} className="calendar-day-name">{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((d, idx) => {
          if (!d) return <div key={idx} className="calendar-empty"></div>;
          const dateObj = new Date(viewYear, viewMonth, d);
          const isSelected = selected &&
            dateObj.getFullYear() === new Date(selected).getFullYear() &&
            dateObj.getMonth() === new Date(selected).getMonth() &&
            dateObj.getDate() === new Date(selected).getDate();
          const isToday =
            dateObj.getFullYear() === today.getFullYear() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getDate() === today.getDate();
          const disabled = isDateBefore(dateObj, minDate) || isDateAfter(dateObj, maxDate);
          return (
            <button
              key={idx}
              className={`calendar-day${isSelected ? " selected" : ""}${isToday ? " today" : ""}`}
              onClick={() => { if (!disabled) { onSelect(dateObj); onClose(); } }}
              disabled={disabled}
              tabIndex={disabled ? -1 : 0}
            >
              {d}
            </button>
          );
        })}
      </div>
      <button className="calendar-close" onClick={onClose}>Закрыть</button>
    </div>
  );
};

export default CalendarPopup; 