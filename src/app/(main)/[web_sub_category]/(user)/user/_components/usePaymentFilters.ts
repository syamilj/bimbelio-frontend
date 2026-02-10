'use client';

import type { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useEffect, useMemo, useRef, useState } from 'react';

type PlanType = PlanDataType;

interface UsePaymentFiltersOptions {
  plans?: PlanType[];
}

export function usePaymentFilters({ plans }: UsePaymentFiltersOptions) {
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'name' | 'price' | 'price-desc' | 'popularity'
  >('name');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Advanced Filter States
  const [selectedPlanTypes, setSelectedPlanTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [filterTabActive, setFilterTabActive] = useState('type');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get min/max price from data
  const priceMinMax = useMemo(() => {
    if (!plans) return { min: 0, max: 5000000 };
    const prices = plans.map((p) => p.price || 0);
    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 5000000),
    };
  }, [plans]);

  // Filter dan Search Logic
  const filteredAndSortedPlans = useMemo(() => {
    if (!plans) return [];

    const filtered = plans.filter((plan) => {
      const searchLower = searchQuery.toLowerCase();
      const planName = plan.name?.toLowerCase() || '';
      const planDescription = plan.description?.toLowerCase() || '';

      const matchesSearch =
        planName.includes(searchLower) || planDescription.includes(searchLower);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(
          plan.PlanSubscription?.WebsiteSubCategory?.id || '',
        );

      let matchesPlanType = true;
      if (selectedPlanTypes.length > 0) {
        if (
          selectedPlanTypes.includes('subscription') &&
          plan.PlanSubscription
        ) {
          matchesPlanType = true;
        } else if (
          selectedPlanTypes.includes('bundle') &&
          plan.PlanSubscription &&
          plan.PlanLimitation
        ) {
          matchesPlanType = true;
        } else if (
          selectedPlanTypes.includes('topping') &&
          !plan.PlanSubscription &&
          plan.PlanLimitation
        ) {
          matchesPlanType = true;
        } else {
          matchesPlanType = false;
        }
      }

      const planPrice = plan.price || 0;
      const matchesPriceRange =
        planPrice >= priceRange[0] && planPrice <= priceRange[1];

      let matchesDuration = true;
      if (selectedDurations.length > 0) {
        const expireDays = plan.PlanSubscription?.expireDays || 0;
        matchesDuration = selectedDurations.some((duration) => {
          if (duration === 'unlimited')
            return expireDays === 0 || !plan.PlanSubscription;
          if (duration === '30') return expireDays >= 1 && expireDays <= 30;
          if (duration === '90') return expireDays >= 31 && expireDays <= 90;
          if (duration === '180') return expireDays >= 91 && expireDays <= 180;
          if (duration === '365') return expireDays >= 181 && expireDays <= 365;
          if (duration === '365+') return expireDays > 365;
          return false;
        });
      }

      let matchesFeatures = true;
      if (selectedFeatures.length > 0) {
        const planFeatures = plan.PlanSubscription?.PlanFeature || [];
        matchesFeatures = selectedFeatures.every((feature) => {
          if (feature === 'video')
            return planFeatures.some((f) => f.type === 'COURSE');
          if (feature === 'document')
            return planFeatures.some((f) => f.type === 'DOCUMENT');
          if (feature === 'tryout') return plan.PlanLimitation?.tryout !== 0;
          if (feature === 'live_class')
            return (
              planFeatures.some((f) => f.type === 'LIVECLASS') ||
              (plan.Pivot_LiveClass_Plan &&
                plan.Pivot_LiveClass_Plan.length > 0)
            );
          return false;
        });
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPlanType &&
        matchesPriceRange &&
        matchesDuration &&
        matchesFeatures
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'popularity':
          return (b.totalUsers || 0) - (a.totalUsers || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    return sorted;
  }, [
    plans,
    searchQuery,
    sortBy,
    selectedCategories,
    selectedPlanTypes,
    priceRange,
    selectedDurations,
    selectedFeatures,
  ]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const togglePlanType = (type: string) => {
    setSelectedPlanTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleDuration = (duration: string) => {
    setSelectedDurations((prev) =>
      prev.includes(duration)
        ? prev.filter((d) => d !== duration)
        : [...prev, duration],
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  const clearPlanTypes = () => setSelectedPlanTypes([]);
  const clearCategories = () => setSelectedCategories([]);
  const clearDurations = () => setSelectedDurations([]);
  const clearFeatures = () => setSelectedFeatures([]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedPlanTypes([]);
    setPriceRange([priceMinMax.min, priceMinMax.max]);
    setSelectedDurations([]);
    setSelectedFeatures([]);
    setSortBy('name');
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedPlanTypes.length +
    selectedDurations.length +
    selectedFeatures.length +
    (priceRange[0] !== priceMinMax.min || priceRange[1] !== priceMinMax.max
      ? 1
      : 0);

  // Click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  return {
    // State
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedCategories,
    selectedPlanTypes,
    selectedDurations,
    selectedFeatures,
    priceRange,
    setPriceRange,
    filterTabActive,
    setFilterTabActive,
    isFilterOpen,
    setIsFilterOpen,
    filterDropdownRef,

    // Computed
    filteredAndSortedPlans,
    activeFiltersCount,
    priceMinMax,

    // Actions
    toggleCategory,
    togglePlanType,
    toggleDuration,
    toggleFeature,
    clearPlanTypes,
    clearCategories,
    clearDurations,
    clearFeatures,
    resetAllFilters,
  };
}

export type PaymentFilters = ReturnType<typeof usePaymentFilters>;
