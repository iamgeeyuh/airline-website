import { useState } from "react";
import styles from "./TotalTickets.module.css";

const TotalTickets = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [complete, setComplete] = useState();

  const startHandler = (event) => {
    setStart(event.target.value);
  };

  const endHandler = (event) => {
    setEnd(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("start", start);
    formData.append("end", end);

    const formValues = [start, end];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      return;
    }
  };

  return (
    <form className={styles.totalTickets}>
      <h4>View Sales in Range:</h4>
      <div>
        <div>
          <label>Start Date</label>
          <input type="date" value={start} onChange={startHandler} />
        </div>
        <div>
          <label>End Date</label>
          <input type="date" value={end} onChange={endHandler} />
        </div>
        <div>
          <button type="submit" onClick={submitHandler}>
            Submit
          </button>
        </div>
      </div>
      {!complete && <p>Missing fields.</p>}
    </form>
  );
};

export default TotalTickets;
