import { Role } from 'src/user/entities/model';

export interface IUser {
  id: string;
  email: string;
  role: Role;
}
