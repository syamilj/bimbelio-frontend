'use client';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Category, Document, Subcategory, Video } from '@/types/database';
import {
  createContext,
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Provider({ children }: Props) {
  // == Add & Edit ============================================================
  const [showAddDocument, setShowAddDocument] = useState<boolean>(false);
  const [showEditDocument, setShowEditDocument] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>(null);

  // == Filter ============================================================
  const [filter, setFilter] = useState<FilterProps | null>(null);
  const [filterDocument, setFilterDocument] =
    useState<FilterDocumentProps | null>(null);

  // == Category And SubCategory  ==========================================
  const [isError, setIsError] = useState<boolean>(false);
  const [categoryAndSubCategory, setCategoryAndSubCategory] = useState<{
    category: Category[];
    subCategory: Subcategory[];
  }>({
    category: [],
    subCategory: [],
  });
  const fetchCatAndSubCat = async () => {
    await getGeneral('/document/getCategoryAndSubCategory', {
      setData: setCategoryAndSubCategory,
      onError: () => {
        setIsError(true);
      },
    });
  };
  useEffect(() => {
    fetchCatAndSubCat();
  }, []);
  useEffect(() => {
    if (editData) {
      setShowEditDocument(true);
    }
  }, [editData]);

  // == Document Data ===================================================
  // const [documentData, setDocumentData] = useState<DocumentType>([]);
  const [page, setPage] = useState<number>(1);

  const search = filterDocument?.search;

  const {
    data,
    totalPages,
    error,
    isLoading,
    refetch: fetchDocument,
  } = useGet<DocumentType>('/document/getDocumentAdmin', {
    params: {
      page,
      search: search && search.length > 0 ? search : undefined,
      filter: filterDocument?.filter,
      filterValue: filterDocument?.filterValue,
    },
    useEffectDependencies: [page, filterDocument, search],
    debounceTime: 1000,
  });

  const documentData = data || [];
  const errorMessage = error?.message;

  console.log({ filterDocument });

  // == Context Value ===================================================
  const Context = {
    showAddDocument,
    setShowAddDocument,
    showEditDocument,
    setShowEditDocument,
    editData,
    setEditData,
    filter,
    setFilter,
    filterDocument,
    setFilterDocument,
    useCatAndSubCat: {
      categoryAndSubCategory,
      setCategoryAndSubCategory,
      isError,
      setIsError,
      fetchCatAndSubCat,
    },
    useDocument: {
      documentData,
      page,
      setPage,
      totalPages,
      isLoading,
      errorMessage,
      fetchDocument,
    },
  };

  if (isError) {
    return (
      <Fragment>
        <div className="mt-[-80px] flex h-screen items-center justify-center">
          Page Error, Please Refresh
        </div>
      </Fragment>
    );
  }

  return (
    <ProviderContext.Provider value={Context}>
      {children}
    </ProviderContext.Provider>
  );
}

const ProviderContext = createContext<undefined | ProviderType>(undefined);

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within an ProviderContext');
  }
  return context;
};

type ProviderType = {
  showAddDocument: boolean;
  setShowAddDocument: Dispatch<SetStateAction<boolean>>;
  showEditDocument: boolean;
  setShowEditDocument: Dispatch<SetStateAction<boolean>>;
  editData: any;
  setEditData: Dispatch<any>;
  filter: FilterProps | null;
  setFilter: Dispatch<SetStateAction<FilterProps | null>>;
  filterDocument: FilterDocumentProps | null;
  setFilterDocument: Dispatch<SetStateAction<FilterDocumentProps | null>>;
  useCatAndSubCat: {
    categoryAndSubCategory: {
      category: any[];
      subCategory: any[];
    };
    setCategoryAndSubCategory: Dispatch<
      SetStateAction<{
        category: any[];
        subCategory: any[];
      }>
    >;
    isError: boolean;
    setIsError: Dispatch<SetStateAction<boolean>>;
    fetchCatAndSubCat: () => Promise<void>;
  };
  useDocument: {
    documentData: DocumentType;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    totalPages: number;
    isLoading: boolean;
    errorMessage: string | undefined;
    fetchDocument: () => Promise<any>;
  };
};

type DocumentType = (Document & {
  subCategory: Subcategory;
  category: Category;
  video: Video;
  _count: {
    userDocuments: number;
  };
})[];

interface FilterProps {
  type: 'option' | 'input';
  filter: string;
  value: string;
}

interface FilterDocumentProps {
  filter: string;
  filterValue: string;
  search: string;
}
