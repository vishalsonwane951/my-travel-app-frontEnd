// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import toast from 'react-hot-toast';
// import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
// import api from '../../utils/api';
// // import PackageModal from '../components/PackageModal';
// // import DeleteConfirmModal from '../components/DeleteConfirmModal';
// // import LoadingSkeleton from '../../Components/s';

// const Packages = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingPackage, setEditingPackage] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
  
//   const queryClient = useQueryClient();
  
//   const { data, isLoading, refetch } = useQueary(
//     ['packages', currentPage, searchTerm, statusFilter],
//     () => api.get('/packages', {
//       params: {
//         page: currentPage,
//         search: searchTerm,
//         status: statusFilter !== 'all' ? statusFilter : undefined
//       }
//     }).then(res => res.data)
//   );
  
//   const deleteMutation = useMutation(
//     (id) => api.delete(`/packages/${id}`),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries('packages');
//         toast.success('Package deleted successfully');
//         setDeleteTarget(null);
//       },
//       onError: () => {
//         toast.error('Failed to delete package');
//       }
//     }
//   );
  
//   const handleEdit = (pkg) => {
//     setEditingPackage(pkg);
//     setIsModalOpen(true);
//   };
  
//   const handleDelete = () => {
//     if (deleteTarget) {
//       deleteMutation.mutate(deleteTarget);
//     }
//   };
  
//   if (isLoading) return <LoadingSkeleton />;
  
//   const packages = data?.data || [];
//   const pagination = data?.pagination;
  
//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Travel Packages</h1>
//         <button
//           onClick={() => {
//             setEditingPackage(null);
//             setIsModalOpen(true);
//           }}
//           className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Add Package
//         </button>
//       </div>
      
//       <div className="bg-white rounded-lg shadow">
//         <div className="p-6 border-b">
//           <div className="flex flex-wrap gap-4">
//             <div className="flex-1 min-w-50">
//               <input
//                 type="text"
//                 placeholder="Search packages..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
//               />
//             </div>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
//             >
//               <option value="all">All Status</option>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {packages.map((pkg) => (
//                 <tr key={pkg._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       {pkg.images?.[0] && (
//                         <img src={pkg.images[0].url} alt={pkg.name} className="h-10 w-10 rounded-lg object-cover mr-3" />
//                       )}
//                       <div className="font-medium text-gray-900">{pkg.name}</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.duration}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{pkg.price.toLocaleString()}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.location}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       pkg.category === 'Domestic' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
//                     }`}>
//                       {pkg.category}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       pkg.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {pkg.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.totalBookings || 0}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button onClick={() => handleEdit(pkg)} className="text-primary-600 hover:text-primary-900 mr-3">
//                       <PencilIcon className="h-5 w-5" />
//                     </button>
//                     <button onClick={() => setDeleteTarget(pkg._id)} className="text-red-600 hover:text-red-900">
//                       <TrashIcon className="h-5 w-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {pagination && pagination.pages > 1 && (
//           <div className="px-6 py-4 border-t flex justify-between items-center">
//             <button
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 border rounded-md disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="text-sm text-gray-600">
//               Page {currentPage} of {pagination.pages}
//             </span>
//             <button
//               onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
//               disabled={currentPage === pagination.pages}
//               className="px-4 py-2 border rounded-md disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
      
//       <PackageModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setEditingPackage(null);
//         }}
//         packageData={editingPackage}
//         onSuccess={() => {
//           refetch();
//           setIsModalOpen(false);
//           setEditingPackage(null);
//         }}
//       />
      
//       <DeleteConfirmModal
//         isOpen={!!deleteTarget}
//         onClose={() => setDeleteTarget(null)}
//         onConfirm={handleDelete}
//         title="Delete Package"
//         message="Are you sure you want to delete this package? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default Packages;