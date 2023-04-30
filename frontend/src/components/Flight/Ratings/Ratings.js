import styles from "./Ratings.module.css";

const Ratings = (props) => {
  return (
    <div className={styles.ratingsContainer}>
      <div className={styles.ratings}>
        <h5>{props.name}</h5>
        {props.rating ? <h5>{props.rating} stars</h5> : <></>}
      </div>
      {props.review ? (
        <div className={styles.review}>
          <h6>{props.review}</h6>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Ratings;
