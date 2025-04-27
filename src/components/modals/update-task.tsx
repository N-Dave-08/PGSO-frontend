"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PenSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/helpers/table-data/task-data";

interface UpdateTaskProps {
  task: Task;
}

export function UpdateTask({ task }: UpdateTaskProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(task.status);
  const [supportingFile, setSupportingFile] = useState(
    task.supportingFile || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement the API call to update the task
    const updatedTask = {
      ...task,
      status,
      supportingFile,
    };
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <PenSquare className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>
            Make changes to the task here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Title</Label>
              <div className="col-span-3 text-sm text-gray-500">
                {task.title}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Description</Label>
              <div className="col-span-3 text-sm text-gray-500">
                {task.description}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(
                  value: "Not Started" | "In Progress" | "Completed"
                ) => setStatus(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Supporting File</Label>
              <Input
                value={supportingFile}
                onChange={(e) => setSupportingFile(e.target.value)}
                placeholder="Enter file name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Location</Label>
              <div className="col-span-3 text-sm text-gray-500">
                {task.location}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Task ID</Label>
              <div className="col-span-3 text-sm text-gray-500">
                {task.taskId}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Requestor</Label>
              <div className="col-span-3 text-sm text-gray-500">
                {task.requestor.name}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Department</Label>
              <div className="col-span-3 text-sm text-gray-500">
                {task.requestor.department}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Division</Label>
              <div className="col-span-3 text-sm text-gray-500">
                {task.requestor.division}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
