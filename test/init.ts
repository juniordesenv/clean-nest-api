
import { MailerService } from '@nestjs-modules/mailer';
import { getModelToken } from '@nestjs/mongoose';
import redis from 'redis-mock';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { AppModule } from '../src/app.module';
import { ValidationPipe422 } from '../src/infra/validation/validation-pipe';
import { User } from '../src/infra/db/mongodb/models/user.model';

let app: INestApplication;

const mockMailerService = {
  sendMail: async () => new Promise((resolve) => resolve()),
};

export const defaultBeforeAll = async () => {
  await redis.createClient();
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailerService)
    .useValue(mockMailerService)
    .compile();


  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe422({
    transform: true,
  }));
  await app.init();

  const usersCollection: ReturnModelType<typeof User> = app.get(getModelToken('User'));

  await usersCollection.deleteMany({});
  const user = await usersCollection.create({
    name: 'Test name',
    email: 'test@test.com',
    password: '123456',
    confirmToken: 'ea88bb91-de7b-48d3-a538-acf4e91f0e61',
    verifiedEmail: true,
  });

  return { app, usersCollection, user };
};
