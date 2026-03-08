
import React from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import HodariAdminDashboard from '@/components/apps/hodari/HodariAdminDashboard';

const Hodari = () => {
  return (
    <DashboardLayout>
      <HodariAdminDashboard />
    </DashboardLayout>
  );
};

export default Hodari;
