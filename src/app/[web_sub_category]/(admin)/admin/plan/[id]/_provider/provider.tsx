'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

type Props = {
  children: React.ReactNode;
};

export type LimitType = 'chat' | 'notes' | 'tryout' | 'vision' | 'quiz';

type ActiveTabType = {
  limit: boolean;
  feature: boolean;
};

type LimitRowType = {
  id: number;
  type: LimitType;
  limit: string;
}[];

type BenefitRowType = {
  id: string;
  title: string;
  description: string;
  order: number;
}[];

type FormDataType = {
  image: File | undefined;
  previewImage: string;
  name: string;
  tier: string;
  description: string;
  price: string;
  originalPrice: string;
  course: boolean;
  materiPremium: boolean;
  liveClass: boolean;
  liveClassesPerWeek: string;
  duration: string;
  durationLimit: string;
  status: '' | 'DRAFT' | 'PUBLIC' | 'COMING_SOON';
};

export default function Provider({ children }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTabType>({
    feature: false,
    limit: false,
  });

  const [limitRows, setLimitRows] = useState<LimitRowType>([
    { id: 1, type: 'chat', limit: '' },
  ]);

  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [liveClassIds, setLiveClassIds] = useState<
    { label: string; value: string }[]
  >([]);
  const [isCourseActive, setIsCourseActive] = useState<boolean>(false);
  const [isDocumentActive, setIsDocumentActive] = useState<boolean>(false);
  const [isLiveClassActive, setIsLiveClassActive] = useState<boolean>(false);

  const [expireType, setExpireType] = useState<'days' | 'month' | 'year'>(
    'days',
  );

  const [expireTypeLimit, setExpireTypeLimit] = useState<
    'days' | 'month' | 'year'
  >('days');

  const [benefitRows, setBenefitRows] = useState<BenefitRowType>([]);

  const formData = useForm<FormDataType>({
    defaultValues: {
      image: undefined,
      name: '',
      tier: '',
      description: '',
      price: '',
      originalPrice: '',
      course: false,
      materiPremium: false,
      liveClass: false,
      liveClassesPerWeek: '',
      duration: '',
      durationLimit: '',
      status: '',
      previewImage: '',
    },
  });

  const name = formData.watch('name');
  const tier = formData.watch('tier');
  const description = formData.watch('description');
  const price = formData.watch('price');
  const originalPrice = formData.watch('originalPrice');
  const course = formData.watch('course');
  const materiPremium = formData.watch('materiPremium');
  const liveClass = formData.watch('liveClass');
  const liveClassesPerWeek = formData.watch('liveClassesPerWeek');
  const duration = formData.watch('duration');
  const durationLimit = formData.watch('durationLimit');
  const status = formData.watch('status');
  const image = formData.watch('image');
  const previewImage = formData.watch('previewImage');

  const formDataValues = {
    name,
    tier,
    description,
    price,
    originalPrice,
    course,
    materiPremium,
    liveClass,
    liveClassesPerWeek,
    duration,
    durationLimit,
    image,
    status,
    previewImage,
  };

  const Context = {
    activeTab,
    setActiveTab,
    isLoading,
    setIsLoading,
    useBenefit: {
      benefitRows,
      setBenefitRows,
    },
    useLimitation: {
      limitRows,
      setLimitRows,
      expireTypeLimit,
      setExpireTypeLimit,
    },
    useFeature: {
      categoryIds,
      setCategoryIds,
      isCourseActive,
      setIsCourseActive,
      isDocumentActive,
      setIsDocumentActive,
      isLiveClassActive,
      setIsLiveClassActive,
      expireType,
      setExpireType,
      liveClassIds,
      setLiveClassIds,
    },
    useForm: {
      formData,
      formDataValues,
    },
  };

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
  activeTab: ActiveTabType;
  setActiveTab: Dispatch<SetStateAction<ActiveTabType>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  useBenefit: {
    benefitRows: BenefitRowType;
    setBenefitRows: Dispatch<SetStateAction<BenefitRowType>>;
  };
  useLimitation: {
    limitRows: LimitRowType;
    setLimitRows: Dispatch<SetStateAction<LimitRowType>>;
    expireTypeLimit: 'days' | 'month' | 'year';
    setExpireTypeLimit: Dispatch<SetStateAction<'days' | 'month' | 'year'>>;
  };
  useFeature: {
    categoryIds: string[];
    setCategoryIds: Dispatch<SetStateAction<string[]>>;
    isCourseActive: boolean;
    setIsCourseActive: Dispatch<SetStateAction<boolean>>;
    isDocumentActive: boolean;
    setIsDocumentActive: Dispatch<SetStateAction<boolean>>;
    isLiveClassActive: boolean;
    setIsLiveClassActive: Dispatch<SetStateAction<boolean>>;
    expireType: 'days' | 'month' | 'year';
    setExpireType: Dispatch<SetStateAction<'days' | 'month' | 'year'>>;
    liveClassIds: {
      label: string;
      value: string;
    }[];
    setLiveClassIds: Dispatch<
      SetStateAction<
        {
          label: string;
          value: string;
        }[]
      >
    >;
  };
  useForm: {
    formData: UseFormReturn<FormDataType, any, FormDataType>;
    formDataValues: {
      name: string;
      tier: string;
      description: string;
      price: string;
      originalPrice: string;
      course: boolean;
      materiPremium: boolean;
      liveClass: boolean;
      liveClassesPerWeek: string;
      duration: string;
      durationLimit: string;
      image: File | undefined;
      status: '' | 'DRAFT' | 'PUBLIC' | 'COMING_SOON';
      previewImage: string;
    };
  };
};
