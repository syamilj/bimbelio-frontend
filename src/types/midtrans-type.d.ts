import { Transaction } from './database';

export type MidtransTransaction = Omit<
  Transaction,
  'item_details' | 'status' | 'transaction_details'
> & {
  item_details: {
    id: string;
    price: number;
    quantity: number;
    name: string;
    brand: string;
  }[];
  transaction_details: {
    order_id?: string;
    gross_amount?: number;
  };
  // status: TransactionStatus;
};
