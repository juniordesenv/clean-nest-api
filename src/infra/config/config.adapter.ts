import { ConfigService } from '@nestjs/config';
import { Config } from '~/data/interfaces/config/config.interface';


export class ConfigAdapter implements Config {
  constructor(
    private readonly configService: ConfigService,
  ) { }

  get<T = any>(propertyPath: string, defaultValue?: T): T | undefined {
    return this.configService.get<T>(propertyPath, defaultValue);
  }
}
