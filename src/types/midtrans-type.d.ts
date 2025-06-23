import { Transaction } from './database';

export type MidtransTransaction = Omit<
  Transaction,
  'item_details' | 'status'
> & {
  item_details: {
    id: string;
    price: number;
    quantity: number;
    name: string;
    brand: string;
  }[];
  // status: TransactionStatus;
};
