import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuard as CustomAuthGuard } from './guards/auth.guard';
import { Request, Response } from 'express';
import { LinkProviderDto, RegisterDto } from './dto';
import { CurrentUser } from 'src/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const user = await this.authService.register(registerDto);

    // Log in the user after registration
    return new Promise((resolve, reject) => {
      req.logIn(user, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            message: 'Registration successful',
            user,
          });
        }
      });
    });
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: any) {
    return {
      message: 'Login successful',
      user,
    };
  }

  @Post('logout')
  @UseGuards(CustomAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    return new Promise((resolve) => {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ message: 'Logout failed' });
        }

        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ message: 'Session destruction failed' });
          }

          res.clearCookie('connect.sid'); // Default session cookie name
          res.json({ message: 'Logout successful' });
          resolve(null);
        });
      });
    });
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {
    console.log('=== GOOGLE AUTH CONTROLLER ===');
    console.log('Request received for /auth/google');
    console.log('Session ID:', req.sessionID);
    console.log('Is Authenticated:', req.isAuthenticated());
    console.log('==============================');
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.findOrCreateGoogleUser(req.user);

    return new Promise((resolve) => {
      req.logIn(user, (err) => {
        if (err) {
          return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
        }

        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
        resolve(null);
      });
    });
  }

  @Get('me')
  @UseGuards(CustomAuthGuard)
  async getMe(@CurrentUser() user: any) {
    return this.authService.getUserWithAccounts(user.id);
  }

  @Post('link-provider')
  @UseGuards(CustomAuthGuard)
  async linkProvider(
    @CurrentUser() user: any,
    @Body() linkProviderDto: LinkProviderDto,
  ) {
    await this.authService.linkProvider(user.id, linkProviderDto);
    return { message: 'Provider linked successfully' };
  }

  @Delete('unlink-provider/:provider')
  @UseGuards(CustomAuthGuard)
  async unlinkProvider(
    @CurrentUser() user: any,
    @Param('provider') provider: string,
  ) {
    await this.authService.unlinkProvider(user.id, provider);
    return { message: 'Provider unlinked successfully' };
  }

  @Get('status')
  async getAuthStatus(@Req() req: Request) {
    return {
      isAuthenticated: req.isAuthenticated(),
      user: req.user || null,
    };
  }
}