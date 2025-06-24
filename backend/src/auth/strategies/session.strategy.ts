import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionStrategy extends PassportStrategy(Strategy, 'session') {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'emailOrUsername',
        });
    }

    async validate(emailOrUsername: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(emailOrUsername, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }
}