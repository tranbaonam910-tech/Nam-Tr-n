export const mockTeacherStats = {
  totalStudents: 145,
  activeClasses: 5,
  averageScore: 88.5,
  assignmentCompletion: 92,
};

export const mockClassProgress = [
  { className: 'Chem 10A1', score: 91, completion: 95 },
  { className: 'Chem 10A2', score: 85, completion: 88 },
  { className: 'Chem 11B1', score: 89, completion: 92 },
  { className: 'AP Chem', score: 94, completion: 98 },
];

export const mockRecentActivities = [
  { id: 1, action: 'Submitted Homework', student: 'Sarah Lee', class: 'Chem 10A1', time: '10 mins ago' },
  { id: 2, action: 'Completed Quiz: Atomic Structure', student: 'John Doe', class: 'Chem 11B1', time: '45 mins ago' },
  { id: 3, action: 'Needs Review: Essay', student: 'Mike Davis', class: 'AP Chem', time: '2 hours ago' },
  { id: 4, action: 'Achieved 10-day streak', student: 'Emma Watson', class: 'Chem 10A2', time: '5 hours ago' },
];
