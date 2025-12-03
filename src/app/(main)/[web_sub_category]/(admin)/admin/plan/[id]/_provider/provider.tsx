'use client';

import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
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
  roleDiscord: string | undefined;
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
  privateTalk: boolean;
  duration?: string;
  timelineStart?: string;
  timelineEnd?: string;
  durationLimit?: string;
  timelineLimitStart?: string;
  timelineLimitEnd?: string;
  status: '' | 'DRAFT' | 'PUBLIC' | 'COMING_SOON';
  maxUsers?: string;
};
type ValidityType = 'duration' | 'timeline';

type LateFeeType = 'FIXED' | 'PERCENTAGE' | 'NONE';

interface InstallmentSchedule {
  id: string;
  installmentNumber: string;
  daysAfterFirstPayment: string;
  expireDaysAfterFirstPayment: string;
  amount: string;
  description?: string;
  lateFeeType: LateFeeType;
  lateFeeAmount?: string;
  PlanInstallmentScheduleLimitation?: {
    chat: string;
    notes: string;
    vision: string;
    quiz: string;
    tryout: string;
  };
}

interface PlanInstallmentConfig {
  id?: string;
  totalInstallments: string;
  totalAmount: string;
  gracePeriodDays: string;
  isCustomeLimitation: boolean;
  InstallmentSchedules: InstallmentSchedule[];
}

export default function Provider({ children }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTabType>({
    feature: false,
    limit: false,
  });
  const [selectedWebSubCategoryIds, setSelectedWebSubCategoryIds] = useState<
    string[]
  >(website_sub_category_id_params ? [website_sub_category_id_params] : []);

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

  const [validityType, setValidityType] = useState<ValidityType>('duration');
  const [validityTypeLimit, setValidityTypeLimit] =
    useState<ValidityType>('duration');

  const [isInstallmentEnabled, setIsInstallmentEnabled] = useState(false);
  const [installmentConfig, setInstallmentConfig] =
    useState<PlanInstallmentConfig>({
      totalInstallments: '1',
      totalAmount: '0',
      gracePeriodDays: '0',
      isCustomeLimitation: false,
      InstallmentSchedules: [
        {
          id: crypto.randomUUID(),
          installmentNumber: '1',
          daysAfterFirstPayment: '0',
          expireDaysAfterFirstPayment: '0',
          amount: '0',
          description: '',
          lateFeeType: 'NONE',
          lateFeeAmount: '0',
        },
      ],
    });

  const formData = useForm<FormDataType>({
    defaultValues: {
      roleDiscord: undefined,
      image: undefined,
      name: '',
      tier: '',
      description: '',
      price: '',
      originalPrice: '',
      course: false,
      materiPremium: false,
      privateTalk: false,
      liveClass: false,
      liveClassesPerWeek: '',
      duration: '',
      durationLimit: '',
      status: '',
      previewImage: '',
      maxUsers: undefined,
    },
  });

  const name = formData.watch('name');
  const roleDiscord = formData.watch('roleDiscord');
  const tier = formData.watch('tier');
  const description = formData.watch('description');
  const price = formData.watch('price');
  const originalPrice = formData.watch('originalPrice');
  const course = formData.watch('course');
  const materiPremium = formData.watch('materiPremium');
  const privateTalk = formData.watch('privateTalk');
  const liveClass = formData.watch('liveClass');
  const liveClassesPerWeek = formData.watch('liveClassesPerWeek');
  const duration = formData.watch('duration');
  const timelineStart = formData.watch('timelineStart');
  const timelineEnd = formData.watch('timelineEnd');
  const durationLimit = formData.watch('durationLimit');
  const timelineLimitStart = formData.watch('timelineLimitStart');
  const timelineLimitEnd = formData.watch('timelineLimitEnd');
  const status = formData.watch('status');
  const maxUsers = formData.watch('maxUsers');
  const image = formData.watch('image');
  const previewImage = formData.watch('previewImage');

  const {
    alertInstallmentLimitation,
    alertInstallmentTotalAmount,
    limitationMismatches,
    priceDifference,
    totalLimitations,
  } = getInstallmentMatching({ installmentConfig, limitRows, price });

  const formDataValues = {
    roleDiscord,
    name,
    tier,
    description,
    price,
    originalPrice,
    course,
    materiPremium,
    privateTalk,
    liveClass,
    liveClassesPerWeek,
    duration,
    timelineStart,
    timelineEnd,
    durationLimit,
    timelineLimitStart,
    timelineLimitEnd,
    image,
    status,
    previewImage,
    maxUsers,
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
      validityTypeLimit,
      setValidityTypeLimit,
      validityType,
      setValidityType,
    },
    useInstallment: {
      isInstallmentEnabled,
      setIsInstallmentEnabled,
      installmentConfig,
      setInstallmentConfig,
      alertLimitation: alertInstallmentLimitation,
      alertAmount: alertInstallmentTotalAmount,
      dataHelper: {
        limitationMismatches,
        priceDifference,
        totalLimitations,
      },
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
      validityType,
      setValidityType,
      selectedWebSubCategoryIds,
      setSelectedWebSubCategoryIds,
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
    validityTypeLimit: ValidityType;
    setValidityTypeLimit: Dispatch<SetStateAction<ValidityType>>;
  };
  useInstallment: {
    isInstallmentEnabled: boolean;
    setIsInstallmentEnabled: Dispatch<SetStateAction<boolean>>;
    installmentConfig: PlanInstallmentConfig;
    setInstallmentConfig: Dispatch<SetStateAction<PlanInstallmentConfig>>;
    alertLimitation: boolean;
    alertAmount: boolean;
    dataHelper: {
      limitationMismatches: {
        type: string;
        limitRowValue: number;
        totalCiclanValue: number;
      }[];
      priceDifference: number;
      totalLimitations: {
        chat: number;
        notes: number;
        vision: number;
        quiz: number;
        tryout: number;
      } | null;
    };
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
    validityType: ValidityType;
    setValidityType: Dispatch<SetStateAction<ValidityType>>;
    selectedWebSubCategoryIds: string[];
    setSelectedWebSubCategoryIds: Dispatch<SetStateAction<string[]>>;
  };
  useForm: {
    formData: UseFormReturn<FormDataType, any, FormDataType>;
    formDataValues: {
      roleDiscord: string | undefined;
      name: string;
      tier: string;
      description: string;
      price: string;
      originalPrice: string;
      course: boolean;
      materiPremium: boolean;
      privateTalk: boolean;
      liveClass: boolean;
      liveClassesPerWeek: string;
      duration?: string;
      timelineStart?: string;
      timelineEnd?: string;
      durationLimit?: string;
      timelineLimitStart?: string;
      timelineLimitEnd?: string;
      image: File | undefined;
      status: '' | 'DRAFT' | 'PUBLIC' | 'COMING_SOON';
      previewImage: string;
      maxUsers: string | undefined;
    };
  };
};

