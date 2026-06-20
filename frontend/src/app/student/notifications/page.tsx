"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';
import NotificationsPage from '@/components/features/notifications/NotificationsPage';

export default function StudentNotificationsRoute() {
  const navItems = useNavItems();

  return (
    <DashboardLayout navItems={navItems} title="Notifications">
      <NotificationsPage />
    </DashboardLayout>
  );
}
