import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  instructor: text("instructor").notNull(),
  department: text("department").notNull(),
  description: text("description"),
  semester: text("semester").notNull().default("Fall 2024"),
});

export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  studentName: text("student_name").notNull().default("Anonymous"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;

export type CourseWithStats = Course & {
  averageRating: number;
  totalReviews: number;
};

export type DepartmentAnalytics = {
  department: string;
  courseCount: number;
  averageRating: number;
  totalReviews: number;
  trend: number;
};

export type RatingDistribution = {
  rating: number;
  count: number;
};
