export interface IItemProperty {
  id: number;
  name: string;
}

export interface IItem {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  properties: IItemProperty[];
}

export type IItemPropertyCreate = Pick<IItemProperty, 'name'>;
export type IItemCreate = Pick<IItem, 'name' | 'description'> & { properties: IItemPropertyCreate[] };
export type IItemUpdate = Partial<Pick<IItem, 'name' | 'description'>>;
