import React, { useState } from "react";
import { nextIcon, prevIcon } from "./svg";

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
  if (year % 4 !== 0) return false;
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

  return [
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ][calculatedDay % 7];
};

const calculateDecade = (currentYear) => {
  let startOfDecade = Math.floor(currentYear / 10) * 10;
  if (currentYear % 10 === 0) startOfDecade -= 10;
  const endOfDecade = startOfDecade + 9;
  return { startOfDecade, endOfDecade };
};

export const Calendar = () => {
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
  const [view, setView] = useState("days");

  const handleSelectedDate = (year, month, date) => {
    setSelectedDate(`${year}-${month}-${date}`);
  };

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

      years.push(
        <div
          key={year}
          className={`year ${year === selectedYear ? "selected" : ""}
          ${isCurrent ? "text-red" : ""}`}
          onClick={() => {
            setSelectedYear(year);
            setView("months");
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
          const isSelected =
            selectedMonth === id && currentYear === selectedYear;
          const isCurrent = currentMonth === id && currentYear === selectedYear;

          return (
            <div
              key={id}
              className={`month ${isSelected ? "selected" : ""}
                ${isCurrent ? "text-red" : ""}
              
              `}
              onClick={() => {
                setSelectedMonth(id);
                setView("days");
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

      const isSelected =
        dayFromSelectedDate === day &&
        monthFromSelectedDate === selectedMonth &&
        yearFromSelectedDate === selectedYear;

      days.push(
        <div
          key={day}
          className={`date ${isSelected ? "selected" : ""}`}
          onClick={() => handleSelectedDate(selectedYear, selectedMonth, day)}
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
            <div onClick={() => setView("years")}>{selectedYear}</div>
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
            <div onClick={() => setView("months")}>
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
  const [open, setOpen] = useState(false);

  return <div></div>;
}
