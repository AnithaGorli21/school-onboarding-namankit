import Loader from "./Loader";

export default function LoadingOverlay() {
  return (
    <div style={{ width: "100%", height: "100%", top: 0, left: 0, position: "absolute", zIndex: 1000, background: "rgba(255, 255, 255, 0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader />
    </div>
  );
}
