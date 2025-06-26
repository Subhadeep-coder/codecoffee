import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { GetUser } from 'src/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  async getProfile(@GetUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('profile')
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}