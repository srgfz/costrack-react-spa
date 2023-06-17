/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import Graph from "../../components/shared/Graph/Graph";
import { getUserRol, getIdCommercial } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import Alert from "../../components/shared/Alert/Alert";
import BillsTable from "./components/BillsTable/BillsTable";
import NewBill from "./components/NewBill/NewBill";
import SelectComerciales from "../../components/shared/SelectComerciales/SelectComerciales";

const Bill = () => {
  const { commercialId } = useParams();
  const { type } = useParams();

  const colors = [
    { categoria: "Transporte", color: "#7C8CF0" },
    { categoria: "Alojamiento", color: "#7CEFA2" },
    { categoria: "Alimentación", color: "#CFC798" },
    { categoria: "Mantenimiento", color: "#F3B99D" },
    { categoria: "Equipamiento", color: "#8AE9D1" },
    { categoria: "Sin categoría", color: "#B5B2B2" },
  ];

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
  const [dataSet, setDataSet] = useState({});
  const [total, setTotal] = useState(0);
  const [dataSetBillsFecha, setDataSetBillsFecha] = useState([]);
  const [chartType, setChartType] = useState("doughnut");
  const [date1, setDate1] = useState(formatDate(false));
  const [date2, setDate2] = useState(formatDate());
  const [selectedCategories, setSelectedCategories] = useState([]);

  const firstEndpoint = getIdCommercial()
    ? `http://localhost:3000/costrack/comerciales/gastos/${getIdCommercial()}?date1=${date1}&date2=${date2}`
    : `http://localhost:3000/costrack/comerciales/gastos/${commercialId}?date1=${date1}&date2=${date2}`;
  const [endpoint, setEndpoint] = useState(firstEndpoint);

  const procesarDatos = () => {
    if (!data.gastos) {
      return null;
    }

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
    if (!data.gastos) {
      return null;
    }
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
    if (getIdCommercial()) {
      const newEndpoint = `http://localhost:3000/costrack/comerciales/gastos/${getIdCommercial()}?date1=${date1}&date2=${date2}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    } else {
      const newEndpoint = `http://localhost:3000/costrack/comerciales/gastos/${commercialId}?date1=${date1}&date2=${date2}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    }
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
      const total = dataSet.sumatorios.reduce(
        (total, totalPedido) => total + totalPedido,
        0
      );
      setTotal(total);
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
        setChartData(chartData);
      } else {
        const chartData = {
          labels: dataSet.categorias,
          datasets: [
            {
              label: "Gastos Totales",
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
      console.log(dataSet);
    }
  }, [dataSet, chartType]);

  const handleCategorySelect = (e) => {
    const category = e.target.value;
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCategoryRemove = (category) => {
    const updatedCategories = selectedCategories.filter(
      (selectedCategory) => selectedCategory !== category
    );
    setSelectedCategories(updatedCategories);
  };

  const handleExportCSV = () => {
    const csvRows = [];
    let text =
      selectedCategories.length > 0
        ? `Gastos de entre el ${date1} y el ${date2} de las categorías: `
        : `Todos los gastos entre el ${date1} y el ${date2} `;
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((categoria, index) => {
        if (++index === selectedCategories.length) {
          text += ` ${categoria}.`;
        } else {
          text += ` ${categoria}, `;
        }
      });
    }
    csvRows.push(text);

    const headers = [
      "Fecha",
      "Nombre Emisor",
      "Categoría",
      "Cuantía",
      "Observaciones",
    ];

    // Agregar encabezados al archivo CSV
    csvRows.push(headers.join(";"));

    const dataToExport =
      selectedCategories.length > 0
        ? data.gastos.filter((gasto) =>
            selectedCategories.includes(gasto.categoria)
          )
        : data.gastos;

    // Recorrer los datos y agregar cada fila al archivo CSV
    dataToExport.forEach((gasto) => {
      const row = [
        gasto.fecha_gasto.split("T")[0],
        gasto.nombre_emisor,
        gasto.categoria,
        gasto.cuantia.toFixed(2),
        gasto.observaciones ? gasto.observaciones : " - - - ",
      ];
      csvRows.push(row.join(";"));
    });

    // Crear el contenido del archivo CSV con una BOM al principio
    const csvContent = "\uFEFF" + csvRows.join("\n");

    // Crear un objeto Blob con el contenido del archivo CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Crear una URL del blob del archivo CSV
    const csvUrl = URL.createObjectURL(blob);

    // Crear un enlace temporal para descargar el archivo CSV
    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = `gastos_${data.nombre}${data.apellidos.split(" ")[0]}${
      data.apellidos.split(" ")[1]
    }_${date1}-to-${date2}.csv`;

    // Simular un clic en el enlace para iniciar la descarga del archivo CSV
    link.click();
  };

  const handleExportPDF = (download = false) => {
    const doc = new jsPDF();

    const dataToExport =
      selectedCategories.length > 0
        ? data.gastos.filter((gasto) =>
            selectedCategories.includes(gasto.categoria)
          )
        : data.gastos;

    const title = `Gastos de ${data.nombre} ${data.apellidos}`;
    const titleFontSize = 16;
    const titleX = doc.internal.pageSize.getWidth() / 2; // Centrado horizontalmente
    const titleY = 15; // 15 unidades hacia abajo desde la parte superior de la página

    doc.setFontSize(titleFontSize);
    doc.text(title, titleX, titleY, { align: "center" });

    // Agregar el párrafo de información
    doc.setFontSize(12);
    doc.setTextColor(0);
    let text =
      selectedCategories.length > 0
        ? `Gastos entre el ${date1} y el ${date2} de las categorías: `
        : `Todos los gastos entre el ${date1} y el ${date2} `;
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((gasto, index) => {
        if (++index === selectedCategories.length) {
          text += ` ${gasto}.`;
        } else {
          text += ` ${gasto}, `;
        }
      });
    }

    const splitText = doc.splitTextToSize(
      text,
      doc.internal.pageSize.getWidth() - 40
    );
    doc.text(splitText, 20, 25);

    // Agregar el párrafo del total
    const infoTextHeight = doc.getTextDimensions(splitText).h;

    const total = dataToExport.reduce(
      (total, gasto) => total + gasto.cuantia,
      0
    );

    const totalText = `Gastos Totales: ${total.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
      groupingSeparator: ".",
      decimalSeparator: ",",
    })}€`;
    const totalSplitText = doc.splitTextToSize(
      totalText,
      doc.internal.pageSize.getWidth() - 40
    );
    const totalY = 25 + infoTextHeight + 10; // Ajusta el valor "10" para establecer el espaciado entre los párrafos
    doc.text(totalSplitText, 20, totalY);

    const headers = [
      ["Fecha", "Nombre Emisor", "Categoría", "Cuantía", "Observaciones"],
    ];

    const rows = dataToExport.map((gasto) => [
      gasto.fecha_gasto.split("T")[0],
      gasto.nombre_emisor,
      gasto.categoria,
      gasto.cuantia.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
        groupingSeparator: ".",
        decimalSeparator: ",",
      }) + "€",
      gasto.observaciones ? gasto.observaciones : " - - - ",
    ]);

    // Restar el ancho del margen derecho para ajustar la posición X
    const tableConfig = {
      startY: totalY + 10, // Ajusta el valor "10" para establecer el espaciado entre el párrafo del total y la tabla
      head: headers,
      body: rows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [73, 110, 129] },
    };

    doc.autoTable(tableConfig);

    // Agregar el número de página al final de cada página
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Página ${i} de ${totalPages}`,
        doc.internal.pageSize.getWidth() - 120,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    const pdfFileName = `gastos_${data.nombre}${data.apellidos.split(" ")[0]}${
      data.apellidos.split(" ")[1]
    }_${date1}-to-${date2}.pdf`;

    if (download) {
      doc.save(pdfFileName);
    } else {
      // Obtener el blob del PDF
      const pdfBlob = doc.output("blob");

      // Crear una URL del blob del PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Abrir una nueva pestaña con la URL del PDF
      window.open(pdfUrl, "_blank");
    }
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
                <span>Gastos de</span>
                {getUserRol() === 1 ? (
                  <div className="col-md-6 ms-0 col-12">
                    <SelectComerciales />
                  </div>
                ) : (
                  <span>
                    {data.nombre} {data.apellidos}
                  </span>
                )}
                {getUserRol() === 1 ? (
                  <Link
                    className="addBtn fs-5 btn me-md-5 ms-md-auto mx-auto"
                    to={"/orders/" + commercialId}
                  >
                    Ver Pedidos
                  </Link>
                ) : null}
              </h2>
              {getUserRol() === 0 ? (
                <Link className="btn btn-primary addBtn" to={"/new-bill"}>
                  Añadir Gasto
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="d-flex justify-content-between justify-content-center mt-2">
              <h2 className="d-flex gap-md-3 align-items-baseline mb-0 fs-3 gap-1 flex-wrap flex-column flex-md-row gap-3 text-center col-9 col-md-auto col justify-content-center">
                <span>Gastos </span>
                {getUserRol() === 1 ? (
                  <div className="col-md-4 ms-auto ms-md-0 col-12">
                    <SelectComerciales />
                  </div>
                ) : null}
                {getUserRol() === 1 ? (
                  <Link
                    className="addBtn fs-5 btn me-md-5 ms-md-auto mx-auto"
                    to={"/orders/" + commercialId}
                  >
                    Ver Pedidos
                  </Link>
                ) : null}
              </h2>
              {getUserRol() === 0 ? (
                <Link className="btn btn-primary addBtn" to={"/new-bill"}>
                  Añadir Gasto
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
                max={date2}
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
          {!data.gastos ? (
            <ErrorBD type="date" />
          ) : (
            <div className=" bg-secondary bg-opacity-25 p-4 shadow-sm rounded my-0 mb-3 graphic--large mx-auto">
              <label htmlFor="graphType">Tipo de gráfico</label>
              <select
                className="form-select bg-secondary bg-opacity-25 mb-2"
                name="graphType"
                id="graphType"
                onChange={(e) => setChartType(e.target.value)}
                value={chartType}
              >
                <option value="doughnut">Cilíndrico</option>
                <option value="pie">Circular</option>
                <option value="line">Lineal (cronológico)</option>
                <option value="bar">Barras</option>
                <option value="radar">Área Hexagonal</option>
                <option value="polarArea">Area Polar</option>
              </select>
              <Graph
                data={chartData}
                options={chartOptions}
                chartType={chartType}
                title={`Gastos Totales: ${total.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                  groupingSeparator: ".",
                  decimalSeparator: ",",
                })} €`}
                className=""
              />
            </div>
          )}

          <div className="py-3 col-12 col-md-10 mx-auto">
            <div className="gap-2 mb-3 d-md-flex justify-content-between">
              <div className="d-flex justify-content-between gap-3 mb-3">
                <div className="form-floating">
                  <select
                    className="form-select"
                    value=""
                    onChange={handleCategorySelect}
                  >
                    <option value="" disabled>
                      Seleccione una categoría
                    </option>
                    {colors.map((color) => (
                      <option key={color.categoria} value={color.categoria}>
                        {color.categoria}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="categorySelect">Filtrar por categoría</label>
                </div>
                <div className="d-flex flex-column gap-1 flex-md-row flex-md-wrap align-items-center">
                  {selectedCategories.map((category) => (
                    <span key={category} className="badge bg-primary me-2">
                      {category}
                      <span
                        className="ms-2 text-white cursor-pointer"
                        onClick={() => handleCategoryRemove(category)}
                      >
                        &#x2715;
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="">
                <div className="btn-group mx-auto mx-md-0">
                  <button
                    type="button"
                    className="btn btn-primary dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Exportar Datos
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className="dropdown-item d-flex justify-content-between"
                        onClick={() => handleExportPDF()}
                        disabled={
                          !(
                            (selectedCategories.length == 0 && data.gastos) ||
                            (selectedCategories.length > 0 &&
                              data.gastos.filter((gasto) =>
                                selectedCategories.includes(gasto.categoria)
                              ).length > 0)
                          )
                        }
                      >
                        Exportar PDF
                        <i className="bi bi-box-arrow-up-right"></i>
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex justify-content-between"
                        onClick={() => handleExportPDF(true)}
                        disabled={
                          !(
                            (selectedCategories.length == 0 && data.gastos) ||
                            (selectedCategories.length > 0 &&
                              data.gastos.filter((gasto) =>
                                selectedCategories.includes(gasto.categoria)
                              ).length > 0)
                          )
                        }
                      >
                        Exportar PDF
                        <i className="bi bi-box-arrow-down"></i>
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex justify-content-between"
                        onClick={handleExportCSV}
                        disabled={
                          !(
                            (selectedCategories.length == 0 && data.gastos) ||
                            (selectedCategories.length > 0 &&
                              data.gastos.filter((gasto) =>
                                selectedCategories.includes(gasto.categoria)
                              ).length > 0)
                          )
                        }
                      >
                        Exportar CSV
                        <i className="bi bi-box-arrow-down"></i>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="">
              Total para las Categorías Seleccionadas:{" "}
              {selectedCategories.length > 0
                ? data.gastos
                    .filter((gasto) =>
                      selectedCategories.includes(gasto.categoria)
                    )
                    .reduce((total, gasto) => total + gasto.cuantia, 0)
                    .toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                      groupingSeparator: ".",
                      decimalSeparator: ",",
                    })
                : data.gastos
                    .reduce((total, gasto) => total + gasto.cuantia, 0)
                    .toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                      groupingSeparator: ".",
                      decimalSeparator: ",",
                    })}{" "}
              €
            </div>

            {!data.gastos ? null : (
              <BillsTable
                data={
                  selectedCategories.length > 0
                    ? data.gastos.filter((gasto) =>
                        selectedCategories.includes(gasto.categoria)
                      )
                    : data.gastos
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bill;
