export interface IInvoiceItem {
  id: number;
  item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface IInvoice {
  id: number;
  consecutive: number;
  date: string;
  total: number;
  total_text: string;
  status: 'draft' | 'sent';
  user_associate_id: number;
  items: IInvoiceItem[];
}

export type IInvoiceItemCreate = Pick<IInvoiceItem, 'item_id' | 'quantity' | 'unit_price'>;
export type IInvoiceCreate = Pick<IInvoice, 'date' | 'user_associate_id'> & { items: IInvoiceItemCreate[] };
export type IInvoiceUpdate = Partial<Pick<IInvoice, 'date' | 'status'>>;
