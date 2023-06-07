import Graph from "../../components/shared/Graph/Graph";

const Home = () => {
  const chartType = "bar";
  const chartData = {
    labels: ["Etiqueta 1", "Etiqueta 2", "Etiqueta 3"],
    datasets: [
      {
        label: "Mi gráfico de barras",
        data: [10, 20, 30],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div>
      <h1>Home</h1>
      <div className="">
        <Graph data={chartData} options={chartOptions} chartType={chartType} />
      </div>
    </div>
  );
};

export default Home;
