
import { Users, Book, Clock, UserCheck } from "lucide-react";

// Sample data for charts
export const subjectDistributionData = [
  { name: "Mathematics", teachers: 12 },
  { name: "Science", teachers: 9 },
  { name: "Languages", teachers: 15 },
  { name: "Social Studies", teachers: 8 },
  { name: "Arts", teachers: 6 },
  { name: "Physical Education", teachers: 4 },
];

export const ratioData = [
  { name: "Junior Classes", ratio: 1.2 },
  { name: "Middle Classes", ratio: 1.5 },
  { name: "Senior Classes", ratio: 1.8 },
];

export const workloadData = [
  { name: "Under 15 hrs", value: 8, color: "#8B5CF6" },
  { name: "15-20 hrs", value: 15, color: "#60A5FA" },
  { name: "21-25 hrs", value: 10, color: "#F59E0B" },
  { name: "Over 25 hrs", value: 5, color: "#EF4444" },
];

export const performanceData = [
  { month: "Jan", score: 75 },
  { month: "Feb", score: 78 },
  { month: "Mar", score: 82 },
  { month: "Apr", score: 79 },
  { month: "May", score: 85 },
  { month: "Jun", score: 88 },
];

// Define icon names for the summary cards
export const summaryCardsData = [
  {
    title: "Total Teachers",
    value: "38",
    description: "Active teaching staff",
    iconName: "Users",
    trend: "+2 this month",
    trendUp: true,
    color: "border-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Subjects Covered",
    value: "16",
    description: "Across all departments",
    iconName: "Book",
    trend: "+1 this month",
    trendUp: true,
    color: "border-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    title: "Avg. Weekly Hours",
    value: "21.5",
    description: "Per teacher",
    iconName: "Clock",
    trend: "Same as last month",
    trendUp: null,
    color: "border-amber-500",
    bgColor: "bg-amber-500/10"
  },
  {
    title: "Performance Score",
    value: "82%",
    description: "Average rating",
    iconName: "UserCheck",
    trend: "+3% this month",
    trendUp: true,
    color: "border-emerald-500",
    bgColor: "bg-emerald-500/10"
  },
];
