'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// import { toaster } from "@/components/ui/toaster";
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { Pricing } from '@/types/database';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const [data, setData] = useState<
    {
      id: string;
      slug: string;
      title: string;
      createdAt: Date;
      updatedAt: Date;
      price: number;
    }[]
  >([]);

  const [verifyModal, setVerifyModal] = useState<{
    show: boolean;
    productId: string | null;
    currentPrice: number | null;
    newPrice: number | null;
  }>({
    show: false,
    productId: null,
    currentPrice: null,
    newPrice: null,
  });

  // const {
  //   data: pricing,
  //   // isLoading: pricingIsLoading,
  //   refetch,
  // } = api.pricing.getAllPricing.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  // });

  const [pricing, setPricing] = useState<Pricing[]>([]);

  const getAllPricing = async () => {
    await getGeneral('/pricing/getAllPricing', {
      setData: setPricing,
    });
  };

  useEffect(() => {
    getAllPricing();
  }, []);

  // const { mutateAsync: updatePricing, isPending: updatePricingIsLoading } =
  //   api.pricing.updatePricing.useMutation();

  const [isLoadingUpdatePricing, setIsLoadingUpdatePricing] =
    useState<boolean>(false);
  const updatePricing = async (payload: any) => {
    const data = await mutateGeneral('/pricing/updatePricing', {
      payload,
      type: 'put',
      setLoading: setIsLoadingUpdatePricing,
    });
    return data;
  };

  useEffect(() => {
    if (pricing) {
      setData(pricing);
    }
  }, [pricing]);

  const handleUpdatePrice = (
    productId: string,
    newPrice: number,
    currentPrice: number,
  ) => {
    setVerifyModal({ show: true, productId, newPrice, currentPrice });
  };

  const handleConfirmUpdate = async () => {
    if (verifyModal.productId !== null && verifyModal.newPrice !== null) {
      await updatePricing({
        price: verifyModal.newPrice,
        slug: verifyModal.productId,
      });
      getAllPricing();
    }
    setVerifyModal({
      show: false,
      productId: null,
      newPrice: null,
      currentPrice: null,
    });
  };

  const handleCancelUpdate = () => {
    setVerifyModal({
      show: false,
      productId: null,
      newPrice: null,
      currentPrice: null,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Admin Pricing Page</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Slug</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>New Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricing &&
            data?.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{product.slug}</TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>
                  Rp.{' '}
                  {pricing[index].price.toLocaleString('id-ID', {
                    style: 'decimal',
                  })}
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={
                      product.price.toString().length > 0
                        ? new Intl.NumberFormat('id-ID').format(
                            parseInt(
                              product.price.toString().replace(/\D/g, ''),
                            ),
                          )
                        : ''
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\./g, '');
                      const price = parseFloat(rawValue);
                      if (isNaN(price)) {
                        setData((prev) =>
                          prev.map((item) => {
                            if (item.id === product.id) {
                              return {
                                ...item,
                                price: 0,
                              };
                            }
                            return item;
                          }),
                        );
                        return;
                      }
                      setData((prev) =>
                        prev.map((item) => {
                          if (item.id === product.id) {
                            return {
                              ...item,
                              price: parseInt(rawValue),
                            };
                          }
                          return item;
                        }),
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleUpdatePrice(
                        product.slug,
                        product.price,
                        pricing[index].price,
                      )
                    }
                  >
                    Update Price
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog
        open={isLoadingUpdatePricing ? true : verifyModal.show}
        onOpenChange={(open) => {
          setVerifyModal((prev) => ({ ...prev, show: open }));
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Price Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the price?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelUpdate}
            >
              Cancel
            </Button>
            <Button
              className="min-w-[90px] flex justify-center items-center"
              disabled={isLoadingUpdatePricing}
              onClick={handleConfirmUpdate}
            >
              {isLoadingUpdatePricing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
