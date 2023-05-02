import { useState } from "react";
import PassengersModal from "../PassengersModal/PassengersModal";
import RatingsModal from "../Ratings/RatingsModal/RatingsModal";
import PurchaseModal from "../PurchaseModal/PurchaseModal";
import styles from "./Flight.module.css";

const Flight = (props) => {
  const [modalRatings, setModalRatings] = useState(false);
  const [modalPassenger, setModalPassenger] = useState(false);
  const [modalPurchase, setModalPurchase] = useState(false);

  const modalRatingsHandler = () => {
    setModalRatings(false);
  };

  const modalPassengersHandler = () => {
    setModalPassenger(false);
  };

  const modalPurchaseHandler = () => {
    setModalPurchase(false);
  };

  const checkRatings = () => {
    setModalRatings(true);
  };

  const checkPassengers = () => {
    setModalPassenger(true);
  };

  const checkPurchase = () => {
    setModalPurchase(true);
  };

  return (
    <div>
      <div className={styles.flight}>
        <label className={styles.flightAirline}>{props.airline}</label>
        <div>
          {props.page == "staff" && (
            <button className={styles.buttons} onClick={checkRatings}>
              Ratings
            </button>
          )}
          {props.page == "staff" && (
            <button className={styles.buttons} onClick={checkPassengers}>
              Passengers
            </button>
          )}
          {props.page == "customer" && (
            <button className={styles.buttons} onClick={checkPurchase}>
              Purchase
            </button>
          )}

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
      {modalRatings && <RatingsModal modalHandler={modalRatingsHandler} />}
      {modalRatings && <div className={styles.dimmedBackground}></div>}
      {modalPassenger && (
        <PassengersModal modalHandler={modalPassengersHandler} />
      )}
      {modalPassenger && <div className={styles.dimmedBackground}></div>}
      {modalPurchase && <PurchaseModal modalHandler={modalPurchaseHandler} />}
      {modalPurchase && <div className={styles.dimmedBackground}></div>}
    </div>
  );
};

export default Flight;
