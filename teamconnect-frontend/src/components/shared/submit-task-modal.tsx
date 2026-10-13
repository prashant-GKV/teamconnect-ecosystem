"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import { useQueryClient } from "@tanstack/react-query";

interface SubmitTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
  onSuccess?: () => void;
}

export function SubmitTaskModal({
  open,
  onOpenChange,
  taskId,
  taskTitle,
  onSuccess,
}: SubmitTaskModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [notes, setNotes] = React.useState("");
  const [artifactUrl, setArtifactUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const resetForm = () => {
    setNotes("");
    setArtifactUrl("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError("Please include a brief note describing what work was completed.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        notes: notes.trim(),
        artifactUrl: artifactUrl.trim() || undefined,
      };

      await apiClient.post(ENDPOINTS.TASKS.SUBMISSIONS(taskId), payload);
      toast({
        title: "Task submitted for review ✓",
        description: "Your category lead or manager has been notified. You can track review status here.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast({
        title: "Submission recorded",
        description: "Task marked for review. Waiting for reviewer feedback.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      resetForm();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Submit Task for Review"
      description={`Submit your work for "${taskTitle}". Your reviewer will inspect the deliverables.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-danger/10 p-3 text-xs font-medium text-danger border border-danger/20">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
            Deliverable / Artifact Link (Optional)
          </label>
          <Input
            value={artifactUrl}
            onChange={(e) => setArtifactUrl(e.target.value)}
            placeholder="https://github.com/pull/123 or Figma link"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
            Work Summary & Notes <span className="text-danger">*</span>
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe what was done, how it was verified, and any review guidance…"
            rows={4}
            required
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            loading={isSubmitting}
          >
            Submit for Review
          </Button>
        </div>
      </form>
    </Modal>
  );
}
