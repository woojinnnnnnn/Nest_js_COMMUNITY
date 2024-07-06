import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UsersModule } from 'src/users/user.module';
import { JwtStrtegy } from './jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrtegy],
  exports: [AuthService],
})
export class AuthModule {}
