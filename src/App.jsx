import { useState } from "react";
import DatePicker, { Calendar } from "./DatePicker";
import "./App.css";

function App() {
  const [dateSelected, setDateSelected] = useState(new Date());

  return (
    <>
      <Calendar />
      <DatePicker />
    </>
  );
}

export default App;
