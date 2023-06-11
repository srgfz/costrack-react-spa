/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

// eslint-disable-next-line react/prop-types
const Graph = ({ data, options, chartType, title = null }) => {
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    // Destruir el gráfico existente antes de crear uno nuevo
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Crear un nuevo gráfico
    const ctx = chartRef.current.getContext("2d");
    chartInstance = new Chart(ctx, {
      type: chartType,
      data: data,
      options: {},
    });

    // Limpieza al desmontar el componente
    return () => {
      // Destruir el gráfico
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data, options, chartType]);

  return (
    <div>
      <h4 className="text-center">{title}</h4>
      <canvas ref={chartRef} className="canvasGraph"></canvas>
    </div>
  );
};

export default Graph;
