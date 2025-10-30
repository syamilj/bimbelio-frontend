// src/components/_shared/other/card-plan/_components/render-benefit.tsx

'use client';

import { Gift } from 'lucide-react';
import { useProvider } from '../_provider/provider';

export const RenderBenefitTab = () => {
  const {
    useData: { plan },
  } = useProvider();

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-linear-to-r from-pink-50 to-rose-50 rounded-lg">
        <Gift
          size={24}
          className="mx-auto mb-2 text-pink-600"
        />
        <h4 className="text-sm font-semibold text-pink-800 mb-2">
          Semua Keuntungan
        </h4>
        <p className="text-xs text-pink-600">
          {plan.PlanBenefit.length} benefit eksklusif yang akan Kamu dapatkan
        </p>
      </div>

      <div className="space-y-3">
        {plan.PlanBenefit.map((benefit, index) => (
          <div
            key={benefit.id}
            className={`p-4 rounded-lg border-l-4 ${
              index % 3 === 0
                ? 'bg-linear-to-r from-yellow-50 to-orange-50 border-yellow-500'
                : index % 3 === 1
                  ? 'bg-linear-to-r from-blue-50 to-purple-50 border-blue-500'
                  : 'bg-linear-to-r from-green-50 to-teal-50 border-green-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index % 3 === 0
                      ? 'bg-yellow-500 text-white'
                      : index % 3 === 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                  }`}
                >
                  {benefit.order}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800 mb-2">
                  {benefit.title}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
