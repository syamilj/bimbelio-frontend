'use client';

// import { api } from '@/trpc/react';
import { Fragment } from 'react';
import EditDocument from './_components/action/edit-dokument';
import TambahDokumen from './_components/action/tambah-dokumen';
import DocumentInfo from './_components/document-info';
import HeadingTools from './_components/heading-tools';
import Table from './_components/table';

export default function Dokumen() {
  return (
    <Fragment>
      <TambahDokumen />
      <EditDocument />

      <div className="flex flex-col gap-[4rem]">
        <div className="flex justify-between gap-[1rem]">
          <DocumentInfo />
        </div>

        <div className="flex flex-col gap-4">
          <HeadingTools />

          <Table />
        </div>
      </div>
    </Fragment>
  );
}

// const DocumentInfo = () => {
//   const [data, setData] = useState<any[]>([]);

//   const fetchDocumentInfo = async () => {
//     await getGeneral('/document/getDocumentInfo', {
//       setData: setData,
//     });
//   };

//   useEffect(() => {
//     fetchDocumentInfo();
//   }, []);

//   return (
//     <>
//       {data?.map((item: any, i: number) => (
//         <div
//           key={i}
//           className="w-full rounded-[2rem] bg-white p-[2rem]"
//         >
//           <p className="font-regular text-[2rem]">{item.Document.length}</p>
//           <p className="text-main-gray-text">{item.name}</p>
//         </div>
//       ))}
//     </>
//   );
// };

// const HeadingTools = () => {
//   const {
//     setShowAddDocument,
//     filter,
//     setFilter,
//     setFilterDocument,
//     filterDocument,
//   } = useProvider();

//   const [showFilter, setShowFilter] = useState<boolean>(false);

//   // const { data: category } = api.category.getAllCategories.useQuery(undefined, {
//   //   refetchOnWindowFocus: false,
//   //   refetchOnMount: false,
//   // });

//   const [category, setCategory] = useState<
//     {
//       name: string;
//       id: string;
//       total: number;
//     }[]
//   >([]);
//   const fetchCategory = async () => {
//     await getGeneral('/category/getAllCategories', {
//       setData: setCategory,
//     });
//   };

//   useEffect(() => {
//     fetchCategory();
//   }, []);

//   const handleFilter = () => {
//     if (!filter) {
//       // toaster({
//       //   title: "Filter",
//       //   condition: "warning",
//       //   description: `Pilih Filter`,
//       //   duration: 3000
//       // })
//       return;
//     }
//     if (filter?.value === '') {
//       // toaster({
//       //   title: "Filter",
//       //   condition: "warning",
//       //   description: `Pilih ${filter.filter}`,
//       //   duration: 3000
//       // })
//       return;
//     }
//     if (filter) {
//       setFilterDocument({ filter: filter.filter, filterValue: filter.value });
//       setShowFilter(false);
//     }
//   };

