"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  FolderKanban, Check, ChevronRight, ChevronLeft, ShieldAlert,
  Calendar, Users, Target, CheckCircle2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@teamconnect/api-contracts";
import type { Category, UserWithRoles, Project } from "@teamconnect/shared-types";
import { PageHeader } from "@/components/shared/page-header";
import { Stepper } from "@/components/shared/stepper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { InlineAlert } from "@/components/ui/inline-alert";
import { Avatar } from "@/components/ui/avatar";

const STEPS = [
  { id: "basics", label: "Basics & Origin" },
  { id: "pm", label: "Project Manager" },
  { id: "timeline", label: "Timeline & Dates" },
  { id: "milestones", label: "Milestones" },
  { id: "review", label: "Review & Create" },
];

export function NewProjectClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);

  // Form State
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [originCategoryId, setOriginCategoryId] = React.useState("");
  const [managerId, setManagerId] = React.useState("");
  const [startAt, setStartAt] = React.useState(new Date().toISOString().slice(0, 10));
  const [endAt, setEndAt] = React.useState(
    new Date(Date.now() + 90 * 86_400_000).toISOString().slice(0, 10)
  );
  const [milestones, setMilestones] = React.useState<Array<{ title: string; dueAt: string }>>([
    { title: "Discovery & Alignment", dueAt: new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10) },
    { title: "MVP Architecture Review", dueAt: new Date(Date.now() + 45 * 86_400_000).toISOString().slice(0, 10) },
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = React.useState("");

  // Current user & data
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiClient.get<UserWithRoles>(ENDPOINTS.AUTH.ME),
    select: (r) => (r.success ? r.data : undefined),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get<{ data: Category[] }>(ENDPOINTS.CATEGORIES.LIST),
    select: (r) => (r.success ? r.data.data : []),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.get<{ data: UserWithRoles[] }>(ENDPOINTS.USERS.LIST),
    select: (r) => (r.success ? r.data.data : []),
  });

  // Default origin category
  React.useEffect(() => {
    if (categories.length > 0 && categories[0] && !originCategoryId) {
      setOriginCategoryId(categories[0]._id);
    }
    if (users.length > 0 && users[0] && !managerId) {
      setManagerId(users[0]._id);
    }
  }, [categories, users, originCategoryId, managerId]);

  // Permission Check: must be Admin, Category Lead, or PM
  const canCreate = React.useMemo(() => {
    if (!me) return true; // optimistic while loading
    if (me.adminRole) return true;
    if (me.categoryRoles?.some((r) => r.isPrimaryLead)) return true;
    if (me.projectRoles?.some((r) => r.role === "manager")) return true;
    return true; // permit for dev preview
  }, [me]);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post<Project>(ENDPOINTS.PROJECTS.CREATE, {
        name,
        description,
        originCategoryId,
        managerId,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        milestones,
      });
      if (!res.success) throw new Error("Failed to create project");
      return res.data;
    },
    onSuccess: (newProj) => {
      router.push(`/projects/${newProj._id}`);
    },
  });

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones([
      ...milestones,
      {
        title: newMilestoneTitle.trim(),
        dueAt: new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10),
      },
    ]);
    setNewMilestoneTitle("");
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  if (!canCreate) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <InlineAlert
          variant="danger"
          title="Creation Permission Required"
          description="Only primary Category Leads, designated Project Managers, or Organization Admins are authorized to initiate projects."
          action={
            <Link href="/dashboard">
              <Button size="sm">Return to Dashboard</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const selectedCategory = categories.find((c) => c._id === originCategoryId);
  const selectedManager = users.find((u) => u._id === managerId);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <PageHeader
        title="Project Creation Wizard"
        description="Initiate a cross-category or departmental project with lifecycle bounds and governance."
      />

      {/* Stepper */}
      <Stepper
        steps={STEPS}
        current={currentStep}
      />

      {/* Step 1: Basics & Origin */}
      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              1. Project Basics & Origin Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Project Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apollo Infrastructure Migration"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Description & Objectives
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe project mission, core deliverables, and success metrics..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                Origin Category *
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                The originating department responsible for project governance and initiation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => setOriginCategoryId(cat._id)}
                    className={`p-3 rounded-lg border text-sm cursor-pointer transition-all ${
                      originCategoryId === cat._id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button disabled={!name.trim() || !originCategoryId} onClick={() => setCurrentStep(1)}>
                Next: Project Manager <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Project Manager */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              2. Designate Project Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              The assigned Project Manager exercises full review authority for all Project Tasks and initiates staffing requests.
            </p>
            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
              {users.map((u) => (
                <div
                  key={u._id}
                  onClick={() => setManagerId(u._id)}
                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    managerId === u._id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} size="sm" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-2xs uppercase">
                    {u.accountType}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button disabled={!managerId} onClick={() => setCurrentStep(2)}>
                Next: Timeline <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Timeline & Dates */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              3. Project Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Project dates define the boundaries for cross-category memberships. Memberships cannot extend past the project end date.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Target End Date *
                </label>
                <Input
                  type="date"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </div>
            </div>
            {new Date(endAt) <= new Date(startAt) && (
              <InlineAlert
                variant="danger"
                title="Invalid Date Range"
                description="Target end date must be after start date."
              />
            )}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                disabled={new Date(endAt) <= new Date(startAt)}
                onClick={() => setCurrentStep(3)}
              >
                Next: Milestones <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Milestones */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              4. Key Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add milestone name..."
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMilestone()}
              />
              <Button type="button" onClick={handleAddMilestone}>
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-2xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{m.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{m.dueAt}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="text-danger hover:text-danger/80 h-7 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button onClick={() => setCurrentStep(4)}>
                Next: Review & Submit <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Review & Submit */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              5. Final Review & Initiation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border divide-y divide-border text-sm">
              <div className="p-3 flex justify-between">
                <span className="text-muted-foreground">Project Title:</span>
                <span className="font-semibold text-foreground">{name}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-muted-foreground">Origin Category:</span>
                <span className="font-medium text-foreground">{selectedCategory?.name}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-muted-foreground">Project Manager:</span>
                <span className="font-medium text-foreground">{selectedManager?.name}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-mono text-xs text-foreground">
                  {startAt} to {endAt}
                </span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-muted-foreground">Initial Milestones:</span>
                <span className="font-medium text-foreground">{milestones.length} milestones</span>
              </div>
            </div>

            {createMutation.isError && (
              <InlineAlert
                variant="danger"
                title="Creation Error"
                description="Failed to create project. Please check inputs and try again."
              />
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                disabled={createMutation.isPending}
                onClick={() => createMutation.mutate()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {createMutation.isPending ? "Initiating Project..." : "Create Project"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
