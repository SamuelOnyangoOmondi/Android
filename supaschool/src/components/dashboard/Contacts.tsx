
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  avatar?: string;
  letter: string;
}

export function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Teachers");
  
  const teachers: Teacher[] = [
    { 
      id: "1", 
      name: "Bessie Cooper", 
      subjects: ["Maths", "Eng", "Sci", "Phy"],
      letter: "A"
    },
    { 
      id: "2", 
      name: "Ahmad Dokidis", 
      subjects: ["Maths", "Eng", "Sci", "Phy"],
      letter: "A"
    },
    { 
      id: "3", 
      name: "Annette Black", 
      subjects: ["Maths", "Eng", "Sci", "Phy"],
      letter: "A" 
    },
    { 
      id: "4", 
      name: "Bessie Cooper", 
      subjects: ["Maths", "Eng", "Sci", "Phy"],
      letter: "B" 
    },
    { 
      id: "5", 
      name: "Brooklyn Simmons", 
      subjects: ["Maths", "Eng", "Sci", "Phy"],
      letter: "B" 
    },
    { 
      id: "6", 
      name: "Cameron Williamson", 
      subjects: ["Maths", "Eng", "Sci", "Phy"],
      letter: "C" 
    },
    { 
      id: "7", 
      name: "Cody Fisher", 
      subjects: ["Maths", "Eng", "Sci", "Phy"],
      letter: "C" 
    }
  ];
  
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group teachers by first letter
  const groupedTeachers: Record<string, Teacher[]> = {};
  filteredTeachers.forEach(teacher => {
    if (!groupedTeachers[teacher.letter]) {
      groupedTeachers[teacher.letter] = [];
    }
    groupedTeachers[teacher.letter].push(teacher);
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-1">Contacts</h2>
      <p className="text-sm text-gray-600 mb-4">
        To send notification to specific teachers, you can filter them out by subject, grade, or level using @. For example, @Math, @English, @Grade1, @Grade2, @ECD
      </p>
      
      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">Change Category</label>
        <Select 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Teachers">Teachers</SelectItem>
            <SelectItem value="Students">Students</SelectItem>
            <SelectItem value="Parents">Parents</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search @..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {Object.keys(groupedTeachers).sort().map(letter => (
          <div key={letter}>
            <div className="text-sm font-semibold text-gray-500 mb-2">{letter}</div>
            
            {groupedTeachers[letter].map(teacher => (
              <div key={teacher.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={teacher.avatar} />
                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{teacher.name}</div>
                    <div className="flex gap-2 text-xs">
                      {teacher.subjects.map((subject, idx) => (
                        <span key={idx} className="text-gray-500">{subject}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {teacher.id === "3" || teacher.id === "6" ? (
                  <div className="bg-gray-200 text-xs px-1 py-0.5 rounded">+4</div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