const getInstallmentMatching = ({
  installmentConfig,
  limitRows,
  price,
}: {
  installmentConfig: PlanInstallmentConfig;
  limitRows: LimitRowType;
  price: string;
}) => {
  const totalLimitations = installmentConfig.isCustomeLimitation
    ? installmentConfig.InstallmentSchedules.reduce(
        (acc, schedule) => {
          const limitation = schedule.PlanInstallmentScheduleLimitation;
          if (limitation) {
            return {
              chat: acc.chat + Number(limitation.chat || 0),
              notes: acc.notes + Number(limitation.notes || 0),
              vision: acc.vision + Number(limitation.vision || 0),
              quiz: acc.quiz + Number(limitation.quiz || 0),
              tryout: acc.tryout + Number(limitation.tryout || 0),
            };
          }
          return acc;
        },
        { chat: 0, notes: 0, vision: 0, quiz: 0, tryout: 0 },
      )
    : null;

  // Validasi limitasi dengan limitRows
  const limitRowsMap = limitRows.reduce(
    (acc, row) => {
      acc[row.type] = Number(row.limit) || 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  const allLimitationTypes = ['chat', 'notes', 'vision', 'quiz', 'tryout'];

  const limitationMismatches = !installmentConfig.isCustomeLimitation
    ? []
    : allLimitationTypes
        .map((type) => {
          const limitRowValue = limitRowsMap[type] ?? 0;
          const totalCiclanValue =
            totalLimitations?.[type as keyof typeof totalLimitations] ?? 0;

          // Ada mismatch jika nilai berbeda
          if (limitRowValue !== totalCiclanValue) {
            return {
              type,
              limitRowValue,
              totalCiclanValue,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

  const alertInstallmentLimitation =
    installmentConfig.isCustomeLimitation && limitationMismatches.length > 0;

  const instalmentTotalAmount = installmentConfig.InstallmentSchedules.reduce(
    (sum, s) => sum + Number(s.amount),
    0,
  );

  const priceDifference = Number(price) - instalmentTotalAmount;
  const alertInstallmentTotalAmount = priceDifference !== 0;

  return {
    alertInstallmentLimitation,
    alertInstallmentTotalAmount,
    limitationMismatches,
    priceDifference,
    totalLimitations,
  };
};
