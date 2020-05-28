import { Test } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from '@nestjs/mongoose';
import { UserMongoRepository } from '~/infra/db/mongodb/users/user-mongo.repository';
import { AppModule } from '~/app.module';
import { ConfirmEmailUserModel } from '~/domain/usecases/user/confirm-email.interface';
import { User } from '~/infra/db/mongodb/models/user.model';

describe('User Mongo Repository', () => {
  let userMongoRepository: UserMongoRepository;
  let usersCollection: ReturnModelType<typeof User>;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
      providers: [
      ],
      controllers: [],
    }).compile();

    userMongoRepository = moduleFixture.get<UserMongoRepository>(UserMongoRepository);
    usersCollection = moduleFixture.get(getModelToken('User'));
    await usersCollection.deleteMany({});
  });

  it('Should return an user on add success', async () => {
    const user = await userMongoRepository.add({
      name: 'valid_name',
      username: 'valid_username',
      email: 'valid_email@mail.com',
      password: '123456',
      passwordConfirmation: '123456',
      confirmToken: '1234',
      verifiedEmail: false,
    });

    expect(user).toBeTruthy();
    expect(user._id).toBeTruthy();
    expect(user.name).toBe('valid_name');
    expect(user.email).toBe('valid_email@mail.com');
    expect(user.password).toBe('123456');
    expect(user.confirmToken).toBe('1234');
    expect(user.verifiedEmail).toBe(false);
  });


  it('Should return true if verifiedEmail is updated on success', async () => {
    await usersCollection.create({
      name: 'any_name',
      email: 'any_email@mail.com',
      username: 'any_username',
      password: 'any_password',
      confirmToken: '1234',
      verifiedEmail: true,
    });
    const data: ConfirmEmailUserModel = { confirmToken: '1234' };
    const confirmed = await userMongoRepository.confirmEmailByToken(data);

    expect(confirmed).toBe(true);
  });

  it('Should return false if token not found', async () => {
    const data: ConfirmEmailUserModel = { confirmToken: '123456' };
    const confirmed = await userMongoRepository.confirmEmailByToken(data);

    expect(confirmed).toBe(false);
  });

  test('Should return an user on loadByEmailOrUsername success', async () => {
    await usersCollection.create({
      name: 'any_name',
      email: 'any_email@mail.com',
      username: 'any_username',
      password: 'any_password',
      confirmToken: '1234',
      verifiedEmail: true,
    });
    const user = await userMongoRepository.loadByEmailOrUsername('any_email@mail.com');
    expect(user).toBeTruthy();
    expect(user._id).toBeTruthy();
    expect(user.name).toBe('any_name');
    expect(user.email).toBe('any_email@mail.com');
    expect(user.username).toBe('any_username');
    expect(user.password).toBe('any_password');
  });


  test('Should return null if loadByEmailOrUsername fails', async () => {
    const user = await userMongoRepository.loadByEmailOrUsername('any_email@mail.com');
    expect(user).toBeFalsy();
  });
});
