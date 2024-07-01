import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import { SignUpRequestDto } from 'src/users/dtos/signup.req.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
      constructor (private readonly authRepository: AuthRepository) {}

      async signUp(body: SignUpRequestDto) {
            const { email, nickName, password } = body;
            const isExistUser = await this.authRepository.findUserByEmail(email)

            if(isExistUser) {
                  throw new UnauthorizedException(`${email} is Already Exists..`)
            }
            const isExistNickName = await this.authRepository.findUserByNickName(nickName)
            
            if(isExistNickName) {
                  throw new UnauthorizedException(`${nickName} is Already Exists`)
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.authRepository.createUser({
                  email,
                  nickName,
                  password: hashedPassword
            })
            return user.readOnlyData
      }
}
