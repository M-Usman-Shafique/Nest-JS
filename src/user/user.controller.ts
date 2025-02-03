import {
  Controller,
  Post,
  Body,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  Res,
  Delete,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.userService.create(createUserDto, res);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(409).json({ message: 'User already exists.' });
      }
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const result = await this.userService.login(
        loginUserDto.email,
        loginUserDto.password,
        res,
      );
      return res.status(200).json(result);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        return res.status(401).json({ message: error.message });
      }
      throw error;
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    console.log('Logout call...');
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    // res.cookie('jwt', '', {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    //   expires: new Date(0),
    // });
    
    return res.status(200).json({ message: 'Logged out successfully.' });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Res() res: Response) {
    try {
      await this.userService.deleteUser(id, res);
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }
      throw error;
    }
  }
}
