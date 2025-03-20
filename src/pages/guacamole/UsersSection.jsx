import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const UsersSection = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const dataSource = "mysql";
  const token = localStorage.getItem("authToken");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch( `${baseURL}/api/session/data/${dataSource}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "guacamole-token": `${token}`,
        }
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(Object.keys(data).map((username) => ({ username, ...data[username] })));
    } catch (error) {
      console.error("Users fetch error:", error);
      toast.error("Failed to fetch users");
    }
  };

  return (
    <>
    <h4 className="py-3 mb-4">
                <span className="text-muted fw-light">Dashboard /</span> Users Section
            </h4>
    <div>
      {/* Users Section */}
      <div className="col-12 order-4">
      {/* <div className="col-lg-4 col-md-4 order-1"> */}
        <div className="row">
          <div className="col-lg-12 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Users</h5>
                <UsersTable users={users} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const UsersTable = ({ users }) => (
  <div className="table-responsive text-nowrap">
    <table className="table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody className="table-border-bottom-0">
        {users.length > 0 ? (
          users.map((user) => (
            <tr key={user.username}>
              <td>
                <strong>{user.username}</strong>
              </td>
              <td>{user.attributes?.['guac-full-name'] || 'N/A'}</td>
              <td>{user.attributes?.['guac-email-address'] || 'N/A'}</td>
              <td>
                <span className={`badge ${user.disabled ? 'bg-label-danger' : 'bg-label-success'} me-1`}>
                  {user.disabled ? 'Disabled' : 'Active'}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);