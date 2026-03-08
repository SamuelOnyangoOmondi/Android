
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from "date-fns";

interface CalendarEvent {
  date: Date;
  title: string;
  startTime: string;
  endTime: string;
  type: string;
}

export function MiniCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Simple events for demo
  const events: CalendarEvent[] = [
    {
      date: new Date(2023, 2, 19), // March 19, 2023
      title: "Morning assembly",
      startTime: "08:00 AM",
      endTime: "08:30 AM",
      type: "assembly"
    },
    {
      date: new Date(2023, 2, 19), // March 19, 2023
      title: "Homeroom/advisory period",
      startTime: "8:30am",
      endTime: "9:00am",
      type: "homeroom"
    },
    {
      date: new Date(2023, 2, 19), // March 19, 2023
      title: "Core subject 2 (e.g. English)",
      startTime: "10:00am",
      endTime: "11:00am",
      type: "subject"
    },
    {
      date: new Date(2023, 2, 19), // March 19, 2023
      title: "Specialization subject 2 (e.g. Physical education)",
      startTime: "12:20pm",
      endTime: "1:20pm",
      type: "physical"
    }
  ];
  
  const getDayClasses = (day: Date) => {
    const isToday = isSameDay(day, new Date());
    const isSelected = isSameDay(day, selectedDate);
    const hasEvents = events.some(event => isSameDay(event.date, day));
    
    if (isSelected) return "bg-[#7E308E] text-white rounded-full";
    if (isToday) return "bg-gray-200 rounded-full";
    if (hasEvents) return "font-bold";
    return "";
  };
  
  const todayEvents = events.filter(event => 
    isSameDay(event.date, selectedDate)
  );

  const getEventStyle = (type: string) => {
    switch(type) {
      case "assembly": return "bg-yellow-100 border-l-2 border-yellow-400";
      case "homeroom": return "bg-green-100 border-l-2 border-green-400";
      case "subject": return "bg-blue-100 border-l-2 border-blue-400";
      case "physical": return "bg-orange-100 border-l-2 border-orange-400";
      default: return "bg-gray-100 border-l-2 border-gray-400";
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex gap-1">
            <button 
              onClick={prevMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((day, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(day)}
              className={`h-8 w-8 flex items-center justify-center text-sm ${
                isSameMonth(day, currentMonth)
                  ? getDayClasses(day)
                  : "text-gray-300"
              }`}
            >
              {format(day, "d")}
            </button>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-4">
          {todayEvents.length > 0 ? (
            todayEvents.map((event, index) => (
              <div key={index} className="flex flex-col">
                <div className="text-sm text-gray-500">
                  {event.startTime}
                </div>
                <div className={`p-2 mt-1 text-sm ${getEventStyle(event.type)}`}>
                  {event.title}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No events for this day
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
