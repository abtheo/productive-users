export class User {
  userId: number;
  username: string;
  password: string;
  role: Role;
}

export enum Role {
  'user',
  'superUser',
  'admin',
}