//   return (
//     <div className="flex w-full justify-between">
//       <div className="flex gap-[1rem]">
//         {showFilter && (
//           <div
//             className="fixed left-0 top-0 z-[1] h-full w-full"
//             onClick={() => setShowFilter(false)}
//           />
//         )}
//         <div className="">
//           <input
//             type="text"
//             placeholder="Cari document...."
//             className="h-full w-full rounded-[.7rem] bg-white px-[1rem] outline-none"
//           />
//         </div>
//         <div className="relative">
//           <div
//             className={cn(
//               'font-regular relative z-[2] flex cursor-pointer items-center rounded-[.7rem] bg-white px-[1rem] py-[.5rem] text-main-gray-text2',
//               filterDocument?.filter &&
//                 filterDocument?.filterValue !== '' &&
//                 'bg-main text-white',
//             )}
//             onClick={() => setShowFilter(!showFilter)}
//           >
//             <i className="bx bx-filter text-[1.5rem]" />
//             {filterDocument?.filter ? 'Filtered' : 'Filter'}
//           </div>
//           {showFilter && (
//             <div className="absolute left-[0] top-[calc(100%+.5rem)] z-[2] flex min-w-[280px] flex-col whitespace-nowrap rounded-[.5rem] bg-white p-[.5rem] text-[.8rem] text-main-gray-text shadow-cardSoft">
//               <div className="flex items-center justify-between gap-[.5rem]">
//                 <Select
//                   value={filter?.filter}
//                   onValueChange={(value) =>
//                     value &&
//                     setFilter({ type: 'option', filter: value, value: '' })
//                   }
//                 >
//                   <SelectTrigger className="h-[30px] rounded-[.4rem] py-0">
//                     <SelectValue placeholder="Filter" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="category">Category</SelectItem>
//                     <SelectItem value="status">Status</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <IconTailedArrowNext
//                   w={10}
//                   className="shrink-0"
//                 />
//                 {filter?.type === 'input' && (
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Enter value"
//                       className="h-[30px] rounded-[.4rem] border px-[12px] outline-none"
//                     />
//                   </div>
//                 )}
//                 {filter?.type === 'option' && (
//                   <Select
//                     value={filter.value}
//                     onValueChange={(value) =>
//                       value &&
//                       setFilter((prev) => {
//                         if (prev) {
//                           return { ...prev, value: value };
//                         } else {
//                           return null;
//                         }
//                       })
//                     }
//                   >
//                     <SelectTrigger className="h-[30px] rounded-[.4rem] py-0">
//                       <SelectValue placeholder={`Pilih ${filter.filter}`} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {filter.filter === 'category' &&
//                         category?.map((item) => (
//                           <SelectItem
//                             key={item.id}
//                             value={`${item.id}`}
//                           >
//                             {item.name}
//                           </SelectItem>
//                         ))}
//                       {filter.filter === 'status' && (
//                         <>
//                           <SelectItem value="premium">Premium</SelectItem>
//                           <SelectItem value="free">Free</SelectItem>
//                         </>
//                       )}
//                     </SelectContent>
//                   </Select>
//                 )}
//               </div>
//               <hr className="my-[.5rem]" />
//               <div className="flex items-center justify-between gap-[2rem]">
//                 <div
//                   className="flex cursor-pointer items-center justify-center gap-[.5rem] rounded-[.3rem] px-[.5rem] py-[.2rem] duration-300 active:bg-white md:hover:bg-main-gray-input"
//                   onClick={() => {
//                     setFilterDocument(null);
//                   }}
//                 >
//                   <IconRegenerateMessage w={10} />
//                   <p>Clear</p>
//                 </div>
//                 <div
//                   className={cn(
//                     'flex cursor-pointer items-center justify-center gap-[.5rem] rounded-[.3rem] border px-[.5rem] py-[.2rem] duration-300 active:bg-white md:hover:bg-main-gray-input',
//                     !filter &&
//                       'cursor-default bg-white text-main-gray-disabled md:hover:bg-white',
//                     filter?.value === '' &&
//                       'cursor-default bg-white text-main-gray-disabled md:hover:bg-white',
//                   )}
//                   onClick={handleFilter}
//                 >
//                   <p>Apply filter</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex gap-[1rem]">
//         <div
//           className="cursor-pointer rounded-[.7rem] bg-transparent px-[1.5rem] py-[.7rem] font-medium text-main-gray-text duration-200"
//           onClick={() => setShowAddDocument(true)}
//         >
//           Export CSV
//         </div>
//         <div
//           className="font-regular cursor-pointer rounded-[.7rem] bg-main px-[1.5rem] py-[.7rem] text-white duration-200 hover:bg-main-hover"
//           onClick={() => setShowAddDocument(true)}
//         >
//           Tambah dokumen
//         </div>
//       </div>
//     </div>
//   );
// };

