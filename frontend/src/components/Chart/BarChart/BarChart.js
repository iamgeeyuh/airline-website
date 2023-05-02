import styles from "./BarChart.module.css";

const BarChart = (props) => {
  let barFillHeight = "0%";

  if (props.maxValue > 0) {
    barFillHeight = Math.round((props.value / props.maxValue) * 100) + "%";
  }

  return (
    <div className={styles.barChart}>
      <div className={styles.barChartInner} title={props.value}>
        <div
          className={styles.barChartFill}
          style={{ height: barFillHeight }}
        ></div>
      </div>
      <div className={styles.barChartLabel}>{props.label}</div>
    </div>
  );
};

export default BarChart;
