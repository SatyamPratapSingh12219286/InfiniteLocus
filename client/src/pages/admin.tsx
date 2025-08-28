import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AddCourseModal from "@/components/add-course-modal";
import type { CourseWithStats } from "@shared/schema";

export default function AdminPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: courses, isLoading, error } = useQuery<CourseWithStats[]>({
    queryKey: ["/api/courses"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (courseId: string) => {
      return apiRequest("DELETE", `/api/courses/${courseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Course deleted successfully",
        description: "The course has been removed from the system.",
      });
    },
    onError: () => {
      toast({
        title: "Error deleting course",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteCourse = (course: CourseWithStats) => {
    if (window.confirm(`Are you sure you want to delete ${course.code}? This action cannot be undone.`)) {
      deleteMutation.mutate(course.id);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading courses. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="admin-title">
          Academic Administration
        </h2>
        <p className="text-muted-foreground">Manage course catalog and instructor assignments</p>
      </div>

      {/* Add Course Button */}
      <div className="mb-6">
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          data-testid="button-add-course"
        >
          + Add New Course
        </Button>
      </div>

      {/* Course Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4 py-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : courses?.length === 0 ? (
            <div className="text-center py-8" data-testid="no-courses">
              <p className="text-muted-foreground">No courses available. Add your first course to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="admin-courses-table">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Course Code</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Course Name</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Instructor</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Department</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Reviews</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Avg Rating</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses?.map((course) => (
                    <tr 
                      key={course.id} 
                      className="border-b border-border hover:bg-muted/30"
                      data-testid={`admin-course-row-${course.id}`}
                    >
                      <td className="py-3 px-6 font-medium" data-testid={`admin-course-code-${course.id}`}>
                        {course.code}
                      </td>
                      <td className="py-3 px-6" data-testid={`admin-course-name-${course.id}`}>
                        {course.name}
                      </td>
                      <td className="py-3 px-6 text-muted-foreground" data-testid={`admin-course-instructor-${course.id}`}>
                        {course.instructor}
                      </td>
                      <td className="py-3 px-6 text-muted-foreground" data-testid={`admin-course-department-${course.id}`}>
                        {course.department}
                      </td>
                      <td className="py-3 px-6 text-muted-foreground" data-testid={`admin-course-reviews-${course.id}`}>
                        {course.totalReviews}
                      </td>
                      <td className="py-3 px-6" data-testid={`admin-course-rating-${course.id}`}>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{course.averageRating.toFixed(1)}</span>
                          <span className="text-chart-1">★</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex space-x-2">
                          <Button 
                            variant="link" 
                            size="sm"
                            className="text-primary hover:text-primary/80 p-0 h-auto"
                            data-testid={`button-edit-${course.id}`}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="link" 
                            size="sm"
                            className="text-destructive hover:text-destructive/80 p-0 h-auto"
                            onClick={() => handleDeleteCourse(course)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${course.id}`}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
