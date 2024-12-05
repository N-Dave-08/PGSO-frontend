import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"


export default function RequestDetails({ formData, updateFormData, onNext }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="supportingFile">Supporting File</Label>
        <Input
          id="supportingFile"
          type="file"
          onChange={(e) => updateFormData({ supportingFile: e.target.files[0] })}
        />
      </div>

      <Button type="submit">Next</Button>
    </form>
  )
}