// const Table = () => {
//   const {
//     setEditData,
//     useDocument: {
//       documentData,
//       fetchDocument,
//       page,
//       setPage,
//       isLoading,
//       totalPages,
//       errorMessage,
//     },
//   } = useProvider();

//   const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);

//   const fileDownload = async (fileName: string) => {
//     try {
//       const { data, error } = await supabase.storage
//         .from('pdf')
//         .download(`${fileName}`);

//       if (data) {
//         const blob = new Blob([data], { type: 'application/pdf' });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = fileName;
//         a.click();
//         window.URL.revokeObjectURL(url);
//       }
//     } catch (error) {
//       error;
//     }
//   };
//   const [loading, setLoading] = useState<boolean>(false);
//   const [deleteData, setDeleteData] = useState<any>({
//     id: '',
//     title: '',
//   });

//   const deleteDocument = async (id: string) => {
//     await deleteGeneral(`/document/deleteDocument?id=${id}`, {
//       setLoading: setLoading,
//       onSuccess() {
//         fetchDocument();
//         setDeleteData({ id: '', title: '' });
//       },
//     });
//   };

//   const removeDocument = async () => {
//     try {
//       setDeleteConfirmation(false);
//       setLoading(true);
//       const { data: pdf, error: pdfError } = await supabase.storage
//         .from('pdf')
//         .remove([`${deleteData.title}`]);
//       const { data: img, error: imgError } = await supabase.storage
//         .from('img')
//         .remove([`${deleteData.title}`]);
//       if (pdf && img) {
//         await deleteDocument(deleteData.id);
//       }
//       if (pdfError) {
//         alert(pdfError.message);
//       }
//       if (imgError) {
//         alert(imgError.message);
//       }
//       setLoading(false);
//       return;
//     } catch (error) {
//       setLoading(false);
//       return;
//     }
//   };

//   const handlePagination = (parameter: string) => {
//     if (parameter === 'next') {
//       if (page < totalPages) setPage((prev) => prev + 1);
//     } else if (parameter === 'prev') {
//       if (page > 1) setPage((prev) => prev - 1);
//     }
//   };

//   if (errorMessage) return <div className=""></div>;

//   return (
//     <>
//       <div className="w-full">
//         <table className="w-full rounded-[.7rem] shadow-sm">
//           <thead>
//             <tr className="border-b border-main-gray-input">
//               <th className="rounded-tl-[.7rem] bg-white p-[.7rem] text-center font-semibold">
//                 No.
//               </th>
//               <th className="bg-white p-[.7rem] text-start font-semibold">
//                 Judul
//               </th>
//               <th className="bg-white p-[.7rem] text-start font-semibold">
//                 ID
//               </th>
//               <th className="bg-white p-[.7rem] text-center font-semibold">
//                 Dipilih User
//               </th>
//               <th className="bg-white p-[.7rem] text-center font-semibold">
//                 Premium
//               </th>
//               <th className="bg-white p-[.7rem] text-center font-semibold">
//                 Category
//               </th>
//               <th className="bg-white p-[.7rem] text-center font-semibold">
//                 Subcategory
//               </th>
//               <th className="rounded-tr-[.7rem] bg-white p-[.7rem] text-center font-semibold">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {documentData &&
//               !isLoading &&
//               documentData.map((item, index) => (
//                 <tr
//                   key={index}
//                   className={`border-b border-main-gray-input ${
//                     index === documentData.length - 1 && 'border-none'
//                   }`}
//                 >
//                   <td
//                     className={`bg-white p-[.5rem] text-center ${
//                       index === documentData.length - 1 && 'rounded-bl-[.7rem]'
//                     }`}
//                   >
//                     {page * 10 + (index + 1) - 10}
//                   </td>
//                   <td className="bg-white p-[.5rem]">
//                     <div className="flex items-center justify-between">
//                       <p>{item.title}</p>
//                     </div>
//                   </td>
//                   <td className="bg-white p-[.5rem]">
//                     <div className="flex items-center justify-center">
//                       <button
//                         className="rounded-[.5rem] bg-main-gray-input px-[.5rem] py-[.2rem] duration-300 md:hover:bg-main-gray-input2 md:active:bg-main-gray-input"
//                         onClick={() => {
//                           navigator.clipboard.writeText(`${item.id}`);
//                           toaster({
//                             title: 'Success',
//                             description: `ID Document Berhasil Disalin \n (${item.id})`,
//                             duration: 3000,
//                           });
//                         }}
//                       >
//                         Copy ID
//                       </button>
//                     </div>
//                   </td>

