'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16">
      {/* Hero Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-2xl bg-linear-to-br from-main-default via-[#0077CC] to-[#005599] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

          <CardContent className="relative p-8 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                {/* Status badges skeleton */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Skeleton className="h-8 w-24 bg-white/20" />
                  <Skeleton className="h-8 w-32 bg-white/20" />
                  <Skeleton className="h-8 w-36 bg-white/20" />
                </div>

                {/* Title and description skeleton */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full bg-white/20" />
                    <Skeleton className="h-8 w-3/4 bg-white/20" />
                  </div>
                  <Skeleton className="h-6 w-full bg-white/20" />
                  <Skeleton className="h-6 w-5/6 bg-white/20" />
                </div>

                {/* Pricing skeleton */}
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-baseline gap-3">
                    <Skeleton className="h-12 w-40 bg-white/20" />
                    <Skeleton className="h-6 w-24 bg-white/20" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20 bg-white/20" />
                    <Skeleton className="h-5 w-16 bg-white/20" />
                  </div>
                </div>

                {/* CTA Buttons skeleton */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-14 w-64 bg-white/20" />
                  <Skeleton className="h-14 w-48 bg-white/20" />
                </div>

                {/* Social proof skeleton */}
                <div className="flex items-center gap-8 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="text-center space-y-2"
                    >
                      <Skeleton className="h-8 w-16 bg-white/20 mx-auto" />
                      <Skeleton className="h-4 w-20 bg-white/20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Image skeleton */}
              <div className="relative">
                <Skeleton className="w-full h-96 rounded-3xl bg-white/20" />
                {/* Floating elements skeleton */}
                <Skeleton className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/20" />
                <Skeleton className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content Area Skeleton */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs Skeleton */}
            <div className="w-full mb-8">
              <div className="grid w-full grid-cols-4 gap-2 bg-white/50 backdrop-blur-sm border border-[#B3D9FF]/50 rounded-3xl p-1">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-10 rounded-3xl"
                  />
                ))}
              </div>
            </div>

            {/* Content Area Skeleton */}
            <div className="space-y-8">
              {/* Benefits Grid Skeleton */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-3xl" />
                    <Skeleton className="h-8 w-64" />
                  </div>
                  <Skeleton className="h-6 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="p-6 rounded-3xl bg-[#E6F3FF] border border-[#B3D9FF]/50"
                      >
                        <div className="flex items-start gap-4">
                          <Skeleton className="w-12 h-12 rounded-3xl shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                        </div>
                        <Skeleton className="absolute top-4 right-4 w-6 h-4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Features Overview Skeleton */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-3xl" />
                    <Skeleton className="h-8 w-48" />
                  </div>
                  <Skeleton className="h-6 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-6 rounded-3xl bg-[#E6F3FF] border border-[#B3D9FF]/50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <Skeleton className="w-12 h-12 rounded-3xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          {[1, 2, 3].map((j) => (
                            <div
                              key={j}
                              className="flex items-center gap-2"
                            >
                              <Skeleton className="w-5 h-5 rounded" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live Classes Overview Skeleton */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-3xl" />
                    <Skeleton className="h-8 w-52" />
                  </div>
                  <Skeleton className="h-6 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="p-4 rounded-3xl bg-[#E6F3FF] border border-[#B3D9FF]/50"
                      >
                        <div className="flex items-start gap-3">
                          <Skeleton className="w-10 h-10 rounded-3xl shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-full" />
                            <div className="flex items-center gap-4">
                              <Skeleton className="h-4 w-12" />
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Skeleton className="h-10 w-48 mx-auto" />
                  </div>
                </CardContent>
              </Card>

              {/* Usage Limits Overview Skeleton */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-3xl" />
                    <Skeleton className="h-8 w-44" />
                  </div>
                  <Skeleton className="h-6 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="p-4 rounded-3xl bg-[#E6F3FF] border border-[#B3D9FF]/50 text-center"
                      >
                        <Skeleton className="w-12 h-12 rounded-3xl mx-auto mb-3" />
                        <Skeleton className="h-5 w-16 mx-auto mb-1" />
                        <Skeleton className="h-8 w-12 mx-auto mb-1" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Purchase Card Skeleton */}
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="bg-linear-to-r from-main-default to-[#0077CC] p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32 bg-white/20" />
                  <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <Skeleton className="h-10 w-32 bg-white/20" />
                    <Skeleton className="h-6 w-24 bg-white/20" />
                  </div>
                  <Skeleton className="h-6 w-24 bg-white/20" />
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Plan Details Skeleton */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>

                {/* Action Buttons Skeleton */}
                <div className="space-y-3">
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-10" />
                </div>

                {/* Trust Indicators Skeleton */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="space-y-1"
                      >
                        <Skeleton className="h-6 w-12 mx-auto" />
                        <Skeleton className="h-3 w-10 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Skeleton */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between"
                  >
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
