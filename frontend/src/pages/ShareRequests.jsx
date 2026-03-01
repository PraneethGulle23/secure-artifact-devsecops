import { useEffect, useState } from "react";
import API from "../services/api";

function ShareRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") return;

    const fetchRequests = async () => {
      try {
        const res = await API.get("/share/incoming");
        setRequests(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [role]);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/share/${id}`, { status });

      // remove request from UI after update
      setRequests(requests.filter((r) => r._id !== id));

      alert(`Request ${status}`);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  if (role !== "admin") {
    return (
      <div style={{ padding: "20px", color: "white" }}>
        <h2>Access Denied</h2>
        <p>Only organization admins can view share requests.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "white" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Incoming Share Requests</h2>

      {requests.length === 0 ? (
        <p>No pending share requests.</p>
      ) : (
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>File</th>
              <th style={thStyle}>Requested By</th>
              <th style={thStyle}>From Organization</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td style={tdStyle}>{req.fileId?.name}</td>
                <td style={tdStyle}>{req.requestedBy?.email}</td>
                <td style={tdStyle}>{req.fromOrganizationId?.name || "—"}</td>
                <td style={tdStyle}>
                  <button
                    style={approveBtn}
                    onClick={() => updateStatus(req._id, "approved")}
                  >
                    Approve
                  </button>

                  <button
                    style={rejectBtn}
                    onClick={() => updateStatus(req._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const approveBtn = {
  marginRight: "10px",
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  background: "#2ecc71",
  color: "white",
};

const rejectBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  background: "#e74c3c",
  color: "white",
};

export default ShareRequests;