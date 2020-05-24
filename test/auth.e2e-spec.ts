/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { defaultBeforeAll } from './init';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const result = await defaultBeforeAll();
    app = result.app;
  });

  it('Should return 201 if user is created and success message', () => request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      name: 'Test name',
      email: 'jr.miranda@outlook.com',
      password: '123456',
      passwordConfirmation: '123456',
    })
    .expect(201)
    .expect('Cadastro efetuado com sucesso!'));

  it('Should return 422 if not name in body', () => request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      email: 'jr.miranda@outlook.com',
      password: '123456',
      passwordConfirmation: '123456',
    })
    .expect(422));

  it('Should return 422 if not email in body', () => request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      name: 'Test name',
      password: '123456',
      passwordConfirmation: '123456',
    })
    .expect(422));


  it('Should return 422 if not password in body', () => request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      name: 'Test name',
      email: 'jr.miranda@outlook.com',
      passwordConfirmation: '123456',
    })
    .expect(422));


  it('Should return 422 if not passwordConfirmation in body', () => request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      name: 'Test name',
      email: 'jr.miranda@outlook.com',
      password: '123456',
    })
    .expect(422));

  it('Should return 400 if email dupliced', () => request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      name: 'Test name',
      email: 'jr.miranda@outlook.com',
      password: '123456',
      passwordConfirmation: '123456',
    })
    .expect(400)
    .expect({ statusCode: 400, message: 'Email já cadastrado' }));
});
