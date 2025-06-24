import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { SessionSerializer } from './session.serializer';
import { SessionStrategy } from './strategies/session.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    SessionStrategy,
    SessionSerializer,
  ],
})
export class AuthModule { }
