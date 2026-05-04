function Loader({ color = "#28a745" }) {
  return (
    <div className="spinner-border" role="status" style={{ color }}>
      <span className="visually-hidden"></span>
    </div>
  );
}

export default Loader;
