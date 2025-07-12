"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, Trophy, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "./_components/BasicInfoTab";
import { Contest } from "@/types/contest";
import { ScheduleTab } from "./_components/ScheduleTab";
import { SettingsTab } from "./_components/SettingsTab";
import { ProblemsTab } from "./_components/ProblemsTab";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateContestPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [contest, setContest] = useState<Contest>({
    title: "",
    description: "",
    type: "PUBLIC",
    startTime: "2025-07-12T21:57:31Z",
    endTime: "2025-07-15T21:57:31Z",
    duration: "",
    maxParticipants: "",
    isRated: false,
    penalty: "",
    problemIds: [],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      console.log("Contest Data:", contest);
      // Here you would typically send the data to your backend
      const response = await api.post("/contests/create", contest);
      toast.success("Problem created successfully!");

      setContest({
        title: "",
        description: "",
        type: "PUBLIC",
        startTime: "",
        endTime: "",
        duration: "",
        maxParticipants: "",
        isRated: false,
        penalty: "",
        problemIds: [],
      });
      setActiveTab("basic");
      router.replace("/contests");
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.error("Failed to create problem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabsConfig = [
    { id: "basic", label: "Basic Info", icon: Trophy },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "settings", label: "Settings", icon: Users },
    { id: "problems", label: "Problems", icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-white p-6 dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Create Contest</h1>
          <p className="text-gray-600">
            Set up a new programming contest for participants
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              {tabsConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value="basic" className="space-y-6">
              <BasicInfoTab contest={contest} setContest={setContest} />
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <ScheduleTab contest={contest} setContest={setContest} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SettingsTab contest={contest} setContest={setContest} />
            </TabsContent>

            <TabsContent value="problems" className="space-y-6">
              <ProblemsTab contest={contest} setContest={setContest} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white hover:bg-gray-800"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Contest
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateContestPage;
