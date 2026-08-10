// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = 'https://my-travel-app-backend-6.onrender.com';

// export default function UploadImagesByTitle() {
//     const [titles1, setTitles1] = useState([]);
//     const [titles2, setTitles2] = useState([]);
//     const [selectedTitle, setSelectedTitle] = useState(null);
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [previewUrls, setPreviewUrls] = useState([]);
//     const [uploading, setUploading] = useState(false);

//     // Fetch all titles on mount


//     useEffect(() => {
//         const fetchTitles = async () => {
//             try {
//                 const res = await axios.get(`${API_URL}/api/titles`);
//                 if (res.data.success) {
//                     setTitles1(res.data.titles1);
//                     setTitles2(res.data.titles2);
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch titles:", err);
//             }
//         };
//         fetchTitles();
//     }, []);


//     // File selection handler
//     const handleFileChange = (e) => {
//         const files = Array.from(e.target.files);
//         setSelectedFiles(files);
//         setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
//     };

//     // Upload handler (handles single OR multiple)
//     const handleUpload = async () => {
//         if (!selectedTitle) {
//             alert("Please select a title first");
//             return;
//         }

//         if (selectedFiles.length === 0) {
//             alert("Please select at least one image");
//             return;
//         }

//         const formData = new FormData();
//         // If backend expects single → use [0]
//         // If backend supports multiple → append all
//         formData.append("image", selectedFiles[0]); // ✅ single image upload

//         try {
//             setUploading(true);

//             const res = await axios.post(
//                 `${API_URL}/api/upload/${selectedTitle}`,
//                 formData,
//                 {
//                     headers: { "Content-Type": "multipart/form-data" },
//                 }
//             );

//             alert("Image uploaded successfully!");
//             console.log(res.data);
//         } catch (err) {
//             console.error("Upload error:", err.response?.data || err.message);
//             alert("Error uploading image.");
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
//             <h3>Update Images by Title</h3>

//             {/* Title Dropdown */}
//             <label style={{ display: "block", marginBottom: "6px" }}>
//                 Select Title:
//             </label>
//             <select
//                 value={selectedTitle}
//                 onChange={(e) => setSelectedTitle(e.target.value)}
//                 style={{
//                     width: "100%",
//                     padding: "8px",
//                     borderRadius: "5px",
//                     border: "1px solid #ccc",
//                     marginBottom: "15px",
//                 }}
//             >

//                 <option value="">-- Choose Title --</option>
//                 {titles1 && titles2 &&
//                     [...titles1, ...titles2].map((item, i) => (
//                         <option key={i} value={item.title}>
//                             {item.title}
//                         </option>
//                     ))
//                 }
//             </select>


//             {/* Image Input */}
//             <input
//                 type="file"
//                 onChange={handleFileChange}
//                 accept="image/*"
//             />

//             {/* Preview */}
//             <div
//                 style={{
//                     display: "flex",
//                     gap: "10px",
//                     marginTop: "10px",
//                     flexWrap: "wrap",
//                 }}
//             >
//                 {previewUrls.map((url, i) => (
//                     <img
//                         key={i}
//                         src={url}
//                         alt="preview"
//                         width={100}
//                         height={100}
//                         style={{ borderRadius: "10px", objectFit: "cover" }}
//                     />
//                 ))}
//             </div>

//             {/* Upload Button */}
//             <button
//                 onClick={handleUpload}
//                 disabled={uploading}
//                 style={{
//                     marginTop: "15px",
//                     background: uploading ? "#888" : "#007bff",
//                     color: "white",
//                     padding: "10px 20px",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                 }}
//             >
//                 {uploading ? "Uploading..." : "Upload Image"}
//             </button>
//         </div>
//     );
// }
