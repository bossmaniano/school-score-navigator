export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'subject_teacher' | 'class_teacher' | 'head_teacher' | 'administrator';
  classId?: string;
  subjects?: string[];
}

export interface School {
  id: string;
  name: string;
  address: string;
  contact: string;
  logo?: string;
}

export interface Class {
  id: string;
  name: string;
  classTeacherId?: string;
  subjects: string[];
}

export interface Student {
  id: string;
  fullName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  classId: string;
  email: string;
  assessmentNumber: string;
}

export interface Assessment {
  id: string;
  name: string;
  type: 'CAT' | 'EXAM';
  classId: string;
  subjectId: string;
  maxMarks: number;
  date: string;
}

export interface Score {
  id: string;
  studentId: string;
  assessmentId: string;
  marks: number;
}

export interface Comment {
  id: string;
  classId: string;
  authorId: string;
  content: string;
  createdAt: string;
  resolved: boolean;
  parentId?: string;
}

export type PathwayType = 'STEM' | 'Art & Sports' | 'Social Sciences';

export interface StudentReport {
  studentId: string;
  totalMarks: number;
  meanMarks: number;
  rank: number;
  recommendedPathway: PathwayType;
  subjectPerformance: Record<string, number>;
}