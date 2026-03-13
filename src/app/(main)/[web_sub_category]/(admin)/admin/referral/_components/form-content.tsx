'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingPageWithText from '@/components/ui/spinner';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { ReferralDiscountType } from '@/types/database';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FormContent() {
  const router = useRouter();
  const [isLoadingMessage, setIsLoadingMessage] = useState<null | string>(null);

  const [discount, setDiscount] = useState(0);
  const [type, setType] = useState<ReferralDiscountType>('PERCENTAGE');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { isLoading: referralDiscountIsLoading } = useGet<{
    discount: number;
    type: ReferralDiscountType;
  }>('/referral/getReferralDiscount', {
    onSuccess: (data) => {
      if (data.data) {
        setDiscount(data.data.discount);
        setType(data.data.type);
      }
    },
  });

  const {
    mutate: updateReferralDiscount,
    isLoading: updateReferralDiscountIsLoading,
  } = useMutation('/referral/updateReferralDiscount', 'put', {
    payload: {
      discount: discount,
      type: type,
    },
  });

  const onSubmit = async () => {
    try {
      await updateReferralDiscount();
      setShowConfirmDialog(false);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      {referralDiscountIsLoading && (
        <LoadingPageWithText
          loading={referralDiscountIsLoading}
          heading="Sedang mengambil data..."
        />
      )}
      {updateReferralDiscountIsLoading && (
        <LoadingPageWithText
          loading={updateReferralDiscountIsLoading}
          heading="Sedang mengupdate data..."
        />
      )}
      <Card className="max-w-2xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowConfirmDialog(true);
          }}
          className="p-6 space-y-6"
        >
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) =>
                  setType(value as ReferralDiscountType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount">Discount Value</Label>
              <Input
                id="discount"
                placeholder="Enter discount value"
                value={discount.toLocaleString('id-ID')}
                onChange={(e) =>
                  setDiscount(
                    parseFloat(e.target.value.replace(/\./g, '')) || 0,
                  )
                }
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!!isLoadingMessage}
            >
              Edit Percentage
            </Button>
          </div>
        </form>
      </Card>

      <AlertDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the referral discount to{' '}
              {discount.toLocaleString('id-ID')}{' '}
              {type === 'PERCENTAGE' ? '%' : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onSubmit}>
              Confirm Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
