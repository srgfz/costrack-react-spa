/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Graph from "../../components/shared/Graph/Graph";
import { getUserRol, getIdCommercial } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import OrdersTable from "./components/OrdersTable/OrdersTable";

const Order = () => {
  const params = useParams();
  const commercialId =
    getUserRol() === 0 ? getIdCommercial() : params.commercialId;

  const formatDate = (actual = true) => {
    const currentDate = new Date();
    if (!actual) {
      currentDate.setMonth(currentDate.getMonth() - 1);
    }
    // Formatear la fecha actual en el formato yyyy-mm-dd
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const { isLoading, data, fetchData } = useFetch();
  const [chartData, setChartData] = useState();
  const [chartOptions, setChartOptions] = useState();
  const [dataSet, setDataSet] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [date1, setDate1] = useState(formatDate(false));
  const [date2, setDate2] = useState(formatDate());
  const [endpoint, setEndpoint] = useState(
    `http://localhost:3000/costrack/comerciales/pedidos/${commercialId}?date1=${date1}&date2=${date2}`
  );

  const procesarDatos = () => {
    const dataSet = data.pedidos.map((order) => {
      const total = order.pedido_lineas.reduce(
        (accumulator, line) => accumulator + line.cantidad * line.precio_unidad,
        0
      );
      return {
        id: order.id,
        total: total.toFixed(2),
        fecha: order.createdAt.substring(0, 10), // Extraer solo la fecha (YYYY-MM-DD)
        cliente: order.cliente.nombre,
        comentarios: order.comentarios,
      };
    });
    setDataSet(dataSet);
    console.log(dataSet);
  };

  //useEffect de llamada a la api
  useEffect(() => {
    const newEndpoint = `http://localhost:3000/costrack/comerciales/pedidos/${commercialId}?date1=${date1}&date2=${date2}`;
    setEndpoint(newEndpoint);
    fetchData(newEndpoint);
  }, [date1, date2, commercialId]);

  useEffect(() => {
    if (data) {
      procesarDatos(data);
    }
  }, [data]);

  //UseEffect cada vez que cambian los datos devueltos--> UseEffect del gráfico
  useEffect(() => {
    if (dataSet) {
      // Saco las fechas y los totales del array resultante
      const totals = dataSet.map((order) => parseFloat(order.total));
      const labels =
        chartType != "line"
          ? dataSet.map((order) => order.cliente)
          : dataSet.map((order) => order.fecha);

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: `Importe Total de los Pedidos`,
            data: totals,
            backgroundColor: "rgba(0, 123, 255, 0.5)",
            borderColor: "rgba(0, 123, 255, 1)",
            borderWidth: 1,
          },
        ],
      };
      if (chartType !== "line") {
        const backgroundColors = generateRandomColors(chartData.labels.length);
        const borderColors = generateRandomColors(chartData.labels.length);

        // Asignar los colores generados al chartData
        chartData.datasets[0].backgroundColor = backgroundColors;
        chartData.datasets[0].borderColor = borderColors;
      }

      setChartData(chartData);
      setChartOptions({});
    }
  }, [dataSet, chartType]);

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
          <div className="d-flex justify-content-between">
            <h2>
              Gastos de {data.nombre} {data.apellidos}
            </h2>
            {getUserRol() === 0 ? (
              <Link className="btn btn-primary" to="/new-bill">
                Añadir Gasto
              </Link>
            ) : null}
          </div>
          <div className="">
            <label htmlFor="date1">Fecha Inicio</label>
            <input
              type="date"
              id="date1"
              max={formatDate()}
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
            />
            <label htmlFor="date2">Fecha Fin</label>
            <input
              type="date"
              id="date2"
              min={date1}
              max={formatDate()}
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
            />
          </div>
          <div className=" bg-secondary bg-opacity-25 p-4">
            <label htmlFor="graphType">Tipo de gráfico</label>
            <select
              name="graphType"
              id="graphType"
              onChange={(e) => setChartType(e.target.value)}
              value={chartType}
            >
              <option value="line">Lineal</option>
              <option value="doughnut">Cilíndrico</option>
              <option value="pie">Circular</option>
              <option value="bar">Barras</option>
              <option value="radar">Área Hexagonal</option>
              <option value="polarArea">Area Polar</option>
            </select>
            <Graph
              data={chartData}
              options={chartOptions}
              chartType={chartType}
              className=""
            />
          </div>
          <div className="py-3">
            <OrdersTable data={dataSet} />
          </div>
        </>
      )}
    </div>
  );
};

export default Order;
