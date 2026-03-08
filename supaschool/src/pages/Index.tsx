
import React from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { TodayWidgets } from "@/components/dashboard/TodayWidgets";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AIRecommendations } from "@/components/dashboard/AIRecommendations";
import { SchoolInfo } from "@/components/dashboard/SchoolInfo";
import { Facilities } from "@/components/dashboard/Facilities";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { Contacts } from "@/components/dashboard/Contacts";
import { Announcements } from "@/components/dashboard/Announcements";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { useSchools } from "@/hooks/useSchools";
import { useDashboardSnapshot } from "@/hooks/useDashboard";

export default function Index() {
  const today = new Date().toISOString().split("T")[0];
  const { data: schools } = useSchools();
  const { data: snapshot } = useDashboardSnapshot({ date: today });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in pb-40">
        <div className="flex flex-col gap-2 bg-gradient-primary p-6 rounded-lg shadow-soft border border-primary/10">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-white/80 max-w-2xl">
            View school statistics, important announcements, and AI-powered insights to help manage your school effectively.
          </p>
        </div>

        <div className="col-span-12">
          <TodayWidgets snapshot={snapshot ?? undefined} />
        </div>

        <div className="col-span-12">
          <SummaryStats snapshot={snapshot ?? undefined} schoolCount={schools?.length} />
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <SchoolInfo
              name="Kangemi Primary School"
              county="Westlands County"
              totalStudents={12567}
              teacherCount={7}
              classCount={12}
              location="Nairobi, Westlands, Kangemi Ward"
              phone={["+245 123 4567", "+245 123 4567"]}
              email="hello@Kangemi.com"
              website="Kangemiprimary.com"
            />
            <Facilities />
            <QuickActions />
          </div>
          
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <AIInsightsPanel />
            <Announcements />
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <AIRecommendations />
            <MiniCalendar />
            <Contacts />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
