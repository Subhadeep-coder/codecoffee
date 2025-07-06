"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/axios";
import { ProfileHeader } from "@/components/dashboard/profile-header";
import { StatsCards } from "@/components/dashboard/stats-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentSubmissions } from "@/components/dashboard/recent-submissions";
import { ProgressSection } from "@/components/dashboard/progress-section";
import { AchievementsBadges } from "@/components/dashboard/achievements-badges";
import type { User, DashboardStats } from "@/types/user";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTokens, setUser, user, isAuthenticated, checkAuthStatus } =
    useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const accessTokenFromUrl = searchParams.get("accessToken");
        const refreshTokenFromUrl = searchParams.get("refreshToken");

        if (accessTokenFromUrl && refreshTokenFromUrl) {
          setTokens(accessTokenFromUrl, refreshTokenFromUrl);
          router.replace("/dashboard");
          await fetchUserData();
          return;
        }

        if (checkAuthStatus()) {
          await fetchUserData();
        } else {
          router.push("/auth");
        }
      } catch {
        router.push("/auth");
      }
    };

    initializeDashboard();
  }, [searchParams, setTokens, router, checkAuthStatus]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await api.get<User>("/users/profile");
      setUser(userData);
      const stats: DashboardStats = {
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
        joinDate: new Date(userData.createdAt).toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        rank: userData.rank ?? 0,
        totalSolved: userData.solvedProblems ?? 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        totalSubmissions: userData.points,
        acceptanceRate: userData.rating,
        maxStreak: userData.streak,
        currentStreak: userData.streak,
        contestRating: 0,
        contestsParticipated: 0,
        globalRanking: 0,
      };
      setUserStats(stats);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </div>
    );
  }

  if (!userStats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader user={userStats} />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <StatsCards stats={userStats} />
          <ActivityChart />
          <RecentSubmissions />
        </div>
        <div className="space-y-8">
          <ProgressSection stats={userStats} />
          <AchievementsBadges />
        </div>
      </div>
    </div>
  );
}
