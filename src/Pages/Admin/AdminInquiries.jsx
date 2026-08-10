// import React, { useEffect, useState } from "react";
// import api from "../../utils/api";
// // import Packages from "./Packages";

// function AdminInquiries() {
//   const [inquiries, setInquiries] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const res = await api.get("/admin/inquiries");
//     setInquiries(res.data);
//   };

//   const updateStatus = async (id, status) => {
//     await api.put(`/admin/inquiries/${id}`, { status });
//     fetchData();
//   };

//   const deleteInquiry = async (id) => {
//     await api.delete(`/admin/inquiries/${id}`);
//     fetchData();
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>All Inquiries</h2>

//       {inquiries.map((item) => (
//         <div
//           key={item._id}
//           style={{
//             border: "1px solid #ddd",
//             padding: "20px",
//             marginBottom: "20px",
//           }}
//         >
//           <h4>{item.packageTitle}</h4>
//           <p>{item.name} | {item.phone}</p>
//           <p>Status: {item.status}</p>

//           <button onClick={() => updateStatus(item._id, "contacted")}>
//             Mark Contacted
//           </button>

//           <button onClick={() => deleteInquiry(item._id)}>
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }



// {/* <Packages/> */}

// export default AdminInquiries;
