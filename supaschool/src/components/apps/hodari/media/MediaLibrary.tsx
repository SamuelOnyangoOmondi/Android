
import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Filter, Eye, Edit, Trash2, FileText, Video, Image, FileArchive } from "lucide-react";

export const MediaLibrary = () => {
  // Sample media items
  const mediaItems = [
    {
      id: "1",
      title: "Introduction to Algebra",
      type: "video",
      category: "Mathematics",
      size: "45 MB",
      uploadDate: "2023-08-15",
      lastAccessed: "2023-09-20"
    },
    {
      id: "2",
      title: "Cell Structure Diagram",
      type: "image",
      category: "Biology",
      size: "2.3 MB",
      uploadDate: "2023-07-22",
      lastAccessed: "2023-09-18"
    },
    {
      id: "3",
      title: "World History Timeline",
      type: "document",
      category: "History",
      size: "1.5 MB",
      uploadDate: "2023-09-05",
      lastAccessed: "2023-09-15"
    },
    {
      id: "4",
      title: "Chemistry Experiment Guide",
      type: "document",
      category: "Chemistry",
      size: "3.2 MB",
      uploadDate: "2023-08-30",
      lastAccessed: "2023-09-12"
    },
    {
      id: "5",
      title: "Physics Motion Demonstration",
      type: "video",
      category: "Physics",
      size: "78 MB",
      uploadDate: "2023-09-10",
      lastAccessed: "2023-09-19"
    },
  ];

  // Function to get the appropriate icon based on file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileArchive className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search content..." 
              className="pl-10 pr-4 py-2 text-sm rounded-md w-full border border-input bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Sort By
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mediaItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {getFileIcon(item.type)}
                    {item.title}
                  </TableCell>
                  <TableCell className="capitalize">{item.type}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{new Date(item.uploadDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
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
