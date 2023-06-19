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
  const [total, setTotal] = useState(0);
  const [chartOptions, setChartOptions] = useState();
  const [dataSet, setDataSet] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [date1, setDate1] = useState(formatDate(false));
  const [date2, setDate2] = useState(formatDate());
  const [selectedClientes, setSelectedClientes] = useState([]);

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
    const clientes = [];
    dataSet.forEach((pedido) => {
      if (!clientes.includes(pedido.cliente)) {
        clientes.push(pedido.cliente);
      }
    });
    setClientes(clientes);
    console.log(clientes);
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
      console.log(dataSet);
      if (chartType === "line") {
        // Saco las fechas y los totales del array resultante
        const totals = dataSet.map((order) => parseFloat(order.total));
        const total = totals.reduce(
          (total, totalPedido) => total + totalPedido,
          0
        );

        setTotal(total);

        //Obtener fechas distintas
        const fechasDistintas = [
          ...new Set(dataSet.map((objeto) => objeto.fecha)),
        ];

        //Ordenar fechas de más antiguo a más reciente
        fechasDistintas.sort(
          (fecha1, fecha2) => new Date(fecha1) - new Date(fecha2)
        );

        //Calcular acumulado por fecha
        const acumuladoPorFecha = fechasDistintas.reduce(
          (acumulador, fecha) => {
            const totalFecha = dataSet
              .filter((order) => order.fecha === fecha)
              .reduce((total, order) => total + parseFloat(order.total), 0);

            acumulador[fecha] = totalFecha;
            return acumulador;
          },
          {}
        );

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
        setClientes(clientes);
        console.log(clientes);
        const pedidos = result.map((obj) => obj.total);
        const total = pedidos.reduce(
          (total, totalPedido) => total + totalPedido,
          0
        );
        setTotal(total);
        console.log(pedidos);
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

  const handleExportCSV = () => {
    const csvRows = [];
    let text =
      selectedClientes.length > 0
        ? `Pedidos entre el ${date1} y el ${date2} de los clientes: `
        : `Todos los pedidos entre el ${date1} y el ${date2} `;
    if (selectedClientes.length > 0) {
      selectedClientes.forEach((cliente, index) => {
        if (++index === selectedClientes.length) {
          text += ` ${cliente}.`;
        } else {
          text += ` ${cliente}, `;
        }
      });
    }
    const headers = [
      "Fecha",
      "Cliente",
      "Dirección",
      "Total_pedido",
      "Comentarios",
    ];

    // Agregar encabezados al archivo CSV
    csvRows.push(text);
    csvRows.push(headers.join(";"));
    const dataToExport =
      selectedClientes.length > 0
        ? dataSet.filter((pedido) => selectedClientes.includes(pedido.cliente))
        : dataSet;

    // Recorrer los datos y agregar cada fila al archivo CSV
    dataToExport.forEach((pedido) => {
      const row = [
        pedido.fecha.split("T")[0],
        pedido.cliente,
        pedido.direccion,
        pedido.total.toFixed(2),
        pedido.comentarios ? pedido.comentarios : " - - - ",
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
    link.download = `pedidos_${data.nombre}${data.apellidos.split(" ")[0]}${
      data.apellidos.split(" ")[1]
    }_${date1}-to-${date2}.csv`;

    // Simular un clic en el enlace para iniciar la descarga del archivo CSV
    link.click();
  };

  const handleExportPDF = (download = false) => {
    const doc = new jsPDF();

    const dataToExport =
      selectedClientes.length > 0
        ? dataSet.filter((pedido) => selectedClientes.includes(pedido.cliente))
        : dataSet;

    const title = `Pedidos de ${data.nombre} ${data.apellidos}`;
    const titleFontSize = 16;
    const titleX = doc.internal.pageSize.getWidth() / 2; // Centrado horizontalmente
    const titleY = 15; // 15 unidades hacia abajo desde la parte superior de la página

    doc.setFontSize(titleFontSize);
    doc.text(title, titleX, titleY, { align: "center" });

    // Agregar el párrafo de información
    doc.setFontSize(12);
    doc.setTextColor(0);
    let text =
      selectedClientes.length > 0
        ? `Pedidos entre el ${date1} y el ${date2} de los clientes: `
        : `Todos los pedidos entre el ${date1} y el ${date2} `;
    if (selectedClientes.length > 0) {
      selectedClientes.forEach((cliente, index) => {
        if (++index === selectedClientes.length) {
          text += ` ${cliente}.`;
        } else {
          text += ` ${cliente}, `;
        }
      });
    }

    const splitText = doc.splitTextToSize(
      text,
      doc.internal.pageSize.getWidth() - 40
    );
    doc.text(splitText, 20, 25);

    // Agregar el párrafo del total debajo del párrafo de información
    const infoTextHeight = doc.getTextDimensions(splitText).h;

    const total = dataToExport.reduce((total, gasto) => total + gasto.total, 0);
    const totalText = `Importe total de pedidos: ${total.toLocaleString(
      "es-ES",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
        groupingSeparator: ".",
        decimalSeparator: ",",
      }
    )}€`;
    const totalSplitText = doc.splitTextToSize(
      totalText,
      doc.internal.pageSize.getWidth() - 40
    );
    const totalY = 25 + infoTextHeight + 10; // Ajusta el valor "10" para establecer el espaciado entre los párrafos
    doc.text(totalSplitText, 20, totalY);

    const headers = [
      ["Fecha", "Cliente", "Dirección", "Total Pedido", "Comentarios"],
    ];

    const rows = dataToExport.map((pedido) => [
      pedido.fecha.split("T")[0],
      pedido.cliente,
      pedido.direccion,
      pedido.total.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
        groupingSeparator: ".",
        decimalSeparator: ",",
      }) + "€",
      pedido.comentarios ? pedido.comentarios : " - - - ",
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

    const pdfFileName = `pedidos_${data.nombre}${data.apellidos.split(" ")[0]}${
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

  const handleClientesSelect = (e) => {
    const id = e.target.value;
    if (!selectedClientes.includes(id)) {
      setSelectedClientes([...selectedClientes, id]);
    }
  };

  const handleClientesRemove = (id) => {
    const updatedClientes = selectedClientes.filter(
      (selectedId) => selectedId !== id
    );
    setSelectedClientes(updatedClientes);
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
              </select>
              <Graph
                data={chartData}
                options={chartOptions}
                chartType={chartType}
                title={`Importe Total de Pedidos ${total.toLocaleString(
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
          )}
          {!data.pedidos ? null : (
            <div className="">
              <div className="py-3 col-12 col-md-10 mx-auto">
                <div className="gap-2 mb-3 d-md-flex justify-content-between">
                  <div className="d-flex justify-content-between gap-3 flex-column flex-md-row">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        value=""
                        onChange={handleClientesSelect}
                      >
                        <option value="" disabled>
                          Seleccione un cliente
                        </option>
                        {clientes.map((cliente) => (
                          <option key={cliente} value={cliente}>
                            {cliente}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="categorySelect">Filtrar pedidos</label>
                    </div>
                    <div className="d-flex gap-1 flex-md-row flex-md-wrap flex-wrap align-items-center">
                      {selectedClientes.map((category) => (
                        <span
                          key={category}
                          className="badge rounded-pill p-2 me-2 pill"
                        >
                          {category}
                          <span
                            className="ms-2 cursor-pointer"
                            onClick={() => handleClientesRemove(category)}
                          >
                            <i className="bi bi-x-lg"></i>
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="">
                    <div className="btn-group mx-auto mx-md-0">
                      <button
                        type="button"
                        className="btn btn-primary dropdown-toggle btnDropdown"
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
                                (selectedClientes.length == 0 && dataSet) ||
                                (selectedClientes.length > 0 &&
                                  dataSet.filter((pedido) =>
                                    selectedClientes.includes(pedido.cliente)
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
                                (selectedClientes.length == 0 && dataSet) ||
                                (selectedClientes.length > 0 &&
                                  dataSet.filter((pedido) =>
                                    selectedClientes.includes(pedido.cliente)
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
                                (selectedClientes.length == 0 && dataSet) ||
                                (selectedClientes.length > 0 &&
                                  dataSet.filter((pedido) =>
                                    selectedClientes.includes(pedido.cliente)
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
              </div>
              <h4 className="col-12 col-md-10 mx-auto m-0">
                Importe Total:{" "}
                {selectedClientes.length > 0
                  ? dataSet
                      .filter((pedido) =>
                        selectedClientes.includes(pedido.cliente)
                      )
                      .reduce((total, pedido) => total + pedido.total, 0)
                      .toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                        groupingSeparator: ".",
                        decimalSeparator: ",",
                      })
                  : dataSet
                      .reduce((total, pedido) => total + pedido.total, 0)
                      .toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                        groupingSeparator: ".",
                        decimalSeparator: ",",
                      })}{" "}
                €
              </h4>
              <div className="py-3 col-12 col-md-10 mx-auto">
                {!data.pedidos ? null : (
                  <OrdersTable
                    data={
                      selectedClientes.length > 0
                        ? dataSet.filter((pedido) =>
                            selectedClientes.includes(pedido.cliente)
                          )
                        : dataSet
                    }
                    // data={dataSet}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Order;
