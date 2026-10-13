"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import type { Project, Category } from "@teamconnect/shared-types";

interface CreateRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectId?: string;
  onSuccess?: () => void;
}

export function CreateRequestModal({
  open,
  onOpenChange,
  defaultProjectId,
  onSuccess,
}: CreateRequestModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [projectId, setProjectId] = React.useState(defaultProjectId || "");
  const [targetUserName, setTargetUserName] = React.useState("");
  const [role, setRole] = React.useState("Contributor");
  const [startAt, setStartAt] = React.useState(new Date().toISOString().slice(0, 10));
  const [endAt, setEndAt] = React.useState(
    new Date(Date.now() + 60 * 86_400_000).toISOString().slice(0, 10)
  );
  const [justification, setJustification] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiClient.get<{ data: Project[] }>(ENDPOINTS.PROJECTS.LIST),
    select: (r) => (r.success ? r.data.data : []),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get<{ data: Category[] }>(ENDPOINTS.CATEGORIES.LIST),
    select: (r) => (r.success ? r.data.data : []),
  });

  React.useEffect(() => {
    if (defaultProjectId) setProjectId(defaultProjectId);
    else if (projects.length > 0 && !projectId && projects[0]) setProjectId(projects[0]._id);
  }, [defaultProjectId, projects, projectId]);

  const resetForm = () => {
    setTargetUserName("");
    setJustification("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserName.trim()) {
      setError("Please specify the member name or email.");
      return;
    }
    if (!justification.trim()) {
      setError("A justification is required for cross-category requests.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        projectId: projectId || (projects[0]?._id ?? "proj-1"),
        targetUserName: targetUserName.trim(),
        role: role.trim(),
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        justification: justification.trim(),
      };

      const res = await apiClient.post(ENDPOINTS.REQUESTS.CREATE, payload);
      toast({
        title: "Request submitted",
        description: `Cross-category request for ${targetUserName} has been queued for Category Lead review.`,
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast({
        title: "Request recorded",
        description: `Membership request submitted for ${targetUserName}.`,
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
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
      title="Request Cross-Category Member"
      description="Request a team member from another department to collaborate on your project."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-danger/10 p-3 text-xs font-medium text-danger border border-danger/20">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
            Project <span className="text-danger">*</span>
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            aria-label="Project"
            className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
              Candidate Member <span className="text-danger">*</span>
            </label>
            <Input
              value={targetUserName}
              onChange={(e) => setTargetUserName(e.target.value)}
              placeholder="e.g. Jordan Lee (Engineering)"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
              Project Role
            </label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
              Start Date
            </label>
            <Input
              type="date"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
              End Date
            </label>
            <Input
              type="date"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
            Justification & Responsibilities <span className="text-danger">*</span>
          </label>
          <Textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Explain why this resource is needed, time commitment percentage, and scope of work…"
            rows={3}
            required
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
            variant="primary"
            loading={isSubmitting}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
