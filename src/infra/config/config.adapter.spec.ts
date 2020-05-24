import { ConfigService } from '@nestjs/config';
import { ConfigAdapter } from './config.adapter';

const makeConfigService = (): ConfigService => {
  class ConfigServiceStub extends ConfigService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get(propertyPath: string, defaultValue?: any): string {
      return 'test';
    }
  }

  return new ConfigServiceStub();
};

interface SutTypes {
  configStub: ConfigService,
  configAdapter: ConfigAdapter
}

const makeSut = (): SutTypes => {
  const configStub = makeConfigService();
  return {
    configStub,
    configAdapter: new ConfigAdapter(configStub),
  };
};

describe('Config Adapter', () => {
  test('Should call get with correct value', async () => {
    const {
      configAdapter,
      configStub,
    } = makeSut();
    const configSpy = jest.spyOn(configStub, 'get');
    configAdapter.get<string>('NODE_ENV');
    expect(configSpy).toHaveBeenCalledWith('NODE_ENV', undefined);
  });


  test('Should return NODE_ENV on success', async () => {
    const {
      configAdapter,
    } = makeSut();
    const nodeEnv = configAdapter.get<string>('NODE_ENV');
    expect(nodeEnv).toBe('test');
  });
});
