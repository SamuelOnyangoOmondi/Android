
import React from "react";
import { MapPin, Phone, Mail, Edit } from "lucide-react";

interface SchoolInfoProps {
  name: string;
  county: string;
  totalStudents: number;
  teacherCount: number;
  classCount: number;
  location: string;
  phone: string[];
  email: string;
  website?: string;
  onEdit?: () => void;
}

export function SchoolInfo({
  name,
  county,
  totalStudents,
  teacherCount,
  classCount,
  location,
  phone,
  email,
  website,
  onEdit,
}: SchoolInfoProps) {
  return (
    <div className="mb-8 p-5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-gray-500">{county}</p>
        </div>
        {onEdit && (
          <button 
            onClick={onEdit} 
            className="text-sm text-gray-600 flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-sm hover:shadow-md transition-all"
          >
            <Edit size={14} />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Total Students</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-2xl font-bold">{teacherCount.toString().padStart(2, '0')}</div>
          <div className="text-gray-600 text-sm">ECD Teachers</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-2xl font-bold">{classCount.toString().padStart(2, '0')}</div>
          <div className="text-gray-600 text-sm">ECD Classes</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm">
          <MapPin size={20} className="text-[#7E308E] mt-1" />
          <div className="text-gray-700">{location}</div>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm">
          <Phone size={20} className="text-[#7E308E] mt-1" />
          <div className="flex flex-wrap gap-4">
            {phone.map((p, i) => (
              <div key={i} className="text-gray-700">{p}</div>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm">
          <Mail size={20} className="text-[#7E308E] mt-1" />
          <div className="text-gray-700">
            <span>{email}</span>
            {website && (
              <>, <a href={`https://${website}`} className="text-blue-600 underline hover:text-blue-800 transition-colors">{website}</a></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
