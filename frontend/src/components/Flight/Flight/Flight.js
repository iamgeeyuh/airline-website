import styles from "./Flight.module.css";

const Flight = (props) => {
  return (
    <div className={styles.flight}>
      <label className={styles.flightAirline}>{props.airline}</label>
      <div>
        <div>
          <label>From</label>
          <h2>{props.depTime}</h2>
          <h5 style={{ color: "var(--font-purple)" }}>
            {props.srcCity}-{props.srcAirport}
          </h5>
          <h5>{props.depDate}</h5>
        </div>
        <div>
          <label>To</label>
          <h2>{props.arrTime}</h2>
          <h5 style={{ color: "var(--font-purple)" }}>
            {props.dstCity}-{props.dstAirport}
          </h5>
          <h5>{props.arrDate}</h5>
        </div>
        <div>
          <h2>${props.price}</h2>
        </div>
      </div>
    </div>
  );
};

export default Flight;
