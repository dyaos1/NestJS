import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { LocalStrategy } from './auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/module/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: 'secret_key_spark',
      signOptions: {
        expiresIn: '1m',
      },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}