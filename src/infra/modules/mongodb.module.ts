
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const MongodbModule = TypegooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    // In running test, NODE ENV always equals test
    /* istanbul ignore next */
    if (configService.get<string>('NODE_ENV') !== 'test') return { uri: configService.get<string>('MONGODB_URI') };
    const mongod = new MongoMemoryServer();
    const uri = await mongod.getConnectionString();
    return {
      uri,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  },
  inject: [ConfigService],
});
