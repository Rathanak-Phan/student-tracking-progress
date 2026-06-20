import { 
  HomeIcon,
  BookOpenIcon,
  ClipboardIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  PresentationChartLineIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from "@/context/AuthContext";

export const useNavItems = () => {
  const { user } = useAuth();

  if (user?.role === 'student') {
    return [
      { name: "Dashboard", href: "/student", icon: HomeIcon },
      { name: "My Classes", href: "/classes", icon: BookOpenIcon },
      { name: "Assignments", href: "/student/assignments", icon: ClipboardIcon },
      { name: "Progress", href: "/student/progress", icon: ChartBarIcon },
      { name: "Messages", href: "/student/messages", icon: ChatBubbleLeftRightIcon },
      { name: "Notifications", href: "/student/notifications", icon: BellIcon },
      { name: "Settings", href: "/student/settings", icon: Cog6ToothIcon },
    ];
  }
  
  if (user?.role === 'teacher') {
    return [
      { name: "Dashboard", href: "/teacher", icon: HomeIcon },
      { name: "My Classes", href: "/classes", icon: BookOpenIcon },
      { name: "Assignments", href: "/teacher/assignments", icon: ClipboardIcon },
      { name: "Students", href: "/teacher/students", icon: UsersIcon },
      { name: "Messages", href: "/teacher/messages", icon: ChatBubbleLeftRightIcon },
      { name: "Notifications", href: "/teacher/notifications", icon: BellIcon },
      { name: "Settings", href: "/teacher/settings", icon: Cog6ToothIcon },
    ];
  }

  if (user?.role === 'admin') {
    return [
      { name: "Dashboard", href: "/admin", icon: HomeIcon },
      { name: "Users", href: "/admin/users", icon: UsersIcon },
      { name: "Verification", href: "/admin/verification", icon: AcademicCapIcon },
      { name: "Classes", href: "/admin/classes", icon: BookOpenIcon },
      { name: "Assignments", href: "/admin/assignments", icon: ClipboardIcon },
      { name: "Analytics", href: "/admin/analytics", icon: PresentationChartLineIcon },
      { name: "Logs", href: "/admin/logs", icon: DocumentMagnifyingGlassIcon },
      { name: "Notifications", href: "/admin/notifications", icon: BellIcon },
      { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
    ];
  }

  return [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "About", href: "/about", icon: InformationCircleIcon },
  ];
};
