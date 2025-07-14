import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ProblemsModule } from './problems/problems.module';
import { ContestsModule } from './contests/contests.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { JudgeModule } from './judge/judge.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ReviewModule } from './review/review.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env.local', '../.env'],
      validationSchema: null,
    }),
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => [
    //     {
    //       name: 'short',
    //       ttl: 1000,
    //       limit: 3,
    //     },
    //     {
    //       name: 'medium',
    //       ttl: 10000,
    //       limit: 20,
    //     },
    //     {
    //       name: 'long',
    //       ttl: 60000,
    //       limit: 100,
    //     },
    //   ],
    // }),
    PrismaModule,
    AuthModule,
    ProblemsModule,
    UsersModule,
    ContestsModule,
    SubmissionsModule,
    JudgeModule,
    LeaderboardModule,
    ReviewModule,
    NotificationsModule,
    StatsModule,
  ],
  providers: [
    // Global rate limiting
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule { }