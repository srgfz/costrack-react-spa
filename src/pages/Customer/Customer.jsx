/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { getIdEmpresa, getUserRol } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import CustomerTable from "./components/CustomerTable";
import InputSearch from "../../components/InputSearch/InputSearch";
import Alert from "../../components/shared/Alert/Alert";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Customer = () => {
  const location = useLocation();

  const { q } = useParams();
  const { type } = useParams();

  const empresaId = getIdEmpresa();

  const { isLoading, data, error, fetchData } = useFetch();
  const [endpoint, setEndpoint] = useState(
    `http://localhost:3000/costrack/empresas/clientes/${empresaId}`
  );

  const actualizarDatos = () => {
    if (q) {
      const newEndpoint = `http://localhost:3000/costrack/empresas/clientes/${empresaId}?q=${q}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    } else {
      const newEndpoint = `http://localhost:3000/costrack/empresas/clientes/${empresaId}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    }
  };

  useEffect(() => {
    actualizarDatos();
  }, [empresaId, q]);

  const handleExportPDF = (download = false) => {
    const doc = new jsPDF();

    const dataToExport = data.clientes;
    console.log(dataToExport);

    const title = `Clientes de ${data.nombre}`;
    const titleFontSize = 16;
    const titleX = doc.internal.pageSize.getWidth() / 2; // Centrado horizontalmente
    const titleY = 15; // 15 unidades hacia abajo desde la parte superior de la página

    doc.setFontSize(titleFontSize);
    doc.text(title, titleX, titleY, { align: "center" });

    // Agregar el párrafo de información
    doc.setFontSize(12);
    doc.setTextColor(0);
    let text = q
      ? `Clientes relacionados con "${q}"`
      : `Todos los clientes de ${data.nombre}`;

    const splitText = doc.splitTextToSize(
      text,
      doc.internal.pageSize.getWidth() - 40
    );
    doc.text(splitText, 20, 25);

    const headers = [
      ["Nombre", "Nombre Contacto", "Email", "Teléfono", "Dirección"],
    ];

    const rows = dataToExport.map((cliente) => [
      cliente.nombre,
      cliente.nombre_contacto,
      cliente.email,
      cliente.telefono,
      cliente.direccion,
    ]);

    // Obtener la altura del texto del párrafo de información
    const infoTextHeight = doc.getTextDimensions(splitText).h;

    // Restar el ancho del margen derecho para ajustar la posición X
    const tableConfig = {
      startY: 25 + infoTextHeight + 10, // Ajusta el valor "10" para establecer el espaciado entre el párrafo de información y la tabla
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

    const pdfFileName = `clientes_${data.nombre}.pdf`;

    if (download) {
      doc.save(pdfFileName);
    } else {
      // Obtener el blob del PDF
      const pdfBlob = doc.output("blob");

      // Crear una URL del blob del PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);
      // Abrir una nueva pestaña con la URL del PDF
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
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
        <div>
          {type ? <Alert type={type} /> : null}

          <div className="d-flex justify-content-between mt-3">
            {q ? (
              <h2>Clientes relacionados con "{q}"</h2>
            ) : (
              <h2 className="d-flex flex-wrap">
                Clientes de <span className="ms-1"> {data.nombre}</span>
              </h2>
            )}
            <Link className="btn btn-primary addBtn" to={"/new-customer"}>
              Añadir Cliente
            </Link>
          </div>
          {getUserRol === 1 ? (
            <div className="py-4  mx-auto">
              <InputSearch type={"clientes"} />
            </div>
          ) : location.pathname.includes("new-order") ? (
            <div className="py-4  mx-auto">
              <InputSearch type={"clientes"} newOrder={true} />
            </div>
          ) : (
            <div className="py-4  mx-auto">
              <InputSearch type={"clientes"} />
            </div>
          )}
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
                    disabled={!data.clientes}
                  >
                    Exportar PDF
                    <i className="bi bi-box-arrow-up-right"></i>
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex justify-content-between"
                    onClick={() => handleExportPDF(true)}
                    disabled={!data.clientes}
                  >
                    Exportar PDF
                    <i className="bi bi-box-arrow-down"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="py-3 mx-3">
            <CustomerTable data={data.clientes} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
