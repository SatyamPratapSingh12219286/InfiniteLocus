import { type Course, type InsertCourse, type Feedback, type InsertFeedback, type CourseWithStats, type DepartmentAnalytics, type RatingDistribution } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Course operations
  getCourses(): Promise<Course[]>;
  getCoursesWithStats(): Promise<CourseWithStats[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<boolean>;

  // Feedback operations
  getFeedback(): Promise<Feedback[]>;
  getFeedbackByCourse(courseId: string): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;

  // Analytics operations
  getDepartmentAnalytics(): Promise<DepartmentAnalytics[]>;
  getRatingDistribution(): Promise<RatingDistribution[]>;
  getOverallStats(): Promise<{
    totalReviews: number;
    averageRating: number;
    activeCourses: number;
    responseRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private courses: Map<string, Course>;
  private feedback: Map<string, Feedback>;

  constructor() {
    this.courses = new Map();
    this.feedback = new Map();
    this.seedData();
  }

  private seedData() {
    // Sample courses
    const sampleCourses = [
      {
        id: "cs301",
        code: "CS 301",
        name: "Data Structures & Algorithms",
        instructor: "Prof. Amit Kumar",
        department: "Computer Science",
        description: "Comprehensive study of advanced data structures and algorithm optimization techniques",
        semester: "Fall 2024"
      },
      {
        id: "math210",
        code: "MATH 210",
        name: "Linear Algebra",
        instructor: "Prof. Sweta Sharma",
        department: "Mathematics",
        description: "Mathematical foundations covering vector spaces, eigenvalues, and matrix operations",
        semester: "Fall 2024"
      },
      {
        id: "phys150",
        code: "PHYS 150",
        name: "General Physics I",
        instructor: "Prof. Satyam Patel",
        department: "Physics",
        description: "Fundamental physics principles including mechanics, energy, and thermodynamics",
        semester: "Fall 2024"
      },
      {
        id: "cs250",
        code: "CS 250",
        name: "Database Systems",
        instructor: "Prof. Shiv Gupta",
        department: "Computer Science",
        description: "Relational database concepts, normalization, and query optimization strategies",
        semester: "Fall 2024"
      },
      {
        id: "eng101",
        code: "ENG 101",
        name: "Academic Writing",
        instructor: "Prof. Ayush Singh",
        department: "English",
        description: "Development of critical writing and analytical thinking skills for academic contexts",
        semester: "Fall 2024"
      },
      {
        id: "hist200",
        code: "HIST 200",
        name: "World History",
        instructor: "Prof. Himesh Verma",
        department: "History",
        description: "Exploration of global historical patterns and cultural developments across civilizations",
        semester: "Fall 2024"
      }
    ];

    sampleCourses.forEach(course => {
      this.courses.set(course.id, course);
    });

    // Sample feedback to generate realistic ratings
    const sampleFeedback = [
      // CS 301 - 4.2 average
      { courseId: "cs301", rating: 5, comment: "Outstanding course with challenging algorithmic problems", studentName: "Ravi Sharma" },
      { courseId: "cs301", rating: 4, comment: "Excellent content but requires dedicated study time", studentName: "Priya Patel" },
      { courseId: "cs301", rating: 4, comment: "Prof Kumar explains complex concepts clearly", studentName: "Arjun Singh" },
      { courseId: "cs301", rating: 5, comment: "Most comprehensive CS course in the curriculum", studentName: "Anjali Gupta" },
      { courseId: "cs301", rating: 3, comment: "Challenging but builds strong foundation", studentName: "Vikram Yadav" },
      
      // MATH 210 - 3.8 average
      { courseId: "math210", rating: 4, comment: "Well organized course with clear learning objectives", studentName: "Neha Joshi" },
      { courseId: "math210", rating: 3, comment: "Mathematics is challenging but professor is supportive", studentName: "Karan Mehta" },
      { courseId: "math210", rating: 4, comment: "Excellent problem sets and practice materials", studentName: "Divya Reddy" },
      { courseId: "math210", rating: 4, comment: "Comprehensive coverage of all important topics", studentName: "Rohit Kumar" },
      
      // PHYS 150 - 4.5 average
      { courseId: "phys150", rating: 5, comment: "Exceptional teaching and course design", studentName: "Kavya Nair" },
      { courseId: "phys150", rating: 4, comment: "Physics principles explained with practical examples", studentName: "Aditya Verma" },
      { courseId: "phys150", rating: 5, comment: "Laboratory sessions are incredibly engaging", studentName: "Shreya Agarwal" },
      { courseId: "phys150", rating: 4, comment: "Rigorous but maintains student interest", studentName: "Deepak Mishra" },
      
      // CS 250 - 4.0 average
      { courseId: "cs250", rating: 4, comment: "Solid introduction to database management systems", studentName: "Pooja Shah" },
      { courseId: "cs250", rating: 4, comment: "Hands-on projects enhance learning experience", studentName: "Manish Tiwari" },
      { courseId: "cs250", rating: 4, comment: "SQL knowledge gained is practically applicable", studentName: "Suman Das" },
      
      // ENG 101 - 3.6 average
      { courseId: "eng101", rating: 3, comment: "Fundamental course for academic writing skills", studentName: "Isha Bansal" },
      { courseId: "eng101", rating: 4, comment: "Significant improvement in writing abilities", studentName: "Gaurav Sinha" },
      { courseId: "eng101", rating: 3, comment: "Constructive feedback helps in skill development", studentName: "Nisha Rao" },
      
      // HIST 200 - 4.3 average
      { courseId: "hist200", rating: 4, comment: "Intriguing insights into world civilizations", studentName: "Rahul Jain" },
      { courseId: "hist200", rating: 5, comment: "Prof Verma makes history come alive in classroom", studentName: "Meera Chopra" },
      { courseId: "hist200", rating: 4, comment: "Interactive discussions enhance understanding", studentName: "Akash Pandey" },
    ];

    sampleFeedback.forEach(fb => {
      const feedback: Feedback = {
        id: randomUUID(),
        courseId: fb.courseId,
        rating: fb.rating,
        comment: fb.comment,
        studentName: fb.studentName,
        createdAt: new Date(),
      };
      this.feedback.set(feedback.id, feedback);
    });
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCoursesWithStats(): Promise<CourseWithStats[]> {
    const courses = await this.getCourses();
    const coursesWithStats: CourseWithStats[] = [];

    for (const course of courses) {
      const courseFeedback = await this.getFeedbackByCourse(course.id);
      const totalReviews = courseFeedback.length;
      const averageRating = totalReviews > 0 
        ? courseFeedback.reduce((sum, fb) => sum + fb.rating, 0) / totalReviews
        : 0;

      coursesWithStats.push({
        ...course,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
      });
    }

    return coursesWithStats;
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = { 
      ...insertCourse, 
      id,
      description: insertCourse.description || null,
      semester: insertCourse.semester || "Fall 2024"
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourse(id: string, updateData: Partial<InsertCourse>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;

    const updatedCourse = { ...course, ...updateData };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: string): Promise<boolean> {
    // Also delete related feedback
    const courseFeedback = await this.getFeedbackByCourse(id);
    courseFeedback.forEach(fb => this.feedback.delete(fb.id));
    
    return this.courses.delete(id);
  }

  async getFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedback.values());
  }

  async getFeedbackByCourse(courseId: string): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).filter(fb => fb.courseId === courseId);
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = {
      ...insertFeedback,
      id,
      comment: insertFeedback.comment || null,
      studentName: insertFeedback.studentName || "Anonymous",
      createdAt: new Date(),
    };
    this.feedback.set(id, feedback);
    return feedback;
  }

  async getDepartmentAnalytics(): Promise<DepartmentAnalytics[]> {
    const courses = await this.getCourses();
    const departmentMap = new Map<string, { courses: Course[], feedback: Feedback[] }>();

    // Group courses by department
    courses.forEach(course => {
      if (!departmentMap.has(course.department)) {
        departmentMap.set(course.department, { courses: [], feedback: [] });
      }
      departmentMap.get(course.department)!.courses.push(course);
    });

    // Add feedback for each department
    const allFeedback = await this.getFeedback();
    allFeedback.forEach(fb => {
      const course = courses.find(c => c.id === fb.courseId);
      if (course) {
        departmentMap.get(course.department)!.feedback.push(fb);
      }
    });

    const analytics: DepartmentAnalytics[] = [];
    departmentMap.forEach((data, department) => {
      const totalReviews = data.feedback.length;
      const averageRating = totalReviews > 0 
        ? data.feedback.reduce((sum, fb) => sum + fb.rating, 0) / totalReviews
        : 0;

      analytics.push({
        department,
        courseCount: data.courses.length,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        trend: Math.round((Math.random() - 0.5) * 10) / 10, // Simulated trend
      });
    });

    return analytics.sort((a, b) => b.averageRating - a.averageRating);
  }

  async getRatingDistribution(): Promise<RatingDistribution[]> {
    const allFeedback = await this.getFeedback();
    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    allFeedback.forEach(fb => {
      distribution[fb.rating]++;
    });

    return Object.entries(distribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
    }));
  }

  async getOverallStats() {
    const allFeedback = await this.getFeedback();
    const activeCourses = (await this.getCourses()).length;
    const totalReviews = allFeedback.length;
    const averageRating = totalReviews > 0 
      ? allFeedback.reduce((sum, fb) => sum + fb.rating, 0) / totalReviews
      : 0;

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      activeCourses,
      responseRate: 78, // Simulated response rate
    };
  }
}

export const storage = new MemStorage();
