import { validate } from 'class-validator';
import { AddUserDto } from './add-user.dto';


describe('AddUser DTO', () => {
  test('Should call AddUserDto with four errors', async () => {
    const model = new AddUserDto();
    const errors = await validate(model);
    expect(errors.length).toEqual(4);
  });

  test('Should call AddUserDto with name is empty', async () => {
    const model = new AddUserDto();
    model.email = 'jr.miranda@outlook.com';
    model.password = '123456';
    model.passwordConfirmation = '123456';
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('name');
    expect(errors[0].constraints.isNotEmpty).toBeTruthy();
  });

  test('Should call AddUserDto with name is empty and expect error', async () => {
    const model = new AddUserDto();
    model.email = 'jr.miranda@outlook.com';
    model.password = '123456';
    model.passwordConfirmation = '123456';
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('name');
    expect(errors[0].constraints.isNotEmpty).toBeTruthy();
  });

  test('Should call AddUserDto with email is empty and expect error', async () => {
    const model = new AddUserDto();
    model.name = 'Junior Miranda';
    model.password = '123456';
    model.passwordConfirmation = '123456';
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('email');
    expect(errors[0].constraints.isNotEmpty).toBeTruthy();
  });

  test('Should call AddUserDto with passwod is empty and expect error', async () => {
    const model = new AddUserDto();
    model.name = 'Junior Miranda';
    model.email = 'jr.miranda@outlook.com';
    const errors = await validate(model);
    expect(errors.length).toEqual(2);
    expect(errors[0].property).toEqual('password');
    expect(errors[0].constraints.isNotEmpty).toBeTruthy();
  });


  test('Should call AddUserDto with passwordConfirmation is empty and expect error', async () => {
    const model = new AddUserDto();
    model.name = 'Junior Miranda';
    model.email = 'jr.miranda@outlook.com';
    model.password = '123456';
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('passwordConfirmation');
    expect(errors[0].constraints.isNotEmpty).toBeTruthy();
    expect(errors[0].constraints.isEqualTo).toBeTruthy();
  });

  test('Should call AddUserDto with invalid email and expect error', async () => {
    const model = new AddUserDto();
    model.name = 'Junior Miranda';
    model.email = 'jr.miranda';
    model.password = '123456';
    model.passwordConfirmation = '123456';
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('email');
    expect(errors[0].constraints.isEmail).toBeTruthy();
  });


  test('Should call AddUserDto with invalid passwordConfirmation and expect error', async () => {
    const model = new AddUserDto();
    model.name = 'Junior Miranda';
    model.email = 'jr.miranda@outlook.com';
    model.password = '123456';
    model.passwordConfirmation = '1234567';
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('passwordConfirmation');
    expect(errors[0].constraints.isEqualTo).toBeTruthy();
  });


  test('Should call AddUserDto with correct values', async () => {
    const model = new AddUserDto();
    model.name = 'Junior Miranda';
    model.email = 'jr.miranda@outlook.com';
    model.password = '123456';
    model.passwordConfirmation = '123456';
    const errors = await validate(model);
    expect(errors.length).toEqual(0);
  });
});
