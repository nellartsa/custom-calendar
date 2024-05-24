import React, { useEffect, useRef, useState } from "react";
import { calendarIcon, nextIcon, prevIcon } from "./svg";

const monthNames = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const isLeapYear = (year) => {
  if (year % 4 !== 0) {
    if (year % 100 !== 0) return true;
    if (year % 400 !== 0) return false;
    return false;
  }
  return true;
};

const daysInMonths = (month, year) =>
  [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month - 1
  ];

const calculateDaySatToFri = (year, month, day) => {
  if (month < 3) {
    month += 12;
    year -= 1;
  }

  const K = year % 100;
  const J = Math.floor(year / 100);

  const calculatedDay =
    day +
    Math.floor((13 * (month + 1)) / 5) +
    K +
    Math.floor(K / 4) +
    Math.floor(J / 4) -
    Math.floor(2 * J);

  const dayOfWeek =
    calculatedDay % 7 < 0 ? ((calculatedDay % 7) + 7) % 7 : calculatedDay % 7;

  return [
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ][dayOfWeek];
};

const calculateDecade = (currentYear) => {
  let startOfDecade = Math.floor(currentYear / 10) * 10;
  if (currentYear % 10 === 0) startOfDecade -= 10;
  const endOfDecade = startOfDecade + 9;
  return { startOfDecade, endOfDecade };
};

