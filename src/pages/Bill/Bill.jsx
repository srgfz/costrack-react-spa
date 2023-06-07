import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Graph from "../../components/shared/Graph/Graph";
import { getUserRol, getUserId, getIdCommercial } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";

const Bill = () => {
  const params = useParams();
  const commercialId =
    getUserRol() === 0 ? getIdCommercial() : params.commercialId;

  const { isLoading, data, fetchData } = useFetch();
  const [chartData, setChartData] = useState();
  const [chartOptions, setChartOptions] = useState();
  const [gastos, setGastos] = useState([]);
  const [dataSet, setDataSet] = useState({});
  const [chartType, setChartType] = useState("doughnut");
  const [date1, setDate1] = useState("2023-05-01");
  const [date2, setDate2] = useState("2023-06-01");
  const [endpoint, setEndpoint] = useState(
    `http://localhost:3000/costrack/comerciales/gastos/${commercialId}?date1=${date1}&date2=${date2}`
  );

  //useEffect de llamada a la api
  useEffect(() => {
    setEndpoint(
      `http://localhost:3000/costrack/comerciales/gastos/${commercialId}?date1=${date1}&date2=${date2}`
    );
    // setEndpoint(
    //   ``
    // );
    fetchData(endpoint);
  }, [date1, date2, commercialId]);

  //Procesamiento de los datos
  useEffect(() => {
    if (data) {
      setGastos(data.gastos);
      const dataSet = gastos.reduce(
        (resultado, gasto) => {
          const categoria = gasto.categoria;
          const cuantia = gasto.cuantia;
          if (!resultado.categorias.includes(categoria)) {
            resultado.categorias.push(categoria);
            resultado.sumatorios.push(0);
          }
          const indice = resultado.categorias.indexOf(categoria);
          resultado.sumatorios[indice] += cuantia;
          return resultado;
        },
        { categorias: [], sumatorios: [] }
      );
      setDataSet(dataSet);
      console.log(dataSet.categorias);
      console.log(dataSet.sumatorios);
    }
  }, [data]);

  //UseEffect cada vez que cambian los datos devueltos--> UseEffect del gráfico
  useEffect(() => {
    if (dataSet.categorias != undefined) {
      const chartData = {
        labels: dataSet.categorias,
        datasets: [
          {
            label: "Gráfico de Gastos",
            data: dataSet.sumatorios,
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      };

      const backgroundColors = generateRandomColors(chartData.labels.length);
      const borderColors = generateRandomColors(chartData.labels.length);

      // Asignar los colores generados al chartData
      chartData.datasets[0].backgroundColor = backgroundColors;
      chartData.datasets[0].borderColor = borderColors;
      setChartData(chartData);

      const chartOptions = {};
      setChartOptions(chartOptions);
    }
  }, [dataSet]);

  // Generar colores aleatorios con suficiente contraste
  const generateRandomColors = (numColors) => {
    const colors = [];

    // Generar colores aleatorios
    for (let i = 0; i < numColors; i++) {
      const hue = Math.floor(Math.random() * 360); // Valor de matiz aleatorio (0-359)
      const saturation = Math.floor(Math.random() * 51) + 50; // Valor de saturación aleatorio (50-100)
      const luminosity = Math.floor(Math.random() * 21) + 40; // Valor de luminosidad aleatorio (40-60)
      const opacity = 0.5; // Opacidad deseada
      const color = `hsl(${hue}, ${saturation}%, ${luminosity}%, ${opacity})`;
      colors.push(color);
    }

    return colors;
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : !data ? (
        <ErrorBD />
      ) : (
        <>
          <h2>
            Gastos de {data.nombre} {data.apellidos}
          </h2>
          <div className="">
            <Graph
              data={chartData}
              options={chartOptions}
              chartType={chartType}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Bill;
