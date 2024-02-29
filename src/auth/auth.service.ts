import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { User } from 'src/user/entities/user.entity';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(user: IUser) {
    const tokens = {
      token: await this.jwtService.signAsync(
        { id: user.id, email: user.email, role: user.role },
        {
          expiresIn: '15m',
          secret: process.env.JWT_SECRET,
        },
      ),
      refreshToken: await this.jwtService.signAsync(
        { id: user.id, email: user.email, role: user.role },
        {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_SECRET,
        },
      ),
    };
    return tokens;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    const passwordIsMatch = await argon2.verify(user.password, password);
    if (user && passwordIsMatch) {
      return user;
    }
    throw new UnauthorizedException('User or password are incorrect!');
  }

  async login(user: IUser) {
    const { id, email, role } = user;
    return {
      id,
      email,
      role,
      ...(await this.generateTokens(user)),
    };
  }

  async refreshTokens(token: string) {
    const decodedToken = this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const mail = (decodedToken as any).email;

    const user = await this.userService.findOne(mail);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { role, email, id } = user;

    return {
      role,
      email,
      id,
      ...(await this.generateTokens({
        id: `${user.id}`,
        email: user.email,
        role: user.role,
      })),
    };
  }
}
