import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCourseModal({ isOpen, onClose }: AddCourseModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    instructor: "",
    department: "",
    description: "",
  });
  const { toast } = useToast();

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: typeof formData) => {
      return apiRequest("POST", "/api/courses", {
        ...courseData,
        semester: "Fall 2024"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Course created successfully!",
        description: `${formData.code} has been added to the system.`,
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error creating course",
        description: "Please check all fields and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.instructor || !formData.department) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createCourseMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({
      code: "",
      name: "",
      instructor: "",
      department: "",
      description: "",
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const departments = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Physics", label: "Physics" },
    { value: "English", label: "English" },
    { value: "History", label: "History" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg" data-testid="add-course-modal">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course-code" className="text-sm font-medium text-foreground mb-2 block">
                Course Code *
              </Label>
              <Input
                id="course-code"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="CS 301"
                required
                data-testid="input-course-code"
              />
            </div>
            <div>
              <Label htmlFor="department" className="text-sm font-medium text-foreground mb-2 block">
                Department *
              </Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => handleInputChange("department", value)}
                required
              >
                <SelectTrigger data-testid="select-department">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="course-name" className="text-sm font-medium text-foreground mb-2 block">
              Course Name *
            </Label>
            <Input
              id="course-name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Data Structures & Algorithms"
              required
              data-testid="input-course-name"
            />
          </div>

          <div>
            <Label htmlFor="instructor" className="text-sm font-medium text-foreground mb-2 block">
              Instructor *
            </Label>
            <Input
              id="instructor"
              value={formData.instructor}
              onChange={(e) => handleInputChange("instructor", e.target.value)}
              placeholder="Prof. Sarah Johnson"
              required
              data-testid="input-instructor"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-foreground mb-2 block">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Course description..."
              className="resize-none"
              data-testid="input-description"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createCourseMutation.isPending}
              data-testid="button-create"
            >
              {createCourseMutation.isPending ? "Creating..." : "Add Course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
