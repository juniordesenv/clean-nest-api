import {
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { validCNPJ } from '~/presentation/validators/is-cnpj';
import { validCPF } from '~/presentation/validators/is-cpf';

export function IsCPFCNPJ(validationOptions?: ValidationOptions) {
  return function validate(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCPFCNPJ',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return validCPF(value) || validCNPJ(value);
        },
        defaultMessage(): string {
          return 'Documento inválido';
        },
      },
    });
  };
}
