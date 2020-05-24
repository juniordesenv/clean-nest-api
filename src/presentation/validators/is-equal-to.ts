import {
  ValidationOptions,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

export function IsEqualTo(property: string, validationOptions?: ValidationOptions) {
  return function validate(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions || {
        message: `Value is not equal to ${property}`,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}
