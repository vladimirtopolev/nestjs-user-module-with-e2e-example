import { CreateUserDto } from '../../../src/modules/users/user.dto';
import * as faker from 'faker';

export const createUser = ():CreateUserDto =>({
  firstName: faker.name.firstName(),
  email: faker.internet.email(),
});