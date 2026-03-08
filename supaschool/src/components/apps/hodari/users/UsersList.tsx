
import React from "react";
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
import { Search, UserPlus, Filter, Edit, Trash2, UserCog, Mail, Lock } from "lucide-react";

export const UsersList = () => {
  // Sample users data
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      school: "Riverside Elementary",
      status: "active",
      lastLogin: "2 hours ago"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Teacher",
      school: "Riverside Elementary",
      status: "active",
      lastLogin: "1 day ago"
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "Student",
      school: "Highland Secondary School",
      status: "inactive",
      lastLogin: "1 week ago"
    },
    {
      id: "4",
      name: "Mary Williams",
      email: "mary@example.com",
      role: "Teacher",
      school: "Valley Middle School",
      status: "active",
      lastLogin: "3 hours ago"
    },
    {
      id: "5",
      name: "David Brown",
      email: "david@example.com",
      role: "Admin",
      school: "System Wide",
      status: "active",
      lastLogin: "Just now"
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
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 text-sm rounded-md w-full border border-input bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.school}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="Edit User">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Change Role">
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Send Email">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Reset Password">
                        <Lock className="h-4 w-4" />
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