//                   <td className="bg-white p-[.5rem] text-center">
//                     {item._count.userDocuments}
//                   </td>
//                   <td className="bg-white p-[.5rem]">
//                     <div className="flex w-full items-center justify-center">
//                       {item.premium ? (
//                         <div className="flex w-[100px] items-center justify-center rounded-[1rem] bg-main py-[.2rem] text-white">
//                           Premium
//                         </div>
//                       ) : (
//                         <div className="flex w-[100px] items-center justify-center rounded-[1rem] bg-main py-[.2rem] text-white">
//                           Free
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="bg-white p-[.5rem]">
//                     <div className="flex w-full items-center justify-center">
//                       <div className="flex w-[76px] items-center justify-center rounded-[1rem] bg-main py-[.2rem] text-white">
//                         {item.category.name}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="bg-white p-[.5rem]">
//                     <div className="flex w-full items-center justify-center">
//                       <div className="flex w-[76px] items-center justify-center rounded-[1rem] bg-bg-workspace py-[.2rem] font-medium text-black">
//                         {item.subCategory.name}
//                       </div>
//                     </div>
//                   </td>
//                   <td
//                     className={`bg-white p-[.5rem] ${
//                       index === documentData.length - 1 && 'rounded-br-[.7rem]'
//                     }`}
//                   >
//                     <div className="flex items-center justify-center gap-[.5rem]">
//                       <div className="flex items-center justify-center gap-[.5rem]">
//                         <div className="flex items-center justify-center border border-black p-[.5rem] text-[1.2rem]">
//                           <a
//                             href={`${env.NEXT_PUBLIC_SUPABASE_PDF_URL}/${item.url}`}
//                             target="_blank"
//                             className="flex items-center justify-center"
//                           >
//                             <Link className="w-4 h-4" />
//                           </a>
//                         </div>
//                         <div className="flex cursor-pointer items-center justify-center border border-black p-[.5rem] text-[1.2rem]">
//                           <Download
//                             className="w-4 h-4"
//                             onClick={() => fileDownload(item.title)}
//                           />
//                         </div>
//                       </div>
//                       <HapusDokumen
//                         id={item.id}
//                         title={item.title}
//                         setDeleteConfirmation={setDeleteConfirmation}
//                         setDeleteData={setDeleteData}
//                         loading={loading}
//                       />

