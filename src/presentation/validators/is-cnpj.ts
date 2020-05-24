import {
  ValidationOptions,
  registerDecorator,
} from 'class-validator';


const DIVISOR = 11;
const CNPJ_WEIGHTS = [
  [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
];

function calculateDigit(number: string, digit = 1): string {
  let sum = 0;
  const weights = CNPJ_WEIGHTS[digit - 1];

  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < number.length; index++) {
    // eslint-disable-next-line radix
    sum += parseInt(number[index]) * weights[index];
  }
  const restDivision = sum % DIVISOR;
  if (restDivision < 2) {
    return '0';
  }

  return String(DIVISOR - restDivision);
}

function calculateFirstDigit(number: string): string {
  return calculateDigit(number);
}

function calculateSecondDigit(number: string): string {
  return calculateDigit(number, 2);
}

export const validCNPJ = (value: string) => {
  if (!value) return false;
  if (typeof value !== 'string') return false;
  const _cnpj = value.replace(/\D/g, '');
  const _cnpjSet = new Set(_cnpj.split(''));
  if (_cnpj.length !== 14 || _cnpjSet.size === 1) {
    return false;
  }

  const firstPart = _cnpj.substring(0, 12);
  const secondPart = _cnpj.substring(0, 13);
  const firstDigit = _cnpj[12];
  const secondDigit = _cnpj[13];

  if (firstDigit === calculateFirstDigit(firstPart)
    && secondDigit === calculateSecondDigit(secondPart)) {
    return true;
  }

  return false;
};

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function validate(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCNPJ',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return validCNPJ(value);
        },
        defaultMessage(): string {
          return 'Documento inválido';
        },
      },
    });
  };
}
