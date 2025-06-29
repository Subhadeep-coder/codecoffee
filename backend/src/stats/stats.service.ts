import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getUserStats(userId: string) {

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                rating: true,
                points: true,
                streak: true,
                lastSolved: true,
                createdAt: true
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Get submission statistics
        const submissionStats = await this.prisma.submission.groupBy({
            by: ['status'],
            where: { userId },
            _count: { id: true }
        });

        // Get problem difficulty stats
        const difficultyStats: any = await this.prisma.$queryRaw`
      SELECT 
        p.difficulty,
        COUNT(DISTINCT p.id) as solved
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ${userId} AND s.status = 'ACCEPTED'
      GROUP BY p.difficulty
    `;

        // Total problems solved
        const solvedGroups = await this.prisma.submission.groupBy({
            by: ['problemId'],
            where: {
                userId,
                status: 'ACCEPTED',
            },
            _count: { problemId: true },
        });

        const totalSolved = solvedGroups.length;

        // Total submissions
        const totalSubmissions = await this.prisma.submission.count({
            where: { userId }
        });

        // Recent submission
        const recentSubmission = await this.prisma.submission.findFirst({
            where: { userId },
            orderBy: { submittedAt: 'desc' },
            include: {
                problem: {
                    select: { title: true, slug: true, difficulty: true }
                }
            }
        });

        // Contest stats
        const contestStats = await this.prisma.contestParticipation.aggregate({
            where: { userId },
            _count: { id: true },
            _avg: { rank: true },
            _sum: { score: true }
        });

        const statCard = {
            user,
            stats: {
                totalSolved,
                totalSubmissions,
                acceptanceRate: totalSubmissions > 0 ? ((totalSolved / totalSubmissions) * 100).toFixed(1) : 0,
                ranking: await this.getUserRanking(userId),
                difficultyBreakdown: {
                    easy: difficultyStats.find(d => d.difficulty === 'EASY')?.solved || 0,
                    medium: difficultyStats.find(d => d.difficulty === 'MEDIUM')?.solved || 0,
                    hard: difficultyStats.find(d => d.difficulty === 'HARD')?.solved || 0
                },
                submissionStats: submissionStats.reduce((acc, stat) => {
                    acc[stat.status.toLowerCase()] = stat._count.id;
                    return acc;
                }, {}),
                contestStats: {
                    participated: contestStats._count.id,
                    averageRank: contestStats._avg.rank ? Math.round(contestStats._avg.rank) : null,
                    totalScore: contestStats._sum.score || 0
                },
                recentSubmission
            }
        };

        return statCard;
    }

    async getActivityChart(userId: string, days: string = "365") {

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get daily submission counts
        const dailyActivity: any = await this.prisma.$queryRaw`
      SELECT 
        DATE(submitted_at) as date,
        COUNT(*) as submissions,
        COUNT(CASE WHEN status = 'ACCEPTED' THEN 1 END) as accepted
      FROM submissions
      WHERE user_id = ${userId} 
        AND submitted_at >= ${startDate}
      GROUP BY DATE(submitted_at)
      ORDER BY date ASC
    `;

        // Fill in missing dates with zero counts
        const activityMap = new Map<string, any>();
        dailyActivity.forEach(day => {
            activityMap.set(day.date.toISOString().split('T')[0], {
                submissions: parseInt(day.submissions),
                accepted: parseInt(day.accepted)
            });
        });

        const activityChart: { date: string, submissions: any, accepted: any }[] = [];
        for (let i = parseInt(days) - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            activityChart.push({
                date: dateStr,
                submissions: activityMap.get(dateStr)?.submissions || 0,
                accepted: activityMap.get(dateStr)?.accepted || 0
            });
        }

        return activityChart;
    }

    async getUserProgress(userId: string) {

        const totalProblems = await this.prisma.problem.groupBy({
            by: ['difficulty'],
            where: { isPublished: true },
            _count: { id: true }
        });

        const solvedProblems: any = await this.prisma.$queryRaw`
      SELECT 
        p.difficulty,
        COUNT(DISTINCT p.id) as solved
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ${userId} AND s.status = 'ACCEPTED'
      GROUP BY p.difficulty
    `;

        const progressData = {
            easy: {
                solved: solvedProblems.find(p => p.difficulty === 'EASY')?.solved || 0,
                total: totalProblems.find(p => p.difficulty === 'EASY')?._count.id || 0
            },
            medium: {
                solved: solvedProblems.find(p => p.difficulty === 'MEDIUM')?.solved || 0,
                total: totalProblems.find(p => p.difficulty === 'MEDIUM')?._count.id || 0
            },
            hard: {
                solved: solvedProblems.find(p => p.difficulty === 'HARD')?.solved || 0,
                total: totalProblems.find(p => p.difficulty === 'HARD')?._count.id || 0
            }
        };

        // Calculate percentages
        Object.keys(progressData).forEach(difficulty => {
            const data = progressData[difficulty];
            data.percentage = data.total > 0 ? ((data.solved / data.total) * 100).toFixed(1) : 0;
        });

        return { progress: progressData };
    }

    async getAchievementBadges(userId: string) {

        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Get various stats for badge calculations
        const solvedProblemGroups = await this.prisma.submission.groupBy({
            by: ['problemId'],
            where: {
                userId,
                status: 'ACCEPTED',
            },
        });

        const totalSolved = solvedProblemGroups.length;

        const contestsParticipated = await this.prisma.contestParticipation.count({
            where: { userId }
        });

        const discussionsCreated = await this.prisma.discussion.count({
            where: { authorId: userId }
        });

        const problemsCreated = await this.prisma.problem.count({
            where: { createdBy: userId, isPublished: true }
        });

        // Calculate badges
        const badges: { name: string, description: string, icon: string, earned: boolean }[] = [];

        // Problem solving badges
        if (totalSolved >= 1) badges.push({ name: 'First Blood', description: 'Solved your first problem', icon: '🎯', earned: true });
        if (totalSolved >= 10) badges.push({ name: 'Problem Solver', description: 'Solved 10 problems', icon: '💡', earned: true });
        if (totalSolved >= 50) badges.push({ name: 'Code Warrior', description: 'Solved 50 problems', icon: '⚔️', earned: true });
        if (totalSolved >= 100) badges.push({ name: 'Century Club', description: 'Solved 100 problems', icon: '💯', earned: true });
        if (totalSolved >= 500) badges.push({ name: 'Legend', description: 'Solved 500 problems', icon: '👑', earned: true });

        // Streak badges
        if (user.streak >= 7) badges.push({ name: 'Week Warrior', description: '7-day solving streak', icon: '🔥', earned: true });
        if (user.streak >= 30) badges.push({ name: 'Consistency King', description: '30-day solving streak', icon: '⭐', earned: true });

        // Contest badges
        if (contestsParticipated >= 1) badges.push({ name: 'Competitor', description: 'Participated in first contest', icon: '🏆', earned: true });
        if (contestsParticipated >= 10) badges.push({ name: 'Contest Regular', description: 'Participated in 10 contests', icon: '🎪', earned: true });

        // Community badges
        if (discussionsCreated >= 1) badges.push({ name: 'Discussion Starter', description: 'Started your first discussion', icon: '💬', earned: true });
        if (discussionsCreated >= 10) badges.push({ name: 'Community Helper', description: 'Started 10 discussions', icon: '🤝', earned: true });

        // Problem creator badges
        if (problemsCreated >= 1) badges.push({ name: 'Problem Creator', description: 'Created your first problem', icon: '🔨', earned: true });
        if (problemsCreated >= 5) badges.push({ name: 'Problem Master', description: 'Created 5 problems', icon: '🎨', earned: true });

        // Rating badges
        if (user.rating >= 1200) badges.push({ name: 'Rising Star', description: 'Reached 1200 rating', icon: '🌟', earned: true });
        if (user.rating >= 1500) badges.push({ name: 'Expert', description: 'Reached 1500 rating', icon: '🔥', earned: true });
        if (user.rating >= 1800) badges.push({ name: 'Master', description: 'Reached 1800 rating', icon: '💎', earned: true });

        return badges;
    }

    async getRecentSubmissions(userId: string, limit: string = "10") {

        const recentSubmissions = await this.prisma.submission.findMany({
            where: { userId },
            orderBy: { submittedAt: 'desc' },
            take: parseInt(limit),
            include: {
                problem: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        difficulty: true
                    }
                }
            }
        });

        return recentSubmissions;
    }

    async getUserRanking(userId: string) {
        try {
            const userRating = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { rating: true }
            });

            if (!userRating) return null;

            const rank = await this.prisma.user.count({
                where: {
                    rating: {
                        gt: userRating.rating
                    }
                }
            });

            return rank + 1;
        } catch (error) {
            console.error('Error calculating user ranking:', error);
            return null;
        }
    }

}
