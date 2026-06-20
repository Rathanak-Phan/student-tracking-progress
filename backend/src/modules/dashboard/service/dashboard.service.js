import * as repo from "../repository/dashboard.repository.js";

export const getStudentDashboard = async (studentId) => {
  const enrolledClasses = await repo.getEnrolledClasses(studentId);
  const classes = enrolledClasses.map(c => {
    const total = Number(c.total_assignments || 0);
    const completed = Number(c.completed_assignments || 0);
    return {
      ...c,
      total_assignments: total,
      completed_assignments: completed,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  const assignments = await repo.getStudentAssignments(studentId);
  const performance = (await repo.getStudentPerformance(studentId)) || { average_grade: null, graded_count: 0 };
  const goalStats = (await repo.getStudentGoalStats(studentId)) || { total_goals: 0, completed_goals: 0 };
  const gradeTrend = (await repo.getStudentGradeTrend(studentId)) || [];
  const recentActivities = (await repo.getStudentRecentActivities(studentId)) || [];
  const goals = (await repo.getStudentGoals(studentId)) || [];

  const totalAssignments = assignments.length;
  const submittedAssignments = assignments.filter(a => a.submission_status).length;
  const progressPercentage = totalAssignments > 0 
    ? Math.round((submittedAssignments / totalAssignments) * 100) 
    : 0;

  return {
    summary: {
      totalClasses: classes.length,
      totalAssignments,
      submittedAssignments,
      progressPercentage,
      averageGrade: performance.average_grade !== null ? parseFloat(performance.average_grade).toFixed(2) : "0",
      totalEarnedScore: Number(performance.total_earned_score || 0),
      totalMaxScore: Number(performance.total_max_score || 0),
      goalsCompleted: `${Number(goalStats.completed_goals || 0)}/${Number(goalStats.total_goals || 0)}`
    },
    performance: {
      average_grade: performance.average_grade,
      graded_count: Number(performance.graded_count || 0),
      goalCompletionRate: Number(goalStats.total_goals) > 0 
        ? Math.round((Number(goalStats.completed_goals) / Number(goalStats.total_goals)) * 100)
        : 0,
      gradeTrend
    },
    classes,
    assignments,
    recentActivities,
    goals
  };
};

export const getTeacherDashboard = async (teacherId) => {
  const classes = await repo.getTeacherClasses(teacherId);
  const stats = await repo.getTeacherStats(teacherId);
  const detailedStats = await repo.getTeacherDetailedStats(teacherId);
  const studentPerformance = await repo.getTeacherStudentPerformance(teacherId);
  const recentSubmissions = await repo.getTeacherRecentSubmissions(teacherId);

  return {
    stats: {
      totalClasses: classes.length,
      ...stats,
      ...detailedStats
    },
    classes,
    studentPerformance,
    recentSubmissions
  };
};

export const getAdminDashboard = async () => {
  const stats = await repo.getAdminStats();
  const recentActivities = await repo.getRecentActivities();

  return {
    stats,
    recentActivities
  };
};
