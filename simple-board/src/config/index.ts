import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

console.log(`${process.env.NODE_ENV}`); // NODE_ENV 잘 되는지 확인ㅇㅇ
export default ({} = {}) =>
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV}`,
    // envFilePath: `.env.local`,
    load: [configuration],
  });
