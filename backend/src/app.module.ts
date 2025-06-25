import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { UsersModule } from './users/users.module';
import { ContestsModule } from './contests/contests.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { JudgeModule } from './judge/judge.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ReviewModule } from './review/review.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProblemsModule,
    UsersModule,
    ContestsModule,
    SubmissionsModule,
    JudgeModule,
    LeaderboardModule,
    ReviewModule,
    NotificationsModule,
    PrismaModule
  ],
})
export class AppModule { }
