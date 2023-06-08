/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Graph from "../../components/shared/Graph/Graph";
import { getUserRol, getIdCommercial, getIdEmpresa } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";

const Home = () => {
  const colors = [
    { categoria: "Transporte", color: "#7C8CF0" },
    { categoria: "Alojamiento", color: "#7CEFA2" },
    { categoria: "Alimentación", color: "#CFC798" },
    { categoria: "Mantenimiento", color: "#F3B99D" },
    { categoria: "Equipamiento", color: "#8AE9D1" },
    { categoria: "Sin categoría", color: "#B5B2B2" },
  ];
  const userId = getUserRol() === 0 ? getIdCommercial() : getIdEmpresa();

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
    fetchData: fetchDataOrders,
  } = useFetch();
  const {
    isLoading: isLoadingBills,
    data: dataBills,
    fetchData: fetchDataBills,
  } = useFetch();
  const [chartData1, setChartData1] = useState();
  const [chartData2, setChartData2] = useState();
  const [chartData3, setChartData3] = useState();
  const [dataSetOrders, setDataSetOrders] = useState([]);
  const [dataSetBills, setDataSetBills] = useState([]);
  const [dataSetBillsFecha, setDataSetBillsFecha] = useState([]);
  const [chartTypeOrders, setChartTypeOrders] = useState("bar");
  const [chartTypeBills, setChartTypeBills] = useState("bar");
  const [date1, setDate1] = useState(formatDate(false));
  const [date2, setDate2] = useState(formatDate());
  const [endpointOrders, setEndpointOrders] = useState(
    `http://localhost:3000/costrack/comerciales/pedidos/${userId}?date1=${date1}&date2=${date2}`
  );
  const [endpointBills, setEndpointBills] = useState(
    `http://localhost:3000/costrack/comerciales/gastos/${userId}?date1=${date1}&date2=${date2}`
  );

  const procesarDatosBills = () => {
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
    console.log(dataSetBillsFecha);
    console.log(dataSetOrders);

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

      // Recorrer las fechas ordenadas y obtener las cuantías correspondientes
      fechasOrdenadas.forEach((fecha) => {
        // Obtener cuantía de la primera estructura (array de arrays)
        const gasto = dataSetBillsFecha.find(([f]) => f === fecha)?.[1] || 0;
        gastos.push(gasto);

        // Obtener cuantía de la segunda estructura (array de objetos)
        const pedido =
          dataSetOrders.find(({ fecha: f }) => f === fecha)?.total || 0;
        pedidos.push(pedido);
      });

      console.log(fechasOrdenadas); // Fechas ordenadas sin repetición
      console.log(gastos); // Cuantías de la primera estructura
      console.log(pedidos); // Cuantías de la segunda estructura

      const chartData = {
        labels: fechasOrdenadas,
        datasets: [
          {
            label: "Gastos",
            data: gastos,
            backgroundColor: "red",
            borderColor: "red",
            fill: true,
          },
          {
            label: "Importe Pedidos",
            data: pedidos,
            backgroundColor: "rgba(0, 123, 255, 0.5)",
            borderColor: "rgba(0, 123, 255, 1)",
            fill: true,
          },
        ],
      };

      setChartData1(chartData);
    }
    if (dataSetOrders) {
      // Saco las fechas y los totales del array resultante
      const totals = dataSetOrders.map((order) => parseFloat(order.total));
      const labels =
        chartTypeOrders != "line"
          ? dataSetOrders.map((order) => order.cliente)
          : dataSetOrders.map((order) => order.fecha);

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
      if (chartTypeOrders !== "line") {
        const backgroundColors = generateRandomColors(chartData.labels.length);
        const borderColors = generateRandomColors(chartData.labels.length);

        // Asignar los colores generados al chartData
        chartData.datasets[0].backgroundColor = backgroundColors;
        chartData.datasets[0].borderColor = borderColors;
      }

      setChartData2(chartData);
    }
    if (dataSetBills.categorias) {
      const chartData = {
        labels: dataSetBills.categorias,
        datasets: [
          {
            label: "Gráfico de Gastos",
            data: dataSetBills.sumatorios,
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      };

      // Asignar los colores correspondientes a cada categoría en el chartData1
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
  }, [dataSetBills, dataSetOrders]);

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
      ) : !dataOrders || !dataBills ? (
        <ErrorBD />
      ) : (
        <>
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
          {dataSetOrders && dataSetBills ? (
            <div className="col-12 border">
              <Graph
                data={chartData1}
                options={null}
                chartType={"line"}
                className=""
              />
            </div>
          ) : null}
          <div className="">
            {dataSetOrders ? (
              <div className="col-5 border">
                <Graph
                  data={chartData2}
                  options={null}
                  chartType={chartTypeOrders}
                  className=""
                />
              </div>
            ) : null}
            {dataSetBills ? (
              <div className="col-5 border">
                <Graph
                  data={chartData3}
                  options={null}
                  chartType={chartTypeBills}
                  className=""
                />
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
