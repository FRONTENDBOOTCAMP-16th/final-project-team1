import { createBrowserRouter } from 'react-router-dom'

import LoginPage from '../pages/auth/LoginPage'

import DashboardPage from '../pages/student/dashboard/DashboardPage'
import LeaveListPage from '../pages/student/leave/LeaveListPage'
import LeaveRequestPage from '../pages/student/leave/request/LeaveRequestPage'
import NoticeListPage from '../pages/student/notice/NoticeListPage'
import NoticeDetailPage from '../pages/student/notice/NoticeDetailPage'
import SettingsPage from '../pages/student/settings/SettingsPage'

import AdminDashboardPage from '../pages/admin/dashboard/DashboardPage'
import LectureListPage from '../pages/admin/lecture/LectureListPage'
import LectureCreatePage from '../pages/admin/lecture/create/LectureCreatePage'
import LectureEditPage from '../pages/admin/lecture/LectureEditPage'
import StudentListPage from '../pages/admin/student/StudentListPage'
import StudentCreatePage from '../pages/admin/student/create/StudentCreatePage'
import StudentEditPage from '../pages/admin/student/StudentEditPage'
import AttendanceListPage from '../pages/admin/attendance/AttendanceListPage'
import LeaveApprovePage from '../pages/admin/leave/LeaveApprovePage'
import AdminNoticeListPage from '../pages/admin/notice/NoticeListPage'
import NoticeCreatePage from '../pages/admin/notice/create/NoticeCreatePage'
import NoticeEditPage from '../pages/admin/notice/NoticeEditPage'
import AdminSettingsPage from '../pages/admin/settings/SettingsPage'

import Samplepage from '../pages/sample/Samplepage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/student/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/student/leave',
    element: <LeaveListPage />,
  },
  {
    path: '/student/leave/request',
    element: <LeaveRequestPage />,
  },
  {
    path: '/student/notice',
    element: <NoticeListPage />,
  },
  {
    path: '/student/notice/:id',
    element: <NoticeDetailPage />,
  },
  {
    path: '/student/settings',
    element: <SettingsPage />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboardPage />,
  },
  {
    path: '/admin/lecture',
    element: <LectureListPage />,
  },
  {
    path: '/admin/lecture/create',
    element: <LectureCreatePage />,
  },
  {
    path: '/admin/lecture/:id/edit',
    element: <LectureEditPage />,
  },
  {
    path: '/admin/student',
    element: <StudentListPage />,
  },
  {
    path: '/admin/student/create',
    element: <StudentCreatePage />,
  },
  {
    path: '/admin/student/:id/edit',
    element: <StudentEditPage />,
  },
  {
    path: '/admin/attendance',
    element: <AttendanceListPage />,
  },
  {
    path: '/admin/leave',
    element: <LeaveApprovePage />,
  },
  {
    path: '/admin/notice',
    element: <AdminNoticeListPage />,
  },
  {
    path: '/admin/notice/create',
    element: <NoticeCreatePage />,
  },
  {
    path: '/admin/notice/:id/edit',
    element: <NoticeEditPage />,
  },
  {
    path: '/admin/settings',
    element: <AdminSettingsPage />,
  },
  {
    path: '/sample/Samplepage',
    element: <Samplepage />,
  },
])