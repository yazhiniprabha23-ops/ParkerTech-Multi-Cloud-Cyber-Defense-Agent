import "./CloudCard.css";

function CloudCard({ title, status, color }) {
  return (
    <div className="cloud-card">

      <h3>{title}</h3>

      <span
        className="status"
        style={{ color }}
      >
        {status}
      </span>

    </div>
  );
}

export default CloudCard;