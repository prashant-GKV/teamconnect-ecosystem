"use client";
import * as React from "react";
import Link from "next/link";
import {
  Shield, Plus, Users, FolderKanban, AlertTriangle,
  ArrowRight, CheckCircle2, UserCheck
} from "lucide-react";
import { INITIAL_CATEGORIES, INITIAL_USERS } from "@/lib/admin-data";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = React.useState(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState("");
  const [newCatDesc, setNewCatDesc] = React.useState("");
  const [newCatLeadId, setNewCatLeadId] = React.useState("");

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const leadUser = INITIAL_USERS.find((u) => u._id === newCatLeadId);

    const newCat = {
      _id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      description: newCatDesc.trim(),
      isActive: true,
      memberCount: 1,
      lead: leadUser
        ? { _id: leadUser._id, name: leadUser.name, email: leadUser.email, accountType: leadUser.accountType }
        : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCategories([...categories, newCat]);
    setIsModalOpen(false);
    setNewCatName("");
    setNewCatDesc("");
    setNewCatLeadId("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Organizational Categories"
        description="Establish operational units, assign primary category leads, and oversee departmental staffing."
        actions={
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Create Category
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Card key={cat._id} className="flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  <CardTitle className="text-base font-semibold">{cat.name}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {cat.description || "No operational description provided."}
                </p>
              </div>
              <Badge variant={cat.isActive ? "success" : "muted"}>
                {cat.isActive ? "Active" : "Archived"}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between pt-4">
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border bg-card/60">
                  <p className="text-2xs font-semibold uppercase text-muted-foreground mb-1">
                    Primary Category Lead
                  </p>
                  {cat.lead ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={cat.lead.name} size="xs" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{cat.lead.name}</p>
                        <p className="text-2xs text-muted-foreground">{cat.lead.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-warning text-xs font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Vacant Lead — Requires Designation</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Roster Members:</span>
                  <span className="font-semibold text-foreground">{cat.memberCount || 0}</span>
                </div>
              </div>

              <div className="pt-4 mt-auto border-t border-border flex justify-end">
                <Link href={`/categories/${cat._id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Configure Category & Delegates <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Category Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Operational Category"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
              Category Name *
            </label>
            <Input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Information Security"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
              Description
            </label>
            <Textarea
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Operational responsibilities, scope, and objectives..."
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
              Initial Primary Lead (Optional)
            </label>
            <select
              value={newCatLeadId}
              onChange={(e) => setNewCatLeadId(e.target.value)}
              className="w-full text-xs rounded-md border border-border bg-card px-3 py-2 text-foreground"
            >
              <option value="">Select a user (or leave vacant)</option>
              {INITIAL_USERS.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newCatName.trim()}>
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
