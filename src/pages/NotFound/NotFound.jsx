import notFound from "./../../assets/images/404.png";

const NotFound = () => {
  return (
    <div className="error">
      <img src={notFound} alt="Page Not Found" />
    </div>
  );
};

export default NotFound;
