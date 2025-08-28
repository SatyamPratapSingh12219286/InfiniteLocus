import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import StarRating from "./star-rating";
import type { CourseWithStats } from "@shared/schema";

interface FeedbackModalProps {
  course: CourseWithStats | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ course, isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: { courseId: string; rating: number; comment?: string }) => {
      return apiRequest("POST", "/api/feedback", {
        ...data,
        studentName: "Anonymous Student"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Feedback submitted successfully!",
        description: "Thank you for your feedback.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!course || rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Rating is required to submit feedback.",
        variant: "destructive",
      });
      return;
    }

    if (comment.length > 500) {
      toast({
        title: "Comment too long",
        description: "Please keep comments under 500 characters.",
        variant: "destructive",
      });
      return;
    }

    submitFeedbackMutation.mutate({
      courseId: course.id,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" data-testid="feedback-modal">
        <DialogHeader>
          <DialogTitle>Rate Course</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Info */}
          <div>
            <h4 className="font-medium text-foreground" data-testid="course-name">
              {course.code} - {course.name}
            </h4>
            <p className="text-sm text-muted-foreground" data-testid="course-instructor">
              {course.instructor}
            </p>
          </div>

          {/* Rating Input */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Overall Rating
            </Label>
            <StarRating 
              value={rating} 
              onChange={setRating}
              data-testid="rating-input"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Click to rate (1-5 stars)
            </p>
          </div>

          {/* Comment Input */}
          <div>
            <Label htmlFor="comment" className="text-sm font-medium text-foreground mb-2 block">
              Comments (Optional)
            </Label>
            <Textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this course..."
              className="resize-none"
              maxLength={500}
              data-testid="comment-input"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3">
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
              disabled={submitFeedbackMutation.isPending || rating === 0}
              data-testid="button-submit"
            >
              {submitFeedbackMutation.isPending ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
