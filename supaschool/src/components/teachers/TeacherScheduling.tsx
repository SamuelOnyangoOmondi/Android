
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "14:00-15:00", "15:00-16:00"];

// Define a type for schedule item
interface ScheduleItem {
  teacher: string;
  subject: string;
  class: string;
}

// Define a type for the day's schedule
interface DaySchedule {
  [timeSlot: string]: ScheduleItem;
}

// Define a type for the entire schedule
interface Schedule {
  [day: string]: DaySchedule;
}

// Sample schedule data
const scheduleData: Schedule = {
  "Monday": {
    "8:00-9:00": { teacher: "John Smith", subject: "Physics", class: "10A" },
    "9:00-10:00": { teacher: "Mary Johnson", subject: "English", class: "11B" },
    "11:00-12:00": { teacher: "David Mwangi", subject: "History", class: "9C" },
    "14:00-15:00": { teacher: "Sarah Ochieng", subject: "Chemistry", class: "12A" },
  },
  "Tuesday": {
    "10:00-11:00": { teacher: "John Smith", subject: "Physics", class: "11B" },
    "12:00-13:00": { teacher: "Mary Johnson", subject: "Literature", class: "10A" },
    "15:00-16:00": { teacher: "James Kiprop", subject: "Physical Education", class: "9C" },
  },
  "Wednesday": {
    "8:00-9:00": { teacher: "Sarah Ochieng", subject: "Biology", class: "10A" },
    "11:00-12:00": { teacher: "John Smith", subject: "Mathematics", class: "12A" },
    "14:00-15:00": { teacher: "David Mwangi", subject: "Geography", class: "11B" },
  },
  "Thursday": {
    "9:00-10:00": { teacher: "Mary Johnson", subject: "English", class: "9C" },
    "10:00-11:00": { teacher: "John Smith", subject: "Physics", class: "11B" },
    "15:00-16:00": { teacher: "Sarah Ochieng", subject: "Chemistry", class: "10A" },
  },
  "Friday": {
    "8:00-9:00": { teacher: "David Mwangi", subject: "History", class: "12A" },
    "12:00-13:00": { teacher: "Mary Johnson", subject: "Literature", class: "11B" },
    "14:00-15:00": { teacher: "James Kiprop", subject: "Physical Education", class: "10A" },
  },
};

const TeacherScheduling: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState("May 1 - May 5, 2023");
  
  const teachers = [
    "All Teachers",
    "John Smith",
    "Mary Johnson",
    "David Mwangi",
    "Sarah Ochieng",
    "James Kiprop"
  ];

  const getCellContent = (day: string, timeSlot: string) => {
    const scheduleItem = scheduleData[day]?.[timeSlot];
    
    if (!scheduleItem) return null;
    
    if (selectedTeacher && selectedTeacher !== "All Teachers" && scheduleItem.teacher !== selectedTeacher) {
      return null;
    }
    
    // Determine class color based on subject for visual differentiation
    const getSubjectColor = (subject: string) => {
      switch (subject.toLowerCase()) {
        case "physics":
        case "chemistry":
        case "mathematics":
          return "bg-primary/20 border-primary/30 text-primary-dark";
        case "biology":  
          return "bg-emerald-500/20 border-emerald-500/30 text-emerald-700";
        case "english":
        case "literature":
          return "bg-blue-500/20 border-blue-500/30 text-blue-700";
        case "history":
        case "geography":
          return "bg-amber-500/20 border-amber-500/30 text-amber-700";
        case "physical education":
          return "bg-green-500/20 border-green-500/30 text-green-700";
        default:
          return "bg-pink-500/20 border-pink-500/30 text-pink-700";
      }
    };
    
    return (
      <div className={`p-2 ${getSubjectColor(scheduleItem.subject)} rounded-md border shadow-sm h-full transition-all hover:shadow-md hover:-translate-y-0.5`}>
        <div className="font-medium truncate">{scheduleItem.subject}</div>
        <div className="text-muted-foreground text-xs truncate">Class: {scheduleItem.class}</div>
        {selectedTeacher === "All Teachers" && (
          <Badge variant="outline" className="mt-1 text-xs truncate max-w-full">
            {scheduleItem.teacher}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-xl border border-primary/10 shadow-card">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 rounded-lg bg-primary/20">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <Select value={selectedTeacher || "All Teachers"} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-[200px] bg-white shadow-sm">
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map(teacher => (
                <SelectItem key={teacher} value={teacher}>
                  {teacher}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="hover:bg-primary/10 shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            {currentWeek}
          </span>
          <Button variant="outline" size="icon" className="hover:bg-primary/10 shadow-sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button className="w-full md:w-auto bg-primary hover:bg-primary-dark shadow-sm">
          <Save className="h-4 w-4 mr-2" />
          Save Schedule
        </Button>
      </div>
      
      <Card className="shadow-card border-gray-100 dark:border-gray-700 overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            {selectedTeacher && selectedTeacher !== "All Teachers" 
              ? `${selectedTeacher}'s Schedule` 
              : "All Teachers Schedule"}
          </CardTitle>
          <CardDescription>
            {selectedTeacher && selectedTeacher !== "All Teachers"
              ? "Manage individual teacher's weekly schedule"
              : "Overview of all teachers' weekly schedules"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 overflow-x-auto">
          <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-1 border rounded-md overflow-hidden shadow-sm min-w-[800px]">
            {/* Time slots column */}
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="h-12 flex items-center justify-center font-medium border-b">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                Time
              </div>
              {timeSlots.map(timeSlot => (
                <div 
                  key={timeSlot} 
                  className="h-20 flex items-center justify-center text-sm border-b last:border-b-0 px-2"
                >
                  {timeSlot}
                </div>
              ))}
            </div>
            
            {/* Day columns */}
            {daysOfWeek.map((day, index) => (
              <div key={day} className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/50 dark:bg-gray-700/50"}>
                <div className="h-12 flex items-center justify-center font-medium border-b border-l bg-gradient-to-r from-primary/5 to-secondary/5">
                  {day}
                </div>
                {timeSlots.map(timeSlot => (
                  <div 
                    key={`${day}-${timeSlot}`} 
                    className="h-20 border-b last:border-b-0 border-l p-1 transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/80"
                  >
                    {getCellContent(day, timeSlot)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherScheduling;
