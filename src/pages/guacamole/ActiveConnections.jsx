import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ActiveConnections = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const dataSource = "mysql";
  const token = localStorage.getItem("authToken");
  const [activeConnections, setActiveConnections] = useState({});
  const [selectedConnections, setSelectedConnections] = useState([]);

  // Fetch active connections
  const fetchActiveConnections = async () => {
    try {
      const response = await fetch(
        `${baseURL}/api/session/data/${dataSource}/activeConnections`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "guacamole-token": `${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch active connections");
      const data = await response.json();
      setActiveConnections(data || {});
    } catch (error) {
      console.error("Active connections fetch error:", error);
      toast.error("Failed to fetch active connections");
    }
  };

  // Kill selected sessions
  const killSelectedSessions = async () => {
    if (selectedConnections.length === 0) {
      toast.warning("Please select at least one connection to kill.");
      return;
    }

    const payload = selectedConnections.map((sessionId) => ({
      op: "remove",
      path: `/${sessionId}`,
    }));

    try {
      const response = await fetch(
        `${baseURL}/api/session/data/${dataSource}/activeConnections`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "guacamole-token": `${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to kill sessions");

      toast.success("Selected sessions killed successfully!");

      fetchActiveConnections();
      setSelectedConnections([]);
    } catch (error) {
      console.error("Kill sessions error:", error);
      toast.error("Failed to kill selected sessions");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Session expired. Please log in again.");
      return;
    }
    fetchActiveConnections();
  }, []);

  return (
    <>
      <h4 className="py-3 mb-4">
        <span className="text-muted fw-light">Dashboard /</span> Active
        Connections
      </h4>

      <div className="col-12 order-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Active Connections</h5>

            <ActiveConnectionsTable
              connections={activeConnections}
              selectedConnections={selectedConnections}
              setSelectedConnections={setSelectedConnections}
            />
          </div>
        </div>

        {/* Kill Sessions Button - Center Aligned */}
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-danger"
            onClick={killSelectedSessions}
            disabled={selectedConnections.length === 0}
          >
            Kill Session{selectedConnections.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </>
  );
};

const ActiveConnectionsTable = ({
  connections,
  selectedConnections,
  setSelectedConnections,
}) => {
  const handleCheckboxChange = (identifier) => {
    if (selectedConnections.includes(identifier)) {
      setSelectedConnections(
        selectedConnections.filter((id) => id !== identifier)
      );
    } else {
      setSelectedConnections([...selectedConnections, identifier]);
    }
  };

  return (
    <div className="table-responsive text-nowrap">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
            <th>Active Since</th>
            <th>Remote Host</th>
            <th>Connection Name</th>
          </tr>
        </thead>
        <tbody className="table-border-bottom-0">
          {Object.keys(connections).length > 0 ? (
            Object.entries(connections).map(([identifier, conn]) => (
              <tr key={identifier}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedConnections.includes(identifier)}
                    onChange={() => handleCheckboxChange(identifier)}
                  />
                </td>
                <td>
                  <strong>{conn.username || "Unknown"}</strong>
                </td>
                <td>
                  {conn.startDate
                    ? new Date(conn.startDate).toLocaleString()
                    : "Unknown"}
                </td>
                <td>{conn.remoteHost || "Unknown"}</td>
                <td>{conn.connectionName || "Unknown"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No active connections.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
