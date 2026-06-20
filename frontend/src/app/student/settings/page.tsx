"use client";

import ProfileSettings from '@/components/features/settings/ProfileSettings';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavItems } from '@/hooks/useNavItems';

export default function StudentSettingsPage() {
  const navItems = useNavItems();

  return (
    <DashboardLayout navItems={navItems} title="Account Settings">
      <ProfileSettings />
    </DashboardLayout>
  );
}
