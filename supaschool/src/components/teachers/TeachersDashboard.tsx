
import React from "react";
import SummaryCards from "./dashboard/SummaryCards";
import SubjectDistributionChart from "./dashboard/SubjectDistributionChart";
import TeacherStudentRatioChart from "./dashboard/TeacherStudentRatioChart";
import WeeklyWorkloadChart from "./dashboard/WeeklyWorkloadChart";
import PerformanceTrendsChart from "./dashboard/PerformanceTrendsChart";
import { 
  subjectDistributionData, 
  ratioData, 
  workloadData, 
  performanceData, 
  summaryCardsData 
} from "./dashboard/DashboardData";

const TeachersDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-4 bg-primary rounded-lg shadow-soft border border-primary/10 mb-6">
        <h1 className="text-xl font-semibold text-white">Teachers Dashboard</h1>
        <p className="text-white/80 text-sm">Manage and monitor teacher performance, workload, and assignments</p>
      </div>
      
      <SummaryCards cards={summaryCardsData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubjectDistributionChart data={subjectDistributionData} />
        <TeacherStudentRatioChart data={ratioData} />
        <WeeklyWorkloadChart data={workloadData} />
        <PerformanceTrendsChart data={performanceData} />
      </div>
    </div>
  );
};

export default TeachersDashboard;
