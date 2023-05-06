import { useRef, useEffect, useState, useContext } from "react";
import SuccessModal from "../../SuccessModal/SuccessModal";
import styles from "./PurchaseModal.module.css";
import AuthContext from "../../../context/auth-context";

const PurchaseModal = (props) => {
  const ctx = useContext(AuthContext);
  const modalRef = useRef(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [dob, setDob] = useState("");
  const [cardType, setCardType] = useState("credit");
  const [cardName, setCardName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [complete, setComplete] = useState(true);
  const [modal, setModal] = useState(false);
  const [valid, setValid] = useState(false);

  const fnameHandler = (event) => {
    setFname(event.target.value);
  };

  const lnameHandler = (event) => {
    setLname(event.target.value);
  };

  const dobHandler = (event) => {
    setDob(event.target.value);
  };

  const cardTypeHandler = (event) => {
    setCardType(event.target.value);
  };

  const cardNameHandler = (event) => {
    setCardName(event.target.value);
  };

  const cardNumHandler = (event) => {
    setCardNum(event.target.value);
  };

  const cardExpHandler = (event) => {
    setCardExp(event.target.value);
  };

  useEffect(() => {
    const clickOutsideHandler = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        props.modalHandler();
      }
    };
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [modalRef]);

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("dob", dob);
    formData.append("card_type", cardType);
    formData.append("card_name", cardName);
    formData.append("card_num", cardNum);
    formData.append("card_exp", cardExp);
    formData.append("flight_num", props.flightNum);
    formData.append("airline_name", props.airline);
    formData.append("dep_timestamp", props.depDate + " " + props.depTime)
    formData.append("email", ctx.isLoggedIn.email);

    const formValues = [fname, lname, dob, cardType, cardName, cardNum,cardExp];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      return;
    }

    fetch("http://localhost:5000/purchase_tickets", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error purchasing");
        }
      })
      .then((data) => {
        setModal(true);
        setComplete(false);
        setValid(data.valid);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.modal} ref={modalRef}>
      <form className={styles.purchaseModal}>
        <h2>Purchase Ticket</h2>
        <div>
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={fname}
              onChange={fnameHandler}
              placeholder="John"
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              value={lname}
              onChange={lnameHandler}
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <div>
            <label>Date of Birth</label>
            <input type="date" value={dob} onChange={dobHandler} />
          </div>
        </div>
        <div>
          <div>
            <label>Card Type</label>
            <select value={cardType} onChange={cardTypeHandler}>
              <option>credit</option>
              <option>debit</option>
            </select>
          </div>
          <div>
            <label>Name on Card</label>
            <input
              type="text"
              value={cardName}
              onChange={cardNameHandler}
              placeholder="John Doe"
            />
          </div>
        </div>
        <div>
          <div>
            <label>Card Number</label>
            <input
              type="number"
              value={cardNum}
              onChange={cardNumHandler}
              placeholder="0000000000000000"
            />
          </div>
          <div>
            <label>Expiration Date</label>
            <input type="date" value={cardExp} onChange={cardExpHandler} />
          </div>
        </div>
        {!complete && <p>Missing fields.</p>}
        <button onClick={submitHandler} type="submit">
          Submit
        </button>
      </form>
      {modal && <SuccessModal message={valid ? "Ticket purchased!" : "Ticket already purchased"} modalHandler={props.modalHandler}/>}
      {modal && <div className={styles.dimmedBackground}></div>}
    </div>
  );
};

export default PurchaseModal;
