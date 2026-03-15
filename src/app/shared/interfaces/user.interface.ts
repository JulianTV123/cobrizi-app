export interface IUser {
  id: number;
  name: string;
  id_number: string;
  address?: string;
  phone?: string;
  email: string;
}

export type IUserCreate = Omit<IUser, 'id'> & { password: string };
export type IUserUpdate = Partial<Omit<IUser, 'id'> & { password: string }>;