//                       <button
//                         className="cursor-pointer border border-black px-[1rem] py-[.3rem]"
//                         onClick={() => {
//                           setEditData({ ...item });
//                         }}
//                       >
//                         Edit Document
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             {isLoading &&
//               Array.from({ length: 10 }).map((_, index) => (
//                 <tr
//                   key={index}
//                   id="loading"
//                   className={`select-none border-b border-main-gray-input ${
//                     index === documentData.length - 1 && 'border-none'
//                   }`}
//                 >
//                   <td
//                     className={`bg-transparent p-[.5rem] text-center ${
//                       index === documentData.length - 1 && 'rounded-bl-[.7rem]'
//                     }`}
//                   >
//                     1
//                   </td>
//                   <td className="bg-transparent p-[.5rem]">
//                     <div className="flex items-center justify-between">
//                       <p>UUD 1945: Pembukaan dan Batang Tubuh (Lanjutan)</p>
//                     </div>
//                   </td>
//                   <td className="bg-transparent p-[.5rem]">1000</td>
//                   <td className="bg-transparent p-[.5rem]">
//                     <div className="w-fit rounded-[1rem] bg-transparent px-[.7rem] py-[.2rem] text-transparent">
//                       awdawd
//                     </div>
//                   </td>
//                   <td className="bg-transparent p-[.5rem]">
//                     <div className="w-fit rounded-[1rem] bg-transparent px-[.7rem] py-[.2rem] text-transparent">
//                       awdawd
//                     </div>
//                   </td>
//                   <td className="bg-transparent p-[.5rem]">
//                     <div className="w-fit rounded-[1rem] bg-transparent px-[.7rem] py-[.2rem] font-medium text-transparent">
//                       awdwadaw
//                     </div>
//                   </td>
//                   <td
//                     className={`bg-transparent p-[.5rem] ${
//                       index === documentData.length - 1 && 'rounded-br-[.7rem]'
//                     }`}
//                   >
//                     <div className="flex items-center justify-center gap-[.5rem]">
//                       <div className="flex items-center justify-center gap-[.5rem]">
//                         <div className="flex items-center justify-center border border-transparent p-[.5rem] text-[1.2rem]">
//                           <a
//                             href={``}
//                             target="_blank"
//                             className="flex items-center justify-center"
//                           >
//                             <i className="bx bx-link-external"></i>
//                           </a>
//                         </div>
//                         <div className="flex cursor-pointer items-center justify-center border border-transparent p-[.5rem] text-[1.2rem]">
//                           <i className="bx bx-download"></i>
//                         </div>
//                       </div>
//                       <button className="cursor-default border border-transparent px-[1rem] py-[.3rem]">
//                         Hapus
//                       </button>

//                       <button className="cursor-default border border-transparent px-[1rem] py-[.3rem]">
//                         Edit Document
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>

//       <div
//         id="pagination"
//         className="flex w-full items-center justify-between"
//       >
//         <div className="flex items-center gap-[1rem]">
//           {/* <p>Show</p>
//           <div className="bg-white rounded-[.5rem] px-[1rem] py-[.5rem] text-main-gray-text flex items-center gap-[.5rem]">
//             10
//             <i className="bx bx-chevron-down text-[1.5rem]" />
//           </div> */}
//         </div>
//         <div className="flex items-center gap-[1rem]">
//           <div onClick={() => handlePagination('prev')}>
//             <IconTailedArrowPrev
//               className="cursor-pointer duration-300 md:hover:-translate-x-1"
//               w={15}
//             />
//           </div>
//           <div className="flex gap-[.5rem]">
//             <p className="select-none">{page}</p>
//           </div>
//           <div onClick={() => handlePagination('next')}>
//             <IconTailedArrowNext
//               className="cursor-pointer duration-300 md:hover:translate-x-1"
//               w={15}
//             />
//           </div>
//         </div>
//       </div>

//       {deleteConfirmation && (
//         <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-[#ffffff7a]">
//           <div className="flex flex-col gap-[1rem] rounded-[1rem] bg-white p-[1rem] shadow-lg">
//             <p className="text-center">
//               Apakah anda yakin ingin menghapus dokumen <br /> &quot;
//               {deleteData.title}&quot; ?
//             </p>
//             <div className="flex w-full justify-center gap-[.5rem]">
//               <button
//                 className="rounded-[.3rem] bg-blue-600 px-[1rem] py-[.2rem] text-white hover:bg-blue-500"
//                 onClick={() => setDeleteConfirmation(false)}
//               >
//                 No
//               </button>
//               <button
//                 className="rounded-[.3rem] bg-red-600 px-[1rem] py-[.2rem] text-white hover:bg-red-500"
//                 onClick={() => removeDocument()}
//               >
//                 Yes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
