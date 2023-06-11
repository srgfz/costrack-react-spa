/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Graph from "../../components/shared/Graph/Graph";
import { getUserRol, getIdCommercial } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import OrdersTable from "./components/OrdersTable/OrdersTable";
import SelectComerciales from "../../components/shared/SelectComerciales/SelectComerciales";
import Alert from "../../components/shared/Alert/Alert";

const Order = () => {
  const { commercialId } = useParams();
  const { type } = useParams();

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
  const { isLoading, data, error, fetchData } = useFetch();
  const [chartData, setChartData] = useState();
  const [chartOptions, setChartOptions] = useState();
  const [dataSet, setDataSet] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [date1, setDate1] = useState(formatDate(false));
  const [date2, setDate2] = useState(formatDate());

  const firstEndpoint = getIdCommercial()
    ? `http://localhost:3000/costrack/comerciales/pedidos/${getIdCommercial()}?date1=${date1}&date2=${date2}`
    : `http://localhost:3000/costrack/comerciales/pedidos/${commercialId}?date1=${date1}&date2=${date2}`;
  const [endpoint, setEndpoint] = useState(firstEndpoint);

  const procesarDatos = () => {
    if (!data.pedidos) {
      return null;
    }
    const dataSet = data.pedidos.map((order) => {
      const total = order.pedido_lineas.reduce(
        (accumulator, line) => accumulator + line.cantidad * line.precio_unidad,
        0
      );
      return {
        id: order.id,
        total: total,
        fecha: order.createdAt.substring(0, 10), // Extraer solo la fecha (YYYY-MM-DD)
        cliente: order.cliente.nombre,
        comentarios: order.comentarios,
        clienteId: order.clienteId,
        direccion: order.cliente.direccion,
      };
    });
    setDataSet(dataSet);
  };

  //useEffect de llamada a la api
  useEffect(() => {
    if (getIdCommercial()) {
      const newEndpoint = `http://localhost:3000/costrack/comerciales/pedidos/${getIdCommercial()}?date1=${date1}&date2=${date2}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    } else {
      const newEndpoint = `http://localhost:3000/costrack/comerciales/pedidos/${commercialId}?date1=${date1}&date2=${date2}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    }
  }, [date1, date2, commercialId]);

  useEffect(() => {
    if (data) {
      procesarDatos(data);
    }
  }, [data]);

  //UseEffect cada vez que cambian los datos devueltos--> UseEffect del gráfico
  useEffect(() => {
    if (dataSet) {
      if (chartType === "line") {
        // Saco las fechas y los totales del array resultante
        const totals = dataSet.map((order) => parseFloat(order.total));
        const labels = dataSet.map((order) => order.fecha);

        const chartData = {
          labels: labels.reverse(),
          datasets: [
            {
              label: `Importe Total de los Pedidos`,
              data: totals.reverse(),
              backgroundColor: "#496e81ae",
              borderColor: "#496e81e2",
              borderWidth: 1,
              fill: true,
            },
          ],
        };

        setChartData(chartData);
      } else {
        // Crear un objeto Map para almacenar los valores únicos y sumatorios
        const uniqueMap = new Map();

        // Recorrer el array de JSONs
        dataSet.forEach((order) => {
          const id = order.clienteId;
          const total = order.total;
          const nombre = order.cliente;

          // Verificar si el ID ya existe en el Map
          if (uniqueMap.has(id)) {
            // Si el ID existe, sumar el valor actual al sumatorio existente
            const sum = uniqueMap.get(id).sum + total;
            uniqueMap.set(id, { sum, nombre });
          } else {
            // Si el ID no existe, agregar una nueva entrada al Map
            uniqueMap.set(id, { sum: total, nombre });
          }
        });

        // Convertir el Map en un array de JSONs con ID, sumatorio y nombre
        const result = Array.from(uniqueMap, ([id, data]) => ({
          id: parseInt(id),
          total: data.sum,
          nombre: data.nombre,
        }));

        // Obtener arrays separados de nombres y números, manteniendo el orden
        const clientes = result.map((obj) => obj.nombre);
        const pedidos = result.map((obj) => obj.total);

        const chartData = {
          labels: clientes,
          datasets: [
            {
              label: `Importe Total de los Pedidos`,
              data: pedidos,
              backgroundColor: "#496e81ae",
              borderColor: "#496e81e2",
              borderWidth: 1,
              fill: true,
            },
          ],
        };
        const backgroundColors = generateRandomColors(chartData.labels.length);
        const borderColors = generateRandomColors(chartData.labels.length);

        // Asignar los colores generados al chartData
        chartData.datasets[0].backgroundColor = backgroundColors;
        chartData.datasets[0].borderColor = borderColors;

        setChartData(chartData);
      }
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
      ) : error ? (
        <ErrorBD type="bd" />
      ) : !data ? (
        <ErrorBD type="null" />
      ) : (
        <>
          {type ? <Alert type={type} /> : null}

          {getUserRol() === 1 ? (
            <div className="d-flex justify-content-between mt-2">
              <h2 className="d-flex  gap-md-3 align-items-baseline col-12 mb-0 fs-3 gap-1 flex-column flex-md-row">
                <span>Pedidos</span>
                {getUserRol() === 1 ? (
                  <div className="col-md-6 ms-0 col-12">
                    <SelectComerciales type={"orders"} />
                  </div>
                ) : (
                  <span>
                    {data.nombre} {data.apellidos}
                  </span>
                )}
                {getUserRol() === 1 ? (
                  <Link
                    className="addBtn fs-5 btn me-md-5 ms-md-auto mx-auto"
                    to={"/bills/" + commercialId}
                  >
                    Ver Gastos
                  </Link>
                ) : null}
              </h2>
              {getUserRol() === 0 ? (
                <Link className="btn btn-primary addBtn" to={"/new-order"}>
                  Añadir Pedido
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="d-flex justify-content-between justify-content-center mt-2">
              <h2 className="d-flex gap-md-3 align-items-baseline mb-0 fs-3 gap-1 flex-wrap flex-column flex-md-row gap-3 text-center col-9 col-md-auto col justify-content-center">
                <span>Pedidos </span>
                {getUserRol() === 1 ? (
                  <div className="col-md-4 ms-auto ms-md-0 col-12">
                    <SelectComerciales bills={false} />
                  </div>
                ) : null}
                {getUserRol() === 1 ? (
                  <Link
                    className="addBtn fs-5 btn me-md-5 ms-md-auto mx-auto"
                    to={"/bills/" + commercialId}
                  >
                    Ver Gastos
                  </Link>
                ) : null}
              </h2>
              {getUserRol() === 0 ? (
                <Link className="btn btn-primary addBtn" to={"/new-order"}>
                  Añadir Pedido
                </Link>
              ) : null}
            </div>
          )}

          <div className="d-flex my-4 gap-3 justify-content-evenly">
            <div className="form-floating col-5">
              <input
                type="date"
                id="date1"
                className="form-control border border shadow-sm"
                placeholder="Fecha Inicio"
                max={formatDate()}
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
              ></input>
              <label htmlFor="date1" className=" ">
                Fecha Inicio
              </label>
            </div>

            <div className="form-floating col-5">
              <input
                type="date"
                id="date2"
                className="form-control border border shadow-sm"
                placeholder="Fecha Fin"
                min={date1}
                max={formatDate()}
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
              ></input>
              <label htmlFor="date1" className="">
                Fecha Fin
              </label>
            </div>
          </div>
          {!data.pedidos ? (
            <ErrorBD type="date" />
          ) : (
            <div className=" bg-secondary bg-opacity-25 p-4 my-2 mb-3 rounded graphic--large mx-auto">
              <label htmlFor="graphType" className="fw-semibold fs-4">
                Tipo de gráfico
              </label>
              <select
                className="form-select bg-secondary bg-opacity-25"
                name="graphType"
                id="graphType"
                onChange={(e) => setChartType(e.target.value)}
                value={chartType}
              >
                <option value="line">Lineal (cronológico)</option>
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
                title={"Importe Total de Pedidos"}
                className=""
              />
            </div>
          )}

          <div className="py-3 col-12 col-md-10 mx-auto">
            {!data.pedidos ? null : <OrdersTable data={dataSet} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Order;
