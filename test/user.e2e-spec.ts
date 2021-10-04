import { TestingModule, Test } from '@nestjs/testing';
import { rootMongooseTestModule } from './utils/mongodb-in-memory';
import { User, UserDocument } from '../src/modules/users/user.schema';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserModule } from '../src/modules/users/user.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { convertDBRecord2JSON } from './utils/convertDBRecord2JSON';
import { createUser } from './utils/population/user.populator';
import { omit } from 'lodash';

describe('Users REST API', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        UserModule,
      ],
    }).compile();

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    app = module.createNestApplication();
    await app.init();
  });

  describe('POST', () => {
    it('successful save new user', async () => {
      const newUser = createUser();
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201);

      const responseUser = response.body;
      const userDbRecord = await userModel.findById(responseUser._id);
      expect(responseUser).toMatchObject(convertDBRecord2JSON(userDbRecord));
      expect(newUser).toMatchObject(omit(responseUser, '_id', '__v'));
    });
  });

  describe('GET', () => {
    const USER_COUNT = 10;
    beforeEach(async () => {
      // populate some users
      await userModel.bulkWrite(
        Array.from({ length: USER_COUNT })
          .map(() => ({ insertOne: { document: createUser() } })),
      );
    });

    it('successful extraction all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body.length).toBe(USER_COUNT);
    });
  });
});
