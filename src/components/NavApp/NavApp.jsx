import "./NavApp.css";
//Componentes Bootstrap:
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function NavApp() {
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            navbarScroll
            defaultActiveKey="/"
          >
            <Nav.Link href="#action1">Inicio</Nav.Link>
            <NavDropdown title="Pedidos" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">
                Registrar Pedido
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Gastos" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">
                Registrar Gasto
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Clientes" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">
                Regirstrar Cliente
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Buscar Artículo"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavApp;
