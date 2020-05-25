import { validate } from 'class-validator';
import { ConfirmEmailUserDto } from './confirm-email-user.dto';


describe('ConfirmEmailUser DTO', () => {
  test('Should call AddUserDto with one error', async () => {
    const model = new ConfirmEmailUserDto();
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
  });

  test('Should call AddUserDto with confirmToken is empty', async () => {
    const model = new ConfirmEmailUserDto();
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('confirmToken');
    expect(errors[0].constraints.isNotEmpty).toBeTruthy();
  });


  test('Should call AddUserDto with confirmToken is invalid uuid', async () => {
    const model = new ConfirmEmailUserDto();
    model.confirmToken = '1234';
    const errors = await validate(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].property).toEqual('confirmToken');
    expect(errors[0].constraints.isUuid).toBeTruthy();
  });

  test('Should call AddUserDto with correct values', async () => {
    const model = new ConfirmEmailUserDto();
    model.confirmToken = '60e5f5d4-eec8-4fc1-b583-ef0d774dd8ce';
    const errors = await validate(model);
    expect(errors.length).toEqual(0);
  });
});