export const Calendar = ({
  pickView = null,
  pickYear = null,
  pickMonth = null,
  pickDay = null,
  onSetOpen = () => {},
  onSetHighlight = () => {},
  onSetPickYear = () => {},
  onSetPickMonth = () => {},
  onSetPickDay = () => {},
}) => {
  const formattedDate = new Date().toISOString().split("T")[0];
  const [currentYear, currentMonth, currentDay] = formattedDate
    .split("-")
    .map(Number);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [yearFromSelectedDate, monthFromSelectedDate, dayFromSelectedDate] =
    selectedDate.split("-").map(Number);
  const [decade, setDecade] = useState(calculateDecade(currentYear));
  const [view, setView] = useState(pickView ? pickView : "days");

  const handlePrevMonthChange = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonthChange = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const renderYears = () => {
    const years = [];

    for (
      let year = decade.startOfDecade - 1;
      year <= decade.endOfDecade + 1;
      year++
    ) {
      const isCurrent = currentYear === year;
      const isSelected = pickYear ? year === pickYear : year === selectedYear;
      years.push(
        <div
          key={year}
          className={`year ${isSelected ? "selected" : ""} 
          ${isCurrent ? "text-red" : ""}`}
          onClick={() => {
            setSelectedYear(year);
            onSetPickYear(year);
            setView("months");
            onSetHighlight("months");
          }}
        >
          <div>{year}</div>
        </div>
      );
    }

    return <div className="years">{years}</div>;
  };

  const renderMonths = () => {
    return (
      <div className="months">
        {monthNames.map((month, index) => {
          const id = index + 1;
          const isSelected = pickMonth
            ? pickMonth === id && pickYear === selectedYear
            : selectedMonth === id && yearFromSelectedDate === selectedYear;
          const isCurrent = currentMonth === id && currentYear === selectedYear;

          return (
            <div
              key={id}
              className={`month ${isSelected ? "selected" : ""}
                ${isCurrent ? "text-red" : ""}
              
              `}
              onClick={() => {
                setSelectedDate(`${selectedYear}-${month}-0`);
                setSelectedMonth(id);
                onSetPickMonth(id);
                setView("days");
                onSetHighlight("days");
              }}
            >
              <div>{month}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDates = () => {
    const days = [];
    const currentSelectedTotalDays = daysInMonths(selectedMonth, selectedYear);
    const firstDayOfSelectedMonth = calculateDaySatToFri(
      selectedYear,
      selectedMonth,
      1
    );

    const formattedDayOfTheWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const previousMonthDays = daysInMonths(
      selectedMonth - 1 === 0 ? 12 : selectedMonth - 1,
      currentYear
    );
    const previousDaysToAdd =
      formattedDayOfTheWeek.indexOf(firstDayOfSelectedMonth) - 1;
    const previousDayToStart = previousMonthDays - previousDaysToAdd;
    for (let day = previousDayToStart; day <= previousMonthDays; day++) {
      days.push(
        <div key={`prev-${day}`} className="date text-gray">
          <div>{day}</div>
        </div>
      );
    }

    for (let day = 1; day <= currentSelectedTotalDays; day++) {
      const isCurrent =
        currentDay === day &&
        currentMonth === selectedMonth &&
        currentYear === selectedYear;

      const isSelected = pickDay
        ? pickDay === day &&
          monthFromSelectedDate === pickMonth &&
          yearFromSelectedDate === pickYear
        : dayFromSelectedDate === day &&
          monthFromSelectedDate === selectedMonth &&
          yearFromSelectedDate === selectedYear;

      days.push(
        <div
          key={day}
          className={`date ${isSelected ? "selected" : ""}`}
          onClick={() => {
            setSelectedDate(`${selectedYear}-${selectedMonth}-${day}`);
            onSetPickDay(day);
            onSetOpen(false);
          }}
        >
          <div className={`${isCurrent ? "text-red" : ""}`}>{day}</div>
        </div>
      );
    }

    const nextMonthDaysToAdd = 42 - days.length;
    for (let day = 1; day <= nextMonthDaysToAdd; day++) {
      days.push(
        <div key={`next-${day}`} className="date text-gray">
          <div>{day}</div>
        </div>
      );
    }

    return (
      <div className="dates">
        {["su", "mo", "tue", "we", "th", "fr", "sa"].map((day) => (
          <div key={day} className="header">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  return (
    <div className="calendar">
      {view === "years" && (
        <>
          <div className="controls">
            <div
              className="btn"
              onClick={() =>
                setDecade(calculateDecade(decade.endOfDecade - 10))
              }
            >
              {prevIcon}
            </div>
            <div>
              {decade.startOfDecade} - {decade.endOfDecade}
            </div>
            <div
              className="btn"
              onClick={() =>
                setDecade(calculateDecade(decade.endOfDecade + 10))
              }
            >
              {nextIcon}
            </div>
          </div>
          {renderYears()}
        </>
      )}

      {view === "months" && (
        <>
          <div className="controls">
            <div
              className="btn"
              onClick={() => setSelectedYear(selectedYear - 1)}
            >
              {prevIcon}
            </div>
            <div
              onClick={() => {
                setView("years");
                onSetHighlight("years");
              }}
            >
              {selectedYear}
            </div>
            <div
              className="btn"
              onClick={() => setSelectedYear(selectedYear + 1)}
            >
              {nextIcon}
            </div>
          </div>
          {renderMonths()}
        </>
      )}

      {view === "days" && (
        <>
          <div className="controls">
            <div className="btn" onClick={handlePrevMonthChange}>
              {prevIcon}
            </div>
            <div
              onClick={() => {
                setView("months");
                onSetHighlight("months");
              }}
            >
              {monthNames[selectedMonth - 1]} - {selectedYear}
            </div>
            <div className="btn" onClick={handleNextMonthChange}>
              {nextIcon}
            </div>
          </div>
          {renderDates()}
        </>
      )}
    </div>
  );
};

export default function DatePicker() {
  const [currentYear, currentMonth, currentDay] = new Date()
    .toISOString()
    .split("T")[0]
    .split("-")
    .map(Number);

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState("years");
  const [pickYear, setPickYear] = useState(currentYear);
  const [pickMonth, setPickMonth] = useState(currentMonth);
  const [pickDay, setPickDay] = useState(currentDay);

  return (
    <div className="calendar-group">
      <div
        className={`calendar-input ${open ? "focus" : ""}`}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className={`calendar-icon ${open ? "text-lblue" : ""}`}>
          {calendarIcon}
        </div>
        <div className="calendar-date ">
          <span
            className={`${highlight === "years" && open ? "highlighted" : ""}`}
          >
            {pickYear}
          </span>
          -
          <span
            className={`${highlight === "months" && open ? "highlighted" : ""}`}
          >
            {pickMonth}
          </span>
          -
          <span
            className={`${highlight === "days" && open ? "highlighted" : ""}`}
          >
            {pickDay}
          </span>
        </div>
      </div>
      <div className="calendar-comp" hidden={!open}>
        <Calendar
          pickView="years"
          pickYear={pickYear}
          pickMonth={pickMonth}
          pickDay={pickDay}
          onSetOpen={setOpen}
          onSetHighlight={setHighlight}
          onSetPickYear={setPickYear}
          onSetPickMonth={setPickMonth}
          onSetPickDay={setPickDay}
        />
      </div>
    </div>
  );
}
