  import { useEffect, useState } from "react";
  import { toast } from "react-toastify";

  export const ConnectionHistory = () => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const dataSource = "mysql";
    const token = localStorage.getItem("authToken");
    const [connectionHistory, setConnectionHistory] = useState([]);

    useEffect(() => {
      fetchConnectionHistory();
    }, []);

    const fetchConnectionHistory = async () => {
      try {
        const response = await fetch(`${baseURL}/api/session/data/${dataSource}/history/connections`, 
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "guacamole-token": `${token}`,
            }
          });
        if (!response.ok) throw new Error("Failed to fetch connection history");
        const data = await response.json();
        setConnectionHistory(data || []);
      } catch (error) {
        console.error("Connection history fetch error:", error);
        toast.error("Failed to fetch connection history");
      }
    };

    const ConnectionHistoryTable = ({ history }) => {
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 10;
    
      const totalPages = Math.ceil(history.length / itemsPerPage);
      const pageRangeDisplayed = 5; // Max page numbers shown
    
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);
    
      const paginate = (page) => {
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        setCurrentPage(page);
      };
    
      const getPageNumbers = () => {
        let startPage = Math.max(1, currentPage - Math.floor(pageRangeDisplayed / 2));
        let endPage = startPage + pageRangeDisplayed - 1;
    
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = Math.max(1, endPage - pageRangeDisplayed + 1);
        }
    
        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
    
        return pageNumbers;
      };
    
      return (
        <>
          <div className="table-responsive text-nowrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Connection</th>
                  <th>User</th>
                  <th>Remote Host</th>
                  <th>Status</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {currentItems.length > 0 ? (
                  currentItems.map((entry, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{entry.connectionName}</strong>
                      </td>
                      <td>{entry.username}</td>
                      <td>{entry.remoteHost}</td>
                      <td>
                        <span
                          className={`badge ${
                            entry.active ? 'bg-label-success' : 'bg-label-danger'
                          } me-1`}
                        >
                          {entry.active ? 'Active' : 'Disconnected'}
                        </span>
                      </td>
                      <td>{new Date(entry.startDate).toLocaleString()}</td>
                      <td>
                        {entry.endDate
                          ? new Date(entry.endDate).toLocaleString()
                          : 'Ongoing'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No connection history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
    
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center mt-3">
                {/* First Page */}
                <li className={`page-item first ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(1)}>
                  <i class="tf-icon bx bx-chevrons-left">
                  </i>
                  </button>
                </li>
    
                {/* Previous Page */}
                <li className={`page-item prev ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                  <i class="tf-icon bx bx-chevron-left">
                  </i>
                  </button>
                </li>
    
                {/* Page Numbers */}
                {getPageNumbers().map((pageNum) => (
                  <li
                    key={pageNum}
                    className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => paginate(pageNum)}>
                      {pageNum}
                    </button>
                  </li>
                ))}
    
                {/* Next Page */}
                <li
                  className={`page-item next ${currentPage === totalPages ? 'disabled' : ''}`}
                >
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                  <i class="tf-icon bx bx-chevron-right">
                  </i>
                  </button>
                </li>
    
                {/* Last Page */}
                <li
                  className={`page-item last ${currentPage === totalPages ? 'disabled' : ''}`}
                >
                  <button className="page-link" onClick={() => paginate(totalPages)}>
                    <i class="tf-icon bx bx-chevrons-right">
                    </i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      );
    };
    return (
      <>
      <h4 className="py-3 mb-4">
                  <span className="text-muted fw-light">Dashboard /</span> Connection History
              </h4>
      <div className="row"> 
          {/* Connection History */}
          <div className="col-12 order-4">
          <div className="card">
          <div className="card-body">
              <h5 className="card-title">Connection History</h5>
              <ConnectionHistoryTable history={connectionHistory} />
          </div>
          </div>
      </div>
    </div>
      </>
    )
  };