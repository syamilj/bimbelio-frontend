import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { deleteGeneral } from '@/lib/fetch-helper/fetch-helper';
import { IconTailedArrowNext, IconTailedArrowPrev } from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import { Download, Link } from 'lucide-react';
import { useState } from 'react';
import { useProvider } from '../provider';
import HapusDokumen from './action/hapus-dokumen';

export default function Table() {
  const {
    setEditData,
    useDocument: {
      documentData,
      fetchDocument,
      page,
      setPage,
      isLoading,
      totalPages,
      errorMessage,
    },
  } = useProvider();

  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);

  const fileDownload = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pdf')
        .download(`document/${fileName}`);

      if (data) {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      error;
    }
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState({
    id: '',
    title: '',
    videoTitle: '',
  });

  const deleteDocument = async () => {
    await deleteGeneral(`/document/deleteDocument?id=${deleteData.id}`, {
      setLoading: setLoading,
      async onSuccess() {
        fetchDocument();
        setDeleteData({ id: '', title: '', videoTitle: '' });
        await supabase.storage
          .from('pdf')
          .remove([`document/${deleteData.title}`]);
        await supabase.storage
          .from('img')
          .remove([`document/${deleteData.title}`]);
        if (deleteData.videoTitle.length > 0) {
          await supabase.storage
            .from('video')
            .remove([`document/${deleteData.videoTitle}`]);
        }
      },
    });
  };

  const removeDocument = async () => {
    try {
      setDeleteConfirmation(false);
      setLoading(true);
      await deleteDocument();
      setLoading(false);
      return;
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  const handlePagination = (parameter: string) => {
    if (parameter === 'next') {
      if (page < totalPages) setPage((prev) => prev + 1);
    } else if (parameter === 'prev') {
      if (page > 1) setPage((prev) => prev - 1);
    }
  };

  if (errorMessage) return <div className=""></div>;

  return (
    <>
      <div className="w-full">
        <table className="w-full rounded-[.7rem] shadow-sm">
          <thead>
            <tr className="border-b border-main-gray-input">
              <th className="rounded-tl-[.7rem] bg-white p-[.7rem] text-center font-semibold">
                No.
              </th>
              <th className="bg-white p-[.7rem] text-start font-semibold">
                Judul
              </th>
              <th className="bg-white p-[.7rem] text-start font-semibold">
                ID
              </th>
              <th className="bg-white p-[.7rem] text-center font-semibold">
                Dipilih User
              </th>
              <th className="bg-white p-[.7rem] text-center font-semibold">
                Premium
              </th>
              <th className="bg-white p-[.7rem] text-center font-semibold">
                Category
              </th>
              <th className="bg-white p-[.7rem] text-center font-semibold">
                Subcategory
              </th>
              <th className="rounded-tr-[.7rem] bg-white p-[.7rem] text-center font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {documentData &&
              !isLoading &&
              documentData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-main-gray-input ${
                    index === documentData.length - 1 && 'border-none'
                  }`}
                >
                  <td
                    className={`bg-white p-[.5rem] text-center ${
                      index === documentData.length - 1 && 'rounded-bl-[.7rem]'
                    }`}
                  >
                    {page * 10 + (index + 1) - 10}
                  </td>
                  <td className="bg-white p-[.5rem]">
                    <div className="flex items-center justify-between">
                      <p>{item.title}</p>
                    </div>
                  </td>
                  <td className="bg-white p-[.5rem]">
                    <div className="flex items-center justify-center">
                      <button
                        className="rounded-[.5rem] bg-main-gray-input px-[.5rem] py-[.2rem] duration-300 md:hover:bg-main-gray-input2 md:active:bg-main-gray-input"
                        onClick={() => {
                          navigator.clipboard.writeText(`${item.id}`);
                          toaster({
                            title: 'Success',
                            description: `ID Document Berhasil Disalin \n (${item.id})`,
                            duration: 3000,
                          });
                        }}
                      >
                        Copy ID
                      </button>
                    </div>
                  </td>

                  <td className="bg-white p-[.5rem] text-center">
                    {item._count.userDocuments}
                  </td>
                  <td className="bg-white p-[.5rem]">
                    <div className="flex w-full items-center justify-center">
                      {item.premium ? (
                        <div className="flex w-[100px] items-center justify-center rounded-[1rem] bg-main py-[.2rem] text-white">
                          Premium
                        </div>
                      ) : (
                        <div className="flex w-[100px] items-center justify-center rounded-[1rem] bg-main py-[.2rem] text-white">
                          Free
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="bg-white p-[.5rem]">
                    <div className="flex w-full items-center justify-center">
                      <div className="flex w-[76px] items-center justify-center rounded-[1rem] bg-main py-[.2rem] text-white">
                        {item.category.name}
                      </div>
                    </div>
                  </td>
                  <td className="bg-white p-[.5rem]">
                    <div className="flex w-full items-center justify-center">
                      <div className="flex w-[76px] items-center justify-center rounded-[1rem] bg-bg-workspace py-[.2rem] font-medium text-black">
                        {item.subCategory.name}
                      </div>
                    </div>
                  </td>
                  <td
                    className={`bg-white p-[.5rem] ${
                      index === documentData.length - 1 && 'rounded-br-[.7rem]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-[.5rem]">
                      <div className="flex items-center justify-center gap-[.5rem]">
                        <div className="flex items-center justify-center border border-black p-[.5rem] text-[1.2rem]">
                          <a
                            href={`${env.NEXT_PUBLIC_SUPABASE_PDF_URL}/document/${item.url}`}
                            target="_blank"
                            className="flex items-center justify-center"
                          >
                            <Link className="w-4 h-4" />
                          </a>
                        </div>
                        <div className="flex cursor-pointer items-center justify-center border border-black p-[.5rem] text-[1.2rem]">
                          <Download
                            className="w-4 h-4"
                            onClick={() => fileDownload(item.title)}
                          />
                        </div>
                      </div>
                      <HapusDokumen
                        id={item.id}
                        title={item.title}
                        videoTitle={item.video?.title || ''}
                        setDeleteConfirmation={setDeleteConfirmation}
                        setDeleteData={setDeleteData}
                        loading={loading}
                      />

                      <button
                        className="cursor-pointer border border-black px-[1rem] py-[.3rem]"
                        onClick={() => {
                          setEditData({ ...item });
                        }}
                      >
                        Edit Document
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {isLoading &&
              Array.from({ length: 10 }).map((_, index) => (
                <tr
                  key={index}
                  id="loading"
                  className={`select-none border-b border-main-gray-input ${
                    index === documentData.length - 1 && 'border-none'
                  }`}
                >
                  <td
                    className={`bg-transparent p-[.5rem] text-center ${
                      index === documentData.length - 1 && 'rounded-bl-[.7rem]'
                    }`}
                  >
                    1
                  </td>
                  <td className="bg-transparent p-[.5rem]">
                    <div className="flex items-center justify-between">
                      <p>UUD 1945: Pembukaan dan Batang Tubuh (Lanjutan)</p>
                    </div>
                  </td>
                  <td className="bg-transparent p-[.5rem]">1000</td>
                  <td className="bg-transparent p-[.5rem]">
                    <div className="w-fit rounded-[1rem] bg-transparent px-[.7rem] py-[.2rem] text-transparent">
                      awdawd
                    </div>
                  </td>
                  <td className="bg-transparent p-[.5rem]">
                    <div className="w-fit rounded-[1rem] bg-transparent px-[.7rem] py-[.2rem] text-transparent">
                      awdawd
                    </div>
                  </td>
                  <td className="bg-transparent p-[.5rem]">
                    <div className="w-fit rounded-[1rem] bg-transparent px-[.7rem] py-[.2rem] font-medium text-transparent">
                      awdwadaw
                    </div>
                  </td>
                  <td
                    className={`bg-transparent p-[.5rem] ${
                      index === documentData.length - 1 && 'rounded-br-[.7rem]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-[.5rem]">
                      <div className="flex items-center justify-center gap-[.5rem]">
                        <div className="flex items-center justify-center border border-transparent p-[.5rem] text-[1.2rem]">
                          <a
                            href={``}
                            target="_blank"
                            className="flex items-center justify-center"
                          >
                            <i className="bx bx-link-external"></i>
                          </a>
                        </div>
                        <div className="flex cursor-pointer items-center justify-center border border-transparent p-[.5rem] text-[1.2rem]">
                          <i className="bx bx-download"></i>
                        </div>
                      </div>
                      <button className="cursor-default border border-transparent px-[1rem] py-[.3rem]">
                        Hapus
                      </button>

                      <button className="cursor-default border border-transparent px-[1rem] py-[.3rem]">
                        Edit Document
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div
        id="pagination"
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-[1rem]">
          {/* <p>Show</p>
          <div className="bg-white rounded-[.5rem] px-[1rem] py-[.5rem] text-main-gray-text flex items-center gap-[.5rem]">
            10
            <i className="bx bx-chevron-down text-[1.5rem]" />
          </div> */}
        </div>
        <div className="flex items-center gap-[1rem]">
          <div onClick={() => handlePagination('prev')}>
            <IconTailedArrowPrev
              className="cursor-pointer duration-300 md:hover:-translate-x-1"
              w={15}
            />
          </div>
          <div className="flex gap-[.5rem]">
            <p className="select-none">{page}</p>
          </div>
          <div onClick={() => handlePagination('next')}>
            <IconTailedArrowNext
              className="cursor-pointer duration-300 md:hover:translate-x-1"
              w={15}
            />
          </div>
        </div>
      </div>

      {deleteConfirmation && (
        <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-[#ffffff7a]">
          <div className="flex flex-col gap-[1rem] rounded-[1rem] bg-white p-[1rem] shadow-lg">
            <p className="text-center">
              Apakah anda yakin ingin menghapus dokumen <br /> &quot;
              {deleteData.title}&quot; ?
            </p>
            <div className="flex w-full justify-center gap-[.5rem]">
              <button
                className="rounded-[.3rem] bg-blue-600 px-[1rem] py-[.2rem] text-white hover:bg-blue-500"
                onClick={() => setDeleteConfirmation(false)}
              >
                No
              </button>
              <button
                className="rounded-[.3rem] bg-red-600 px-[1rem] py-[.2rem] text-white hover:bg-red-500"
                onClick={() => removeDocument()}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
