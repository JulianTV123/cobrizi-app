import { IItem, IItemProperty } from "./item.interface";

export interface IRemissionItemProperty {
  id: number;
  item_property_id: number;
  quantity: number;
}

export interface IRemissionItem {
  id: number;
  item_id: number;
  total_quantity: number;
  property_quantities: IRemissionItemProperty[];
}

export interface IRemission {
  id: number;
  consecutive: number;
  date: string;
  status: 'draft' | 'sent';
  user_associate_id: number;
  items: IRemissionItem[];
}

export interface IPropertyRow {
  property: IItemProperty;
  quantity: number;
}

export interface IRemissionRow {
  item: IItem;
  propertyRows: IPropertyRow[];
  total_quantity: number;
}

export type IRemissionItemPropertyCreate = Pick<IRemissionItemProperty, 'item_property_id' | 'quantity'>;
export type IRemissionItemCreate = Pick<IRemissionItem, 'item_id' | 'total_quantity'> & { property_quantities: IRemissionItemPropertyCreate[] };
export type IRemissionCreate = Pick<IRemission, 'date' | 'user_associate_id'> & { items: IRemissionItemCreate[] };
export type IRemissionUpdate = Partial<Pick<IRemission, 'date' | 'status'>>;

