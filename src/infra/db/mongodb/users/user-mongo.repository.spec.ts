import { Test } from '@nestjs/testing';
import { UserMongoRepository } from '~/infra/db/mongodb/users/user-mongo.repository';
import { AppModule } from '~/app.module';

describe('User Mongo Repository', () => {
  let userMongoRepository: UserMongoRepository;

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
  });

  it('Should return an user on add success', async () => {
    const user = await userMongoRepository.add({
      name: 'valid_name',
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
});
