import {
  ValidationOptions,
  registerDecorator,
} from 'class-validator';


export const validCPF = (value:any) => {
  if (!value) return false;
  const cpf = value.replace(/\D/g, '');
  if (cpf.toString().length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let result = true;
  [9, 10].forEach((j) => {
    let soma = 0;
    let r: any;
    cpf.split(/(?=)/).splice(0, j).forEach((e, i) => {
      // eslint-disable-next-line radix
      soma += parseInt(e) * ((j + 2) - (i + 1));
    });
    r = soma % 11;
    r = (r < 2) ? 0 : 11 - r;
    // eslint-disable-next-line eqeqeq
    if (r != cpf.substring(j, j + 1)) result = false;
  });
  return result;
};

export function IsCPF(validationOptions?: ValidationOptions) {
  return function validate(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return validCPF(value);
        },
        defaultMessage(): string {
          return 'Documento inválido';
        },
      },
    });
  };
}
