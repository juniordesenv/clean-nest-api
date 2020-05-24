import {
  ValidationPipe, ArgumentMetadata, BadRequestException, UnprocessableEntityException,
} from '@nestjs/common';


export class ValidationPipe422 extends ValidationPipe {
  // eslint-disable-next-line consistent-return
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        const err: any = e.getResponse();
        if (typeof err === 'string') {
          throw new UnprocessableEntityException(err);
        } else {
          throw new UnprocessableEntityException(err.message);
        }
      }
      throw e;
    }
  }
}
