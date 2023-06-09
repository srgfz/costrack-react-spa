/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./Home.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Graph from "../../components/shared/Graph/Graph";
import { getUserRol, getIdCommercial, getIdEmpresa } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import SelectComerciales from "../../components/shared/SelectComerciales/SelectComerciales";

const Home = () => {
  const navigate = useNavigate();
  const { commercialId } = useParams();

  const colors = [
    { categoria: "Transporte", color: "#7C8CF0" },
    { categoria: "Alojamiento", color: "#7CEFA2" },
    { categoria: "Alimentación", color: "#CFC798" },
    { categoria: "Mantenimiento", color: "#F3B99D" },
    { categoria: "Equipamiento", color: "#8AE9D1" },
    { categoria: "Sin categoría", color: "#B5B2B2" },
  ];
  const userId = getUserRol() === 0 ? getIdCommercial() : commercialId;

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

  const {
    isLoading: isLoadingOrders,
    data: dataOrders,
    error: errorOrders,
    fetchData: fetchDataOrders,
  } = useFetch();
  const {
    isLoading: isLoadingBills,
    data: dataBills,
    error: errorBills,
    fetchData: fetchDataBills,
  } = useFetch();
  const [chartData1, setChartData1] = useState();
  const [chartData2, setChartData2] = useState();
  const [chartData3, setChartData3] = useState();
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [dataSetOrders, setDataSetOrders] = useState([]);
  const [dataSetBills, setDataSetBills] = useState([]);
  const [dataSetBillsFecha, setDataSetBillsFecha] = useState([]);
  const [chartTypeSmallGraphs, setChartTypeSmallGraphs] = useState("doughnut");
  const [date1, setDate1] = useState(formatDate(false));
  const [date2, setDate2] = useState(formatDate());
  const [endpointOrders, setEndpointOrders] = useState(
    `http://localhost:3000/costrack/comerciales/pedidos/${userId}?date1=${date1}&date2=${date2}`
  );
  const [endpointBills, setEndpointBills] = useState(
    `http://localhost:3000/costrack/comerciales/gastos/${userId}?date1=${date1}&date2=${date2}`
  );

  const procesarDatosBills = () => {
    if (!dataBills.gastos) {
      return null;
    }
    const dataSet = dataBills.gastos.reduce(
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
    setDataSetBills(dataSet);
  };

  const procesarDatosBillsFecha = () => {
    if (!dataBills.gastos) {
      return null;
    }
    // Crear un objeto Map para almacenar los sumatorios de gastos por fecha
    const sumatoriosPorFecha = new Map();

    dataBills.gastos.forEach((gasto) => {
      const fecha = gasto.fecha_gasto.substring(0, 10); // Obtener solo la fecha (YYYY-MM-DD)
      const cuantia = gasto.cuantia;

      if (sumatoriosPorFecha.has(fecha)) {
        // Si la fecha ya existe en el Map, sumar la cuantía al sumatorio existente
        const sumatorioActual = sumatoriosPorFecha.get(fecha);
        sumatoriosPorFecha.set(fecha, sumatorioActual + cuantia);
      } else {
        // Si la fecha no existe en el Map, crear una nueva entrada con la cuantía actual
        sumatoriosPorFecha.set(fecha, cuantia);
      }
    });

    // Obtener el array con la fecha de los gastos y el sumatorio de gastos para ese día
    const arraySumatorios = Array.from(sumatoriosPorFecha.entries());
    setDataSetBillsFecha(arraySumatorios);
  };

  const procesarDatosOrders = () => {
    if (!dataOrders.pedidos) {
      return null;
    }
    const dataSet = dataOrders.pedidos.map((order) => {
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
        clienteId: order.clienteId,
      };
    });
    setDataSetOrders(dataSet);
  };

  const actualizarDatos = () => {
    const newEndpointOrders = `http://localhost:3000/costrack/comerciales/pedidos/${userId}?date1=${date1}&date2=${date2}`;
    setEndpointOrders(newEndpointOrders);
    fetchDataOrders(newEndpointOrders);
    const newEndpointBills = `http://localhost:3000/costrack/comerciales/gastos/${userId}?date1=${date1}&date2=${date2}`;
    setEndpointBills(newEndpointBills);
    fetchDataBills(newEndpointBills);
  };

  useEffect(() => {
    actualizarDatos();
  }, [date1, date2, userId]);

  useEffect(() => {
    if (dataOrders) {
      procesarDatosOrders();
    }
    if (dataBills) {
      procesarDatosBills();
      procesarDatosBillsFecha();
    }
  }, [dataOrders, dataBills]);

  useEffect(() => {
    if (dataSetBills.categorias && dataSetOrders) {
      // Obtener todas las fechas sin repetición
      const fechasSet = new Set();
      dataSetBillsFecha.forEach(([fecha]) => fechasSet.add(fecha));
      dataSetOrders.forEach(({ fecha }) => fechasSet.add(fecha));

      // Ordenar las fechas de forma ascendente
      const fechasOrdenadas = Array.from(fechasSet).sort();

      // Crear arrays para las cuantías
      const gastos = [];
      const pedidos = [];

      // Calcular acumulado por fecha
      const acumuladoPorFecha = fechasOrdenadas.reduce((acumulador, fecha) => {
        const totalFecha = dataSetOrders
          .filter((order) => order.fecha === fecha)
          .reduce((total, order) => total + parseFloat(order.total), 0);

        acumulador[fecha] = totalFecha;
        return acumulador;
      }, {});

      // Recorrer las fechas ordenadas y obtener las cuantías correspondientes
      fechasOrdenadas.forEach((fecha) => {
        // Obtener cuantía de la primera estructura
        const gasto = dataSetBillsFecha.find(([f]) => f === fecha)?.[1] || 0;
        gastos.push(gasto);

        // Obtener cuantía de la segunda estructura
        const pedido =
          dataSetOrders.find(({ fecha: f }) => f === fecha)?.total || 0;
        pedidos.push(pedido);
      });

      const totalGastos = gastos.reduce(
        (total, totalGastos) => total + totalGastos,
        0
      );
      setTotalGastos(totalGastos);

      const totalPedidos = pedidos.reduce(
        (total, totalPedidos) => total + parseFloat(totalPedidos),
        0
      );
      setTotalPedidos(totalPedidos);

      const arrayOrders = fechasOrdenadas.map(
        (fecha) => acumuladoPorFecha[fecha] || 0
      );

      const chartData = {
        labels: fechasOrdenadas,
        datasets: [
          {
            label: "Gastos",
            data: gastos,
            backgroundColor: "#ffffc355",
            borderColor: "#ffffc3e0",
            fill: true,
            spanGaps: true,
            pointRadius: 1,
            borderCapStyle: "round",
          },
          {
            label: "Importe Pedidos",
            data: arrayOrders,
            backgroundColor: "#496e81ae",
            borderColor: "#496e81e2",
            fill: true,
            pointRadius: 1,
            borderCapStyle: "round",
            spanGaps: true,
          },
        ],
      };

      setChartData1(chartData);
    }

    if (dataSetOrders) {
      if (chartTypeSmallGraphs === "line") {
        // Saco las fechas y los totales del array resultante
        const totals = dataSetOrders.map((order) => parseFloat(order.total));
        const labels = dataSetOrders.map((order) => order.fecha);
        const totalPedidos = totals.reduce(
          (total, totalPedidos) => total + parseFloat(totalPedidos),
          0
        );
        //Obtener fechas distintas
        const fechasDistintas = [
          ...new Set(dataSetOrders.map((objeto) => objeto.fecha)),
        ];

        //Ordenar fechas de más antiguo a más reciente
        fechasDistintas.sort(
          (fecha1, fecha2) => new Date(fecha1) - new Date(fecha2)
        );

        //Calcular acumulado por fecha
        const acumuladoPorFecha = fechasDistintas.reduce(
          (acumulador, fecha) => {
            const totalFecha = dataSetOrders
              .filter((order) => order.fecha === fecha)
              .reduce((total, order) => total + parseFloat(order.total), 0);

            acumulador[fecha] = totalFecha;
            return acumulador;
          },
          {}
        );
        setTotalPedidos(totalPedidos);
        setTotalPedidos(totalPedidos);
        const chartData = {
          labels: fechasDistintas,
          datasets: [
            {
              label: `Importe Total de los Pedidos`,
              data: acumuladoPorFecha,
              backgroundColor: "#496e81ae",
              borderColor: "#496e81e2",
              borderWidth: 1,
              fill: true,
            },
          ],
        };

        setChartData2(chartData);
      } else {
        // Crear un objeto Map para almacenar los valores únicos y sumatorios
        const uniqueMap = new Map();
        // Recorrer el array de JSONs
        dataSetOrders.forEach((order) => {
          const id = order.clienteId;
          const total = parseFloat(order.total);
          const nombre = order.cliente;

          // Verificar si el ID ya existe en el Map
          if (uniqueMap.has(id)) {
            // Si el ID existe, sumar el valor actual al sumatorio existente
            const sum = parseFloat(uniqueMap.get(id).sum) + total;
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
        const totalPedidos = pedidos.reduce(
          (total, totalPedidos) => total + parseFloat(totalPedidos),
          0
        );
        setTotalPedidos(totalPedidos);
        setTotalPedidos(totalPedidos);
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

        setChartData2(chartData);
      }
    }
    if (dataSetBills.categorias) {
      if (chartTypeSmallGraphs === "line") {
        // Obtener todas las fechas sin repetición
        const fechasSet = new Set();
        dataSetBillsFecha.forEach(([fecha]) => fechasSet.add(fecha));
        // Ordenar las fechas de forma ascendente
        const fechasOrdenadas = Array.from(fechasSet).sort();
        const gastos = [];
        // Recorrer las fechas ordenadas y obtener las cuantías correspondientes
        fechasOrdenadas.forEach((fecha) => {
          // Obtener cuantía de la primera estructura (array de arrays)
          const gasto = dataSetBillsFecha.find(([f]) => f === fecha)?.[1] || 0;
          gastos.push(gasto);
        });

        const totalGastos = gastos.reduce(
          (total, totalGastos) => total + totalGastos,
          0
        );
        setTotalGastos(totalGastos);

        const chartData = {
          labels: fechasOrdenadas,
          datasets: [
            {
              label: `Gastos Totales`,
              data: gastos,
              backgroundColor: "#496e81ae",
              borderColor: "#496e81e2",
              borderWidth: 1,
              fill: true,
            },
          ],
        };
        setChartData3(chartData);
      } else {
        const totalGastos = dataSetBills.sumatorios.reduce(
          (total, totalGastos) => total + totalGastos,
          0
        );
        setTotalGastos(totalGastos);
        const chartData = {
          labels: dataSetBills.categorias,
          datasets: [
            {
              label: "Gastos Totales",
              data: dataSetBills.sumatorios,
              backgroundColor: [],
              borderColor: [],
              borderWidth: 1,
            },
          ],
        };

        // Asignar los colores correspondientes a cada categoría en el chartData
        chartData.datasets[0].backgroundColor = dataSetBills.categorias.map(
          (categoria) => {
            const colorObj = colors.find(
              (color) => color.categoria === categoria
            );
            return colorObj ? colorObj.color : null;
          }
        );
        setChartData3(chartData);
      }
    }
  }, [dataSetBills, dataSetOrders]);

  useEffect(() => {
    if (dataSetOrders) {
      if (chartTypeSmallGraphs === "line") {
        // Saco las fechas y los totales del array resultante
        const totals = dataSetOrders.map((order) => parseFloat(order.total));
        const labels = dataSetOrders.map((order) => order.fecha);
        const totalGastos = totals.reduce(
          (total, totalGastos) => total + totalGastos,
          0
        );

        //Obtener fechas distintas
        const fechasDistintas = [
          ...new Set(dataSetOrders.map((objeto) => objeto.fecha)),
        ];

        //Ordenar fechas de más antiguo a más reciente
        fechasDistintas.sort(
          (fecha1, fecha2) => new Date(fecha1) - new Date(fecha2)
        );

        //Calcular acumulado por fecha
        const acumuladoPorFecha = fechasDistintas.reduce(
          (acumulador, fecha) => {
            const totalFecha = dataSetOrders
              .filter((order) => order.fecha === fecha)
              .reduce((total, order) => total + parseFloat(order.total), 0);

            acumulador[fecha] = totalFecha;
            return acumulador;
          },
          {}
        );

        setTotalGastos(totalGastos);
        const chartData = {
          labels: fechasDistintas,
          datasets: [
            {
              label: `Importe Total de los Pedidos`,
              data: acumuladoPorFecha,
              backgroundColor: "#496e81ae",
              borderColor: "#496e81e2",
              borderWidth: 1,
              fill: true,
            },
          ],
        };

        setChartData2(chartData);
      } else {
        // Crear un objeto Map para almacenar los valores únicos y sumatorios
        const uniqueMap = new Map();

        // Recorrer el array de JSONs
        dataSetOrders.forEach((order) => {
          const id = order.clienteId;
          const total = parseFloat(order.total);
          const nombre = order.cliente;

          // Verificar si el ID ya existe en el Map
          if (uniqueMap.has(id)) {
            // Si el ID existe, sumar el valor actual al sumatorio existente
            const sum = parseFloat(uniqueMap.get(id).sum) + total;
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
        const totalPedidos = pedidos.reduce(
          (total, totalPedidos) => total + parseFloat(totalPedidos),
          0
        );
        setTotalPedidos(totalPedidos);
        setTotalPedidos(totalPedidos);
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

        setChartData2(chartData);
      }
    }
    if (dataSetBills.categorias) {
      if (chartTypeSmallGraphs === "line") {
        // Obtener todas las fechas sin repetición
        const fechasSet = new Set();
        dataSetBillsFecha.forEach(([fecha]) => fechasSet.add(fecha));
        // Ordenar las fechas de forma ascendente
        const fechasOrdenadas = Array.from(fechasSet).sort();
        const gastos = [];
        // Recorrer las fechas ordenadas y obtener las cuantías correspondientes
        fechasOrdenadas.forEach((fecha) => {
          // Obtener cuantía de la primera estructura (array de arrays)
          const gasto = dataSetBillsFecha.find(([f]) => f === fecha)?.[1] || 0;
          gastos.push(gasto);
        });
        const totalGastos = gastos.reduce(
          (total, totalGastos) => total + totalGastos,
          0
        );
        setTotalGastos(totalGastos);

        const chartData = {
          labels: fechasOrdenadas,
          datasets: [
            {
              label: `Gastos Totales`,
              data: gastos,
              backgroundColor: "#496e81ae",
              borderColor: "#496e81e2",
              borderWidth: 1,
              fill: true,
            },
          ],
        };
        setChartData3(chartData);
      } else {
        const totalGastos = dataSetBills.sumatorios.reduce(
          (total, totalGastos) => total + totalGastos,
          0
        );
        setTotalGastos(totalGastos);
        const chartData = {
          labels: dataSetBills.categorias,
          datasets: [
            {
              label: "Gastos Totales",
              data: dataSetBills.sumatorios,
              backgroundColor: [],
              borderColor: [],
              borderWidth: 1,
            },
          ],
        };

        // Asignar los colores correspondientes a cada categoría en el chartData
        chartData.datasets[0].backgroundColor = dataSetBills.categorias.map(
          (categoria) => {
            const colorObj = colors.find(
              (color) => color.categoria === categoria
            );
            return colorObj ? colorObj.color : null;
          }
        );
        setChartData3(chartData);
      }
    }
  }, [chartTypeSmallGraphs]);

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
      {isLoadingOrders || isLoadingBills ? (
        <Spinner />
      ) : errorOrders || errorBills ? (
        <ErrorBD type="bd" />
      ) : !dataOrders || !dataBills ? (
        <ErrorBD type="null" />
      ) : (
        <>
          <h2 className="d-flex  gap-md-3 align-items-baseline col-12 mb-0 fs-3 gap-1 flex-column flex-md-row">
            <span>Panel de</span>
            {getUserRol() === 1 ? (
              <div className="col-md-6 ms-0 col-12">
                <SelectComerciales type={"home"} />
              </div>
            ) : (
              <span className="ms-1">
                {" " + dataOrders.nombre} {dataOrders.apellidos}
              </span>
            )}
          </h2>
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
          {!dataBills.gastos || !dataOrders.pedidos ? (
            <ErrorBD type="date" />
          ) : (
            <div className="">
              {dataSetOrders && dataSetBills ? (
                <div className="col-12 shadow-sm bg-secondary bg-opacity-25 p-4 my-4 mx-auto graphic graphic--large">
                  <Graph
                    data={chartData1}
                    options={null}
                    chartType={"line"}
                    title={`Gastos Totales: ${totalGastos.toLocaleString(
                      "es-ES",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                        groupingSeparator: ".",
                        decimalSeparator: ",",
                      }
                    )} € | Ingresos Totales: ${totalPedidos.toLocaleString(
                      "es-ES",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                        groupingSeparator: ".",
                        decimalSeparator: ",",
                      }
                    )} €`}
                    className=""
                  />
                </div>
              ) : null}
              <>
                <label htmlFor="graphType" className="fw-semibold fs-3">
                  Tipo de Gráfico:{" "}
                </label>
                <select
                  className="form-select form-select mb-3 bg-secondary bg-opacity-25"
                  aria-label=".form-select example"
                  id="graphType"
                  onChange={(e) => setChartTypeSmallGraphs(e.target.value)}
                  value={chartTypeSmallGraphs}
                >
                  <option value="doughnut">Cilíndrico</option>
                  <option value="pie">Circular</option>
                  <option value="line">Lineal (cronológico)</option>
                  <option value="bar">Barras</option>
                </select>
                <div className="d-flex flex-column flex-md-row justify-content-around">
                  {dataSetOrders ? (
                    <div className="col-12 col-md-5 shado-sm bg-secondary bg-opacity-25 gap-2 py-4 rounded px-1 mx-auto graphic--small">
                      <Graph
                        data={chartData2}
                        options={null}
                        chartType={chartTypeSmallGraphs}
                        title={`Importe Total de Pedidos: ${totalPedidos.toLocaleString(
                          "es-ES",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                            groupingSeparator: ".",
                            decimalSeparator: ",",
                          }
                        )} €`}
                        className=""
                      />
                    </div>
                  ) : null}
                  {dataSetBills ? (
                    <div className="col-12 col-md-5 shadow-sm bg-secondary bg-opacity-25 py-2 px-1 rounded mx-auto graphic--small">
                      <Graph
                        data={chartData3}
                        options={null}
                        chartType={chartTypeSmallGraphs}
                        title={`Gastos Totales ${totalGastos.toLocaleString(
                          "es-ES",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                            groupingSeparator: ".",
                            decimalSeparator: ",",
                          }
                        )} €`}
                        className=""
                      />
                    </div>
                  ) : null}
                </div>
              </>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
