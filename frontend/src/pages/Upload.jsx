import { useState } from "react";
import API from "../services/api";

function Upload() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    await API.post("/artifacts/upload", formData);

    alert("File uploaded successfully");
  };

  return (
    <div>
      <h2>Upload File</h2>

      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="File Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <br /><br />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;

// import { useState } from "react";
// import API from "../services/api";

// const Upload = () => {
//   const [name, setName] = useState("");
//   const [version, setVersion] = useState("");
//   const [file, setFile] = useState(null);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("version", version);
//     formData.append("file", file);
//     await API.post("/artifacts/upload", formData);
//     alert("Uploaded successfully");
//   };

//   return (
//     <div className="max-w-2xl">
//       <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//         Upload Artifact
//       </h1>

//       <form
//         onSubmit={handleUpload}
//         className="p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/10 shadow-xl"
//       >
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Artifact Name"
//             className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Version"
//             className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             onChange={(e) => setVersion(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//         </div>

//         <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl hover:opacity-90 transition">
//           Upload
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Upload;