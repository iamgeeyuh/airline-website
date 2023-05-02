import BarChart from "./BarChart/BarChart";
import styles from "./Chart.module.css";

const Chart = (props) => {
  const dataPointValues = props.dataPoints.map(
    (dataPoint) => dataPoint.tickets
  );
  const totalMaximum = Math.max(...dataPointValues);

  return (
    <div className={styles.chart}>
      {props.dataPoints.map((dataPoint) => (
        <BarChart
          key={dataPoint.label}
          value={dataPoint.tickets}
          maxValue={totalMaximum}
          label={dataPoint.label}
        />
      ))}
    </div>
  );
};

export default Chart;
