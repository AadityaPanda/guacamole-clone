import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AvailableConnections = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const dataSource = "mysql";
  const token = localStorage.getItem("authToken");

  // State Management
  const [connections, setConnections] = useState({ childConnections: [], childConnectionGroups: [] });
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch Connections Tree
  const fetchConnectionsTree = async () => {
    try {
      const response = await fetch(`${baseURL}/api/session/data/${dataSource}/connectionGroups/ROOT/tree`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "guacamole-token": `${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch connection groups");
      const data = await response.json();
      setConnections(data);
      setSelectedConnections([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Connections tree fetch error:", error);
      toast.error("Failed to fetch connection groups");
    }
  };

  // Handle Delete Selected Connections
  const handleDeleteSessions = async () => {
    if (selectedConnections.length === 0) {
      toast.warn("No connections selected for deletion.");
      return;
    }
    try {
      await Promise.all(
        selectedConnections.map(async (connId) => {
          const res = await fetch(`${baseURL}/api/session/data/${dataSource}/connections/${connId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "guacamole-token": `${token}`,
            },
          });
          if (!res.ok) throw new Error(`Failed to delete session with id: ${connId}`);
        })
      );
      toast.success("Selected sessions deleted successfully.");
      fetchConnectionsTree(); // Refresh connections
    } catch (error) {
      console.error("Error deleting sessions:", error);
      toast.error("An error occurred while deleting sessions.");
    }
  };

  // Handle Checkbox Change
  const handleCheckboxChange = (connectionId) => {
    setSelectedConnections((prev) =>
      prev.includes(connectionId)
        ? prev.filter((id) => id !== connectionId)
        : [...prev, connectionId]
    );
  };

  // Handle Select All Checkboxes
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedConnections([]);
    } else {
      const allConnectionIds = getAllConnectionIds(connections);
      setSelectedConnections(allConnectionIds);
    }
    setSelectAll(!selectAll);
  };

  // Recursive Function to Get All Connection IDs (Including Nested Groups)
  const getAllConnectionIds = (group) => {
    let all = [];
    if (group.childConnections?.length) {
      all = [...all, ...group.childConnections.map((conn) => conn.identifier)];
    }
    if (group.childConnectionGroups?.length) {
      group.childConnectionGroups.forEach((childGroup) => {
        all = [...all, ...getAllConnectionIds(childGroup)];
      });
    }
    return all;
  };

  // Handle Connect to a VM
  const handleConnect = async (connectionId) => {
    if (!connectionId) {
      toast.error("Invalid connection identifier");
      return;
    }
    try {
      // Verify connection exists
      const checkResponse = await fetch(`${baseURL}/api/session/data/${dataSource}/connections/${connectionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "guacamole-token": `${token}`,
        },
      });
      if (!checkResponse.ok) {
        throw new Error(`Connection check failed: ${checkResponse.status}`);
      }
      const connectionDetails = await checkResponse.json();
      console.log("Connection details:", connectionDetails);
      // Construct the client URL
      const clientURL = `${baseURL}/#/client/${connectionId}?token=${token}`;
      console.log("Opening client URL:", clientURL);
      // Redirect to the Guacamole client
      window.location.href = clientURL;
      // Log success
      toast.info(`Opening connection to ${connectionDetails.name}...`);
    } catch (error) {
      console.error("Connection error:", error);
      toast.error(`Failed to connect: ${error.message}`);
    }
  };

  // Render Connection Rows (Recursive for Nested Groups)
  const renderConnections = (group, parentGroupName = "") => {
    const groupName = group.name === "ROOT" ? "" : group.name; // Exclude ROOT group name
    const currentGroupName = groupName || parentGroupName;
    return (
      <React.Fragment key={group.identifier}>
        {/* Render Connections */}
        {group.childConnections?.map((conn) => (
          <tr key={conn.identifier}>
            <td>
              <input
                type="checkbox"
                checked={selectedConnections.includes(conn.identifier)}
                onChange={() => handleCheckboxChange(conn.identifier)}
              />
            </td>
            <td>{currentGroupName || "-"}</td>
            <td>{conn.name}</td>
            <td>{conn.protocol || "Unknown"}</td>
            <td>
              <button className="btn btn-sm btn-primary me-1" onClick={() => handleConnect(conn.identifier)}>
                Connect
              </button>
            </td>
          </tr>
        ))}
        {/* Recursively Render Nested Groups */}
        {group.childConnectionGroups?.map((childGroup) => renderConnections(childGroup, currentGroupName))}
      </React.Fragment>
    );
  };

  // Lifecycle Hook
  useEffect(() => {
    if (!token) {
      toast.error("Session expired. Please log in again.");
      return;
    }
    fetchConnectionsTree();
  }, []);

  return (
    <>
      <h4 className="py-3 mb-4">
        <span className="text-muted fw-light">Dashboard /</span> Available Connections
      </h4>
      <div className="col-12 order-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">Available Connections</h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
                    </th>
                    <th>Group</th>
                    <th>Connection Name</th>
                    <th>Protocol</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {renderConnections(connections)} {/* Render Root and Nested Groups */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-danger" onClick={handleDeleteSessions} disabled={selectedConnections.length === 0}>
            Delete Session{selectedConnections.length > 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </>
  );
};