import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useUserData } from "../hooks/useUserData";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { userData, loading } = useUserData();

  // Check authentication
  if (!userData && !loading) {
    toast.error("Session expired. Please log in again.");
    navigate("/misc/error");
    return null;
  }

  return (
    <>
      <div className="row">
        {/* Admin/User Info */}
        <div className="col-12 order-4">
          <div className="card">
            <div className="d-flex align-items-end row">
              <div className="col-sm-7">
                <div className="card-body">
                  {loading ? (
                    <p>Loading user details...</p>
                  ) : userData ? (
                    <>
                      <h5 className="card-title text-primary">
                        Welcome back, {userData.username}! 🎉
                      </h5>
                      <p className="mb-4">
                        Full Name: {userData.attributes?.['guac-full-name'] || 'N/A'}
                      </p>
                      <p className="mb-4">
                        Email: {userData.attributes?.['guac-email-address'] || 'N/A'}
                      </p>
                      <p className="mb-4">
                        Organization: {userData.attributes?.['guac-organization'] || 'N/A'}
                      </p>
                    </>
                  ) : (
                    <p>Failed to load user details.</p>
                  )}
                </div>
              </div>
              <div className="col-sm-5 text-center text-sm-left">
                <div className="card-body pb-0 px-0 px-md-4">
                  <img
                    aria-label="dashboard icon image"
                    src="/assets/img/illustrations/man-with-laptop-light.png"
                    height="140"
                    alt="User Profile"
                    data-app-dark-img="illustrations/man-with-laptop-dark.png"
                    data-app-light-img="illustrations/man-with-laptop-light.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};