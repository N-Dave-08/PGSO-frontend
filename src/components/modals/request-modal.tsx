import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function RequestModal() {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });

  const clearForm = () => {
    setFormValues({
      title: "",
      description: "",
      file: null,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Request</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          <DialogDescription>Put your request details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title" className="text-left">
              Title
            </Label>
            <Input
              id="title"
              value={formValues.title}
              onChange={(e) =>
                setFormValues({ ...formValues, title: e.target.value })
              }
              placeholder="Request Title"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Type your description here."
              value={formValues.description}
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="file" className="text-left">
              Supporting File
            </Label>
            <Input
              id="file"
              className="col-span-3"
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  file: e.target.files?.[0] || null,
                })
              }
              type="file"
              accept="image/*"
            />
          </div>
        </div>
        <DialogFooter>
          <div className="justify-end flex">
            <Button variant="ghost" onClick={clearForm}>
              Clear
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
