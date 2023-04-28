import { useState } from "react";
import Flight from "../Flight/Flight";
import StaffFlightCustomerModal from "../StaffFlightCustomersModal/StaffFlightCustomerModal";
import styles from "./FoundFlight.module.css";

const FoundFlight = (props) => {
  const [modal, setModal] = useState(false);

  const modalHandler = () => {
    setModal(false);
  };

  const checkCustomers = () => {
    if (props.page == "staff") {
      setModal(true);
    }
  };

  return (
    <div>
      <div onClick={checkCustomers}>
        <Flight
          airline="Jet Blue"
          srcCity="New York City"
          srcAirport="JFK"
          dstCity="Boston"
          dstAirport="Boston Airport"
          flightNum="587"
          depDate="2023-04-04"
          depTime="15:00:00"
          arrDate="2023-04-04"
          arrTime="8:00:00"
          price="3000.00"
        />
      </div>
      <div onClick={checkCustomers}>
        <Flight
          airline="Jet Blue"
          srcCity="New York City"
          srcAirport="JFK"
          dstCity="Boston"
          dstAirport="Boston Airport"
          flightNum="587"
          depDate="2023-04-04"
          depTime="15:00:00"
          arrDate="2023-04-04"
          arrTime="8:00:00"
          price="3000.00"
          onClick={checkCustomers}
        />
      </div>
      {modal && <StaffFlightCustomerModal modalHandler={modalHandler} />}
      {modal && <div className={styles.dimmedBackground}></div>}
    </div>
  );
};

export default FoundFlight;
