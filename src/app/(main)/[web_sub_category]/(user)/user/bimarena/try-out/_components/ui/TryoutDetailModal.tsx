'use client';

import { IconTailedArrowUp45 } from '@/styles/icon';
import { CheckCircle, Eye, Play } from 'lucide-react';
import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';
import type { CardTryoutProps } from './card-tryout';
import RegistrationProofModal from './registration-proof-modal';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';

interface TryoutDetailModalProps {
  showDetail: CardTryoutProps;
  setShowDetail: Dispatch<SetStateAction<CardTryoutProps | null>>;
  handleRegistration: (isPremium?: boolean, couponCode?: string) => Promise<void>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  mainColor: string;
  secondaryColor: string;
  isTesting: boolean;
}

export function TryoutDetailModal({
  showDetail,
  setShowDetail,
  handleRegistration,
  isLoading,
  setIsLoading,
  mainColor,
  secondaryColor,
  isTesting,
}: TryoutDetailModalProps) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => setShowDetail(null)}
      />
      <div
        id="register-tryout-modal"
        className="relative w-[calc(100%-2rem)] max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="p-6 lg:p-8">
          {!showDetail.isRegistered ? (
            <RegistrationProofModal
              showDetail={showDetail}
              setShowDetail={setShowDetail}
              onRegistrationComplete={handleRegistration}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : (
            /* Registered State */
            <div className="text-center space-y-6">
              <div
                className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sudah Terdaftar!
                </h2>
                <p className="text-gray-600">
                  Kamu sudah terdaftar untuk try out ini
                </p>
              </div>

              <Link
                href={
                  isTesting
                    ? `/${showDetail.WebsiteSubCategory?.id || website_sub_category_id}/admin/tryout/testing/try-out/${showDetail.id}`
                    : `/${showDetail.WebsiteSubCategory?.id || website_sub_category_id}/user/bimarena/try-out/${showDetail.id}`
                }
                className="inline-flex items-center gap-2 w-full h-12 justify-center rounded-3xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                {showDetail.isDone && showDetail.isJoin ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Lihat Hasil</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Mulai Try Out</span>
                  </>
                )}
                <IconTailedArrowUp45 w={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
