
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { School, Search, Edit, Trash2, Eye, UserCog, BarChart, Filter } from "lucide-react";

export const SchoolsList = () => {
  // Sample schools data
  const schools = [
    {
      id: "1",
      name: "Riverside Elementary",
      location: "Nairobi, Kenya",
      type: "Primary",
      students: 478,
      teachers: 32,
      status: "active"
    },
    {
      id: "2",
      name: "Highland Secondary School",
      location: "Mombasa, Kenya",
      type: "Secondary",
      students: 762,
      teachers: 45,
      status: "active"
    },
    {
      id: "3",
      name: "Valley Middle School",
      location: "Kisumu, Kenya",
      type: "Middle",
      students: 345,
      teachers: 26,
      status: "active"
    },
    {
      id: "4",
      name: "Mountain View Academy",
      location: "Nakuru, Kenya",
      type: "Secondary",
      students: 580,
      teachers: 38,
      status: "inactive"
    },
    {
      id: "5",
      name: "Lakeview Primary",
      location: "Eldoret, Kenya",
      type: "Primary",
      students: 412,
      teachers: 28,
      status: "active"
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search schools..." 
              className="pl-10 pr-4 py-2 text-sm rounded-md w-full border border-input bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <School className="h-4 w-4 mr-2" />
              Add School
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Teachers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.location}</TableCell>
                  <TableCell>{school.type}</TableCell>
                  <TableCell>{school.students.toLocaleString()}</TableCell>
                  <TableCell>{school.teachers}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      school.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="View School">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit School">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Manage Teachers">
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="View Metrics">
                        <BarChart className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
