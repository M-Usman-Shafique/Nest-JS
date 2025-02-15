import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateToken(user: User): string {
    return this.jwtService.sign(
      { id: user.id, username: user.username, email: user.email },
      {
        expiresIn: '1d',
      },
    );
  }

  private setTokenCookie(res: Response, token: string): void {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 60 * 60 * 24 * 1000,
    });
  }

  private clearJwt(res: Response): void {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
  }
  async create(createUserDto: CreateUserDto, res: Response) {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists.');
    }

    const user = this.userRepo.create(createUserDto);
    await this.userRepo.save(user);

    const token = this.generateToken(user);
    this.setTokenCookie(res, token);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      token,
    };
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token = this.generateToken(user);
    this.setTokenCookie(res, token);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      token,
    };
  }

  logout(res: Response): void {
    this.clearJwt(res);
    res.status(200).json({ message: 'Logged out successfully.' });
  }

  async deleteUser(id: number, res: Response): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.userRepo.remove(user);
    this.clearJwt(res);

    return { message: 'User deleted successfully.' };
  }
}
