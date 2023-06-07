import { useEffect } from "react";
import Chart from "chart.js";

const Graph = ({ data, options, chartType }) => {
  useEffect(() => {
    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
      type: chartType,
      data: data,
      options: options,
    });
  }, [data, options, chartType]);

  return (
    <div>
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default Graph;
