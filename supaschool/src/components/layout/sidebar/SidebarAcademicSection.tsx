
import React from "react";
import { SidebarSectionTitle } from "./SidebarSectionTitle";
import { SidebarItem } from "./SidebarItem";
import { BookOpen, Users, GraduationCap, Calendar, FileText, BookCheck, CalendarCheck } from "lucide-react";

export function SidebarAcademicSection({ path, collapsed }: { path: string; collapsed?: boolean }) {
  return (
    <div className="mt-6">
      <SidebarSectionTitle title="Academic" collapsed={collapsed} />
      
      <SidebarItem
        icon={<Users size={16} />}
        label="Students"
        path="/students"
        active={path === "/students"}
        collapsed={collapsed}
      />
      
      <SidebarItem
        icon={<GraduationCap size={16} />}
        label="Teachers"
        path="/teachers"
        active={path === "/teachers"}
        collapsed={collapsed}
      />
      
      <SidebarItem
        icon={<BookOpen size={16} />}
        label="Classes"
        path="/classes"
        active={path === "/classes"}
        collapsed={collapsed}
      />
      
      <SidebarItem
        icon={<CalendarCheck size={16} />}
        label="Attendance"
        path="/attendance"
        active={path === "/attendance"}
        collapsed={collapsed}
      />
      
      <SidebarItem
        icon={<BookCheck size={16} />}
        label="Curriculum"
        path="/curriculum"
        active={path === "/curriculum"}
        collapsed={collapsed}
      />
      
      <SidebarItem
        icon={<FileText size={16} />}
        label="Exams & Grades"
        path="/exams"
        active={path === "/exams"}
        collapsed={collapsed}
      />
      
      <SidebarItem
        icon={<Calendar size={16} />}
        label="Timetable"
        path="/timetable"
        active={path === "/timetable"}
        collapsed={collapsed}
      />
    </div>
  );
}
