import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackModal from "@/components/feedback-modal";
import StarRating from "@/components/star-rating";
import type { CourseWithStats } from "@shared/schema";

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<CourseWithStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const { data: courses, isLoading, error } = useQuery<CourseWithStats[]>({
    queryKey: ["/api/courses"],
  });

  const handleRateCourse = (course: CourseWithStats) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  }) || [];

  const departments = courses ? Array.from(new Set(courses.map(c => c.department))) : [];

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
        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="page-title">
          Course Evaluation
        </h2>
        <p className="text-muted-foreground">Share your learning experience and rate course quality</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="search-courses"
          />
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full sm:w-48" data-testid="filter-department">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="flex space-x-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-8" data-testid="no-courses">
          <p className="text-muted-foreground">
            {searchTerm || selectedDepartment !== "all" 
              ? "No courses match your search criteria." 
              : "No courses available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id} 
              className="p-6 shadow-sm hover:shadow-md transition-shadow"
              data-testid={`course-card-${course.id}`}
            >
              <CardContent className="p-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground" data-testid={`course-code-${course.id}`}>
                      {course.code}
                    </h3>
                    <p className="text-muted-foreground text-sm" data-testid={`course-name-${course.id}`}>
                      {course.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className="text-2xl font-bold text-foreground" data-testid={`course-rating-${course.id}`}>
                        {course.averageRating.toFixed(1)}
                      </span>
                      <span className="text-chart-1">★</span>
                    </div>
                    <p className="text-xs text-muted-foreground" data-testid={`course-reviews-${course.id}`}>
                      {course.totalReviews} review{course.totalReviews !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4" data-testid={`course-instructor-${course.id}`}>
                  {course.instructor} • {course.semester}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleRateCourse(course)}
                    className="flex-1"
                    data-testid={`button-rate-${course.id}`}
                  >
                    Rate Course
                  </Button>
                  <Button 
                    variant="outline"
                    data-testid={`button-details-${course.id}`}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <FeedbackModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
