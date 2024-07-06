import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from './repositories/user.repository';
import { JwtStrtegy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  controllers: [UsersController],
  providers: [UserService, UserRepository, JwtService, JwtStrtegy],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
