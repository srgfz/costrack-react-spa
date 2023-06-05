import "./Footer.css";

function Footer() {
  return (
    <footer className="d-flex flex-column flex-md-row justify-content-between align-items-center py-3 mt-4 border-top position-absolute bottom-0 w-100 px-5 me-0 bg-dark text-light">
      <div className="footer__logo">
        <img
          src="./src/assets/images/logo/logo-nobg/icon1.png"
          alt="Logo de CosTrack"
          className="img-fluid "
        />
      </div>
      <div className="d-flex flex-column flex-md-row aling-itmes-center justify-content-center text-center my-3">
        <span className="  text-light">© Sergio Fernández Nevado 2023</span>
        <span className="d-none d-md-flex mx-2"> | </span>
        <span>IES Ribera del Tajo</span>
      </div>

      <ul className="d-flex fs-5">
        <li className="">
          <a
            className="mx-3"
            href="https://github.com/srgfz"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-github text-light"></i>
          </a>
        </li>
        <li className="">
          <a
            className=""
            href="https://www.linkedin.com/in/srgfz/"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-linkedin text-light"></i>
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
