import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  LinkAccountDto,
  ChangePasswordDto,
} from './dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from 'src/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
  ApiParam 
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refresh successful',
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshTokens(@Req() req) {
    return this.authService.refreshTokens(req.user.userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  @ApiResponse({ status: 302, description: 'Redirect to Google login' })
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend with tokens' })
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);
    const redirectUrl = `${process.env.FRONTEND_URL}/dashboard?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
    res.redirect(redirectUrl);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Initiate GitHub OAuth flow' })
  @ApiResponse({ status: 302, description: 'Redirect to GitHub login' })
  async githubAuth() {
    // Initiates GitHub OAuth flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend with tokens' })
  async githubAuthCallback(@Req() req, @Res() res: Response) {
    const result = await this.authService.githubLogin(req.user);
    const redirectUrl = `${process.env.FRONTEND_URL}/dashboard?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
    res.redirect(redirectUrl);
  }

  @Post('link-account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Link a social account to existing user' })
  @ApiBody({ type: LinkAccountDto })
  @ApiResponse({ status: 200, description: 'Account successfully linked' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async linkAccount(
    @GetUser('id') userId: string,
    @Body() linkAccountDto: LinkAccountDto,
  ) {
    return this.authService.linkAccount(userId, linkAccountDto);
  }

  @Delete('unlink-account/:provider')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Unlink a social account from user' })
  @ApiParam({ name: 'provider', enum: ['google', 'github'], description: 'Social provider to unlink' })
  @ApiResponse({ status: 200, description: 'Account successfully unlinked' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unlinkAccount(
    @GetUser('id') userId: string,
    @Param('provider') provider: string,
  ) {
    return this.authService.unlinkAccount(userId, provider);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password successfully changed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req) {
    return req.user;
  }
}