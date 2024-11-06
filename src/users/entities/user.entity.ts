export class User {
  userId: number;
  username: string;
  password: string;
  role: Role;
}

export type Role = 'user' | 'super-user' | 'admin';
