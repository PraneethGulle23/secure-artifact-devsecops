import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [artifacts, setArtifacts] = useState([]);
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);

  const name = localStorage.getItem("name");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filesRes = await API.get("/artifacts");
        const orgRes = await API.get("/org/me");

        setArtifacts(filesRes.data);
        setOrgData(orgRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ==========================
     DOWNLOAD FUNCTION
  ========================== */
  const handleDownload = async (file) => {
    try {
      const response = await API.get(
        `/artifacts/${file._id}/download`,
        { responseType: "blob" }
      );

      const contentType = response.headers["content-type"];

      const blob = new Blob([response.data], {
        type: contentType,
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.response?.data?.message || "Download failed");
    }
  };

  /* ==========================
     SHARE FUNCTION (UPDATED)
  ========================== */
  const handleShare = async (file) => {
    try {
      const orgName = prompt("Enter target organization name:");
      if (!orgName) return;

      const expiryInput = prompt(
        "Enter expiry date (YYYY-MM-DD) or leave empty:"
      );

      const maxDownloadsInput = prompt(
        "Enter max downloads (0 for unlimited):"
      );

      const shareData = {
        fileId: file._id,
        toOrganizationName: orgName,
        expiryDate: expiryInput || null,
        maxDownloads: maxDownloadsInput
          ? parseInt(maxDownloadsInput)
          : 0,
      };

      await API.post("/share/request", shareData);

      alert("Share request sent successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Share failed");
    }
  };

  /* ==========================
     REVOKE FUNCTION
  ========================== */
  const handleRevoke = async (file) => {
    try {
      await API.patch(`/artifacts/${file._id}/revoke`);
      alert("File revoked successfully");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to revoke");
    }
  };

  if (loading) {
    return <h2 style={{ color: "white" }}>Loading...</h2>;
  }

  return (
    <div>
      {/* USER INFO SECTION */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          background: "rgba(255,255,255,0.07)",
          borderRadius: "15px",
        }}
      >
        <h2>Welcome, {name}</h2>
        <p>
          <strong>Organization:</strong> {orgData?.organizationName}
        </p>
        <p>
          <strong>Role:</strong> {orgData?.role}
        </p>

        {orgData?.role === "admin" && (
          <p>
            <strong>Invite Code:</strong> {orgData?.inviteCode}
          </p>
        )}
      </div>

      {/* FILE TABLE */}
      <h3>Organization Files</h3>

      {artifacts.length === 0 ? (
        <p>No files available.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "10px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>File Name</th>
              <th style={thStyle}>Download</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {artifacts.map((file) => (
              <tr key={file._id}>
                <td style={tdStyle}>{file.name}</td>

                <td style={tdStyle}>
                  <button
                    style={buttonStyle}
                    onClick={() => handleDownload(file)}
                  >
                    Download
                  </button>
                </td>

                <td style={tdStyle}>
                  <button
                    style={{
                      ...buttonStyle,
                      background: "#3498db",
                    }}
                    onClick={() => handleShare(file)}
                  >
                    Share
                  </button>

                  {orgData?.role === "admin" && (
                    <button
                      style={{
                        ...buttonStyle,
                        background: "crimson",
                        marginLeft: "10px",
                      }}
                      onClick={() => handleRevoke(file)}
                    >
                      Revoke
                    </button>
                  )}
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
  padding: "12px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  textAlign: "left",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const buttonStyle = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(to right, #8e2de2, #4a00e0)",
  color: "white",
};

export default Dashboard;

// import { useEffect, useState } from "react";
// import API from "../services/api";

// function Dashboard() {
//   const [artifacts, setArtifacts] = useState([]);
//   const [orgData, setOrgData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const name = localStorage.getItem("name");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const filesRes = await API.get("/artifacts");
//         const orgRes = await API.get("/org/me");

//         setArtifacts(filesRes.data);
//         setOrgData(orgRes.data);
//       } catch (error) {
//         console.error("Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <h2 style={{ color: "white" }}>Loading...</h2>;
//   }

//   return (
//     <div>

//       {/* USER INFO SECTION */}
//       <div
//         style={{
//           marginBottom: "30px",
//           padding: "20px",
//           background: "rgba(255,255,255,0.07)",
//           borderRadius: "15px",
//         }}
//       >
//         <h2>Welcome, {name}</h2>
//         <p><strong>Organization:</strong> {orgData.organizationName}</p>
//         <p><strong>Role:</strong> {orgData.role}</p>

//         {orgData.role === "admin" && (
//           <p><strong>Invite Code:</strong> {orgData.inviteCode}</p>
//         )}
//       </div>

//       {/* FILE TABLE */}
//       <h3>Organization Files</h3>

//       {artifacts.length === 0 ? (
//         <p>No files uploaded yet.</p>
//       ) : (
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             background: "rgba(255,255,255,0.05)",
//             borderRadius: "10px",
//           }}
//         >
//           <thead>
//             <tr>
//               <th style={thStyle}>File Name</th>
//               <th style={thStyle}>Downloads</th>
//               <th style={thStyle}>Status</th>
//               <th style={thStyle}>Expiry</th>
//               <th style={thStyle}>Download</th>
//             </tr>
//           </thead>
//           <tbody>
//             {artifacts.map((file) => (
//               <tr key={file._id}>
//               <td style={tdStyle}>{file.name}</td>

//               <td style={tdStyle}>
//                 {file.downloadCount} / {file.maxDownloads || "∞"}
//               </td>

//               <td style={tdStyle}>{file.status}</td>

//               <td style={tdStyle}>
//                 {file.expiryDate
//                   ? new Date(file.expiryDate).toLocaleDateString()
//                   : "No Expiry"}
//               </td>

//               <td style={tdStyle}>
//                 <button
//                   style={{
//                     padding: "6px 12px",
//                     borderRadius: "6px",
//                     border: "none",
//                     cursor: "pointer",
//                     background:
//                       file.status !== "active"
//                         ? "gray"
//                         : "linear-gradient(to right, #8e2de2, #4a00e0)",
//                     color: "white",
//                   }}
//                   disabled={file.status !== "active"}
//                   onClick={() =>
//                     window.open(
//                       `http://localhost:5000/api/artifacts/${file._id}/download`,
//                       "_blank"
//                     )
//                   }
//                 >
//                   Download
//                 </button>
//               </td>
//             </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// const thStyle = {
//   padding: "12px",
//   borderBottom: "1px solid rgba(255,255,255,0.1)",
//   textAlign: "left",
// };

// const tdStyle = {
//   padding: "12px",
//   borderBottom: "1px solid rgba(255,255,255,0.05)",
// };

// export default Dashboard;

