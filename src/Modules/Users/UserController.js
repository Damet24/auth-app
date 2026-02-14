import { z } from 'zod';
import { UserService } from './UserService.js';
import { userRepository } from '../../Domain/Repositories/index.js';

const service = new UserService();

export async function listUsers(request, response) {
  const users = await service.listUsers(request.user);
  return response.send(users);
}
