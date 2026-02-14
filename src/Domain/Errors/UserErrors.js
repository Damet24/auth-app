import { AppError } from './AppError.js';

export class UserAlreadyExists extends AppError {
  constructor() {
    super('Bad Request', 400, 'BAD_REQUEST');
  }
}
