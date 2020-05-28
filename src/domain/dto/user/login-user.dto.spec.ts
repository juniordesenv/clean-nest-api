import { validate } from 'class-validator';
import { LoginUserDto } from './login-user.dto';


describe('LoginUser DTO', () => {
  test('Should call LoginUserDto with one error', async () => {
    const model = new LoginUserDto();
    const errors = await validate(model);
    expect(errors.length).toEqual(2);
  });

  test('Should call LoginUserDto with username is empty', async () => {
    const model = new LoginUserDto();
    model.password = '123456';
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('username');
    expect(errors[0].constraints.isNotEmpty).toBeTruthy();
  });


  test('Should call LoginUserDto with password is empty', async () => {
    const model = new LoginUserDto();
    model.username = 'juniordesenv';
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('password');
    expect(errors[0].constraints.isNotEmpty).toBeTruthy();
  });

  test('Should call LoginUserDto with correct values', async () => {
    const model = new LoginUserDto();
    model.username = 'juniordesenv';
    model.password = '123456';
    const errors = await validate(model);
    expect(errors.length).toEqual(0);
  });

  test('Should call LoginUserDto with correct values(email)', async () => {
    const model = new LoginUserDto();
    model.username = 'juniordesenv@email.com.br';
    model.password = '123456';
    const errors = await validate(model);
    expect(errors.length).toEqual(0);
  });
});
