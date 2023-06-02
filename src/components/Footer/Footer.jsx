import "./Footer.css";

function Footer() {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top position-absolute bottom-0 w-100 px-3">
      <div className="col-md-4 d-flex align-items-center">
        <a
          href="/"
          className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
        >
          logo
        </a>
        <div className="d-flex flex-column">
          <span className="mb-3 mb-md-0 text-muted">
            DAW - IES Ribera del Tajo
          </span>
          <span className="mb-3 mb-md-0 text-muted">
            Sergio Fernández Nevado 2023
          </span>
        </div>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3">
          <a
            className="text-muted"
            href="https://github.com/srgfz"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-github"></i>
          </a>
        </li>
        <li className="ms-3">
          <a
            className="text-muted"
            href="https://www.linkedin.com/in/srgfz/"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-linkedin"></i>
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
