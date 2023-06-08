/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Graph from "../../components/shared/Graph/Graph";
import { getUserRol, getIdCommercial } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import BillsTable from "./components/BillsTable/BillsTable";
import NewBill from "./components/NewBill/NewBill";

const Bill = () => {
  const colors = [
    { categoria: "Transporte", color: "#7C8CF0" },
    { categoria: "Alojamiento", color: "#7CEFA2" },
    { categoria: "Alimentación", color: "#CFC798" },
    { categoria: "Mantenimiento", color: "#F3B99D" },
    { categoria: "Equipamiento", color: "#8AE9D1" },
    { categoria: "Sin categoría", color: "#B5B2B2" },
  ];

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
  const [dataSet, setDataSet] = useState({});
  const [dataSetBillsFecha, setDataSetBillsFecha] = useState([]);
  const [chartType, setChartType] = useState("doughnut");
  const [date1, setDate1] = useState(formatDate(false));
  const [date2, setDate2] = useState(formatDate());
  const [endpoint, setEndpoint] = useState(
    `http://localhost:3000/costrack/comerciales/gastos/${commercialId}?date1=${date1}&date2=${date2}`
  );

  const procesarDatos = () => {
    const dataSet = data.gastos.reduce(
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
  };

  const procesarDatosBillsFecha = () => {
    // Crear un objeto Map para almacenar los sumatorios de gastos por fecha
    const sumatoriosPorFecha = new Map();

    data.gastos.forEach((gasto) => {
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

  const actualizarDatos = () => {
    const newEndpoint = `http://localhost:3000/costrack/comerciales/gastos/${commercialId}?date1=${date1}&date2=${date2}`;
    setEndpoint(newEndpoint);
    fetchData(newEndpoint);
  };

  useEffect(() => {
    actualizarDatos();
  }, [date1, date2, commercialId]);

  useEffect(() => {
    if (data) {
      procesarDatos();
      procesarDatosBillsFecha();
    }
  }, [data]);

  useEffect(() => {
    if (dataSet.categorias != undefined) {
      console.log(dataSetBillsFecha);
      if (chartType === "line") {
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

        console.log(gastos, fechasOrdenadas);
        const chartData = {
          labels: fechasOrdenadas,
          datasets: [
            {
              label: `Importe Total de los Pedidos`,
              data: gastos,
              backgroundColor: "#496E81",
              borderColor: "#496E81",
              borderWidth: 1,
              fill: true,
            },
          ],
        };
        setChartData(chartData);
      } else {
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

        // Asignar los colores correspondientes a cada categoría en el chartData
        chartData.datasets[0].backgroundColor = dataSet.categorias.map(
          (categoria) => {
            const colorObj = colors.find(
              (color) => color.categoria === categoria
            );
            return colorObj ? colorObj.color : null;
          }
        );
        setChartData(chartData);
      }
    }
  }, [dataSet, chartType]);

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
              <Link className="btn btn-primary addBtn" to={"/new-bill"}>
                Añadir Gasto
              </Link>
            ) : null}
          </div>
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
          <div className=" bg-secondary bg-opacity-25 p-4">
            <label htmlFor="graphType">Tipo de gráfico</label>
            <select
              name="graphType"
              id="graphType"
              onChange={(e) => setChartType(e.target.value)}
              value={chartType}
            >
              <option value="doughnut">Cilíndrico</option>
              <option value="pie">Circular</option>
              <option value="line">Lineal (fechas)</option>
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
            <BillsTable data={data.gastos} />
          </div>
        </>
      )}
    </div>
  );
};

export default Bill;
