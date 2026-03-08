
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

export interface FacilityData {
  icon: React.ReactNode;
  count: string;
  label: string;
  color: string;
  max?: number;
  editable?: boolean;
}

interface FacilityCardProps {
  icon: React.ReactNode;
  count: string;
  label: string;
  color: string;
  max?: number;
  isEditing: boolean;
  onChange?: (count: string, max: number, label: string) => void;
}

export function FacilityCard({ 
  icon, 
  count, 
  label, 
  color, 
  max = 25, 
  isEditing, 
  onChange 
}: FacilityCardProps) {
  const [editCount, setEditCount] = useState(count);
  const [editMax, setEditMax] = useState(max.toString());
  const [editLabel, setEditLabel] = useState(label);

  const colorClasses: Record<string, string> = {
    purple: "text-primary",
    blue: "text-blue-500",
    green: "text-green-500",
    pink: "text-pink-500",
    orange: "text-orange-500",
    yellow: "text-yellow-500"
  };

  const bgColorClasses: Record<string, string> = {
    purple: "bg-primary/10",
    blue: "bg-blue-500/10",
    green: "bg-green-500/10",
    pink: "bg-pink-500/10",
    orange: "bg-orange-500/10",
    yellow: "bg-yellow-500/10"
  };

  const borderColorClasses: Record<string, string> = {
    purple: "border-primary/20",
    blue: "border-blue-500/20",
    green: "border-green-500/20",
    pink: "border-pink-500/20",
    orange: "border-orange-500/20",
    yellow: "border-yellow-500/20"
  };

  const progressColorClasses: Record<string, string> = {
    purple: "bg-primary",
    blue: "bg-blue-500",
    green: "bg-green-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500"
  };

  const handleChange = () => {
    if (onChange) {
      onChange(editCount, parseInt(editMax) || 25, editLabel);
    }
  };

  const countNum = parseInt(count);
  const percentage = max ? (countNum / max) * 100 : 0;

  return (
    <Card className={`border ${borderColorClasses[color]} h-full rounded-lg overflow-hidden transition-all duration-300 hover:shadow-hover shadow-soft bg-white`}>
      <CardContent className="p-4 flex flex-col items-center justify-center h-full">
        <div className={`${bgColorClasses[color]} p-3 rounded-full mb-3 border ${borderColorClasses[color]} shadow-sm`}>
          <div className={`${colorClasses[color]}`}>{icon}</div>
        </div>
        
        {isEditing ? (
          <div className="w-full space-y-2">
            <div className="flex gap-2 w-full">
              <Input 
                value={editCount} 
                onChange={(e) => setEditCount(e.target.value)}
                className="text-center border border-gray-200 shadow-sm"
                type="number"
                min="0"
                onBlur={handleChange}
              />
            </div>
            <Input 
              value={editMax} 
              onChange={(e) => setEditMax(e.target.value)}
              className="text-center text-xs text-gray-500 border border-gray-200 shadow-sm"
              type="number"
              min="1"
              placeholder="Maximum"
              onBlur={handleChange}
            />
            <Input 
              value={editLabel} 
              onChange={(e) => setEditLabel(e.target.value)}
              className="text-center text-sm text-gray-600 border border-gray-200 shadow-sm"
              placeholder="Facility name"
              onBlur={handleChange}
            />
          </div>
        ) : (
          <>
            <div className="text-xl font-bold">{count}</div>
            <div className="text-sm text-gray-600 mb-2 text-center">{label}</div>
            <Progress 
              value={percentage} 
              className="h-1.5 w-full bg-gray-100 border border-gray-200" 
              indicatorClassName={progressColorClasses[color]} 
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
