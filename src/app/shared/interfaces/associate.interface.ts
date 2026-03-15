export interface IAssociate {
  id: number;
  name: string;
  id_number?: string;
  address?: string;
  email?: string;
  user_id?: number;
}

export type IAssociateCreate = Omit<IAssociate, 'id'>;
export type IAssociateUpdate = Partial<IAssociateCreate>;
