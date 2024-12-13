'use client'

import { useState, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from 'lucide-react'
import { createRequest } from '@/lib/api/requests'
import { useToast } from '@/hooks/use-toast'

interface CreateRequestProps {
    onRequestCreated?: () => void;
}

export default function CreateRequest({ onRequestCreated }: CreateRequestProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)
    const { toast } = useToast()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Clear any previous errors
        setError(null);

        // Validate required fields
        if (!title.trim()) {
            setError('The request title field is required');
            return;
        }

        if (!description.trim()) {
            setError('The request description field is required');
            return;
        }

        if (!file) {
            setError('Please select a supporting file');
            return;
        }

        setIsLoading(true);

        try {
            const formData = {
                request_title: title.trim(),
                description: description.trim(),
                file_path: file
            }; 

            const response = await createRequest(formData);

            if (response.isSuccess) {
                toast({
                    title: "Success",
                    description: response.message,
                });

                // Reset form
                setTitle('');
                setDescription('');
                setFile(null);
                setOpen(false);
                
                // Refresh the requests list
                onRequestCreated?.();
            } else {
                setError(response.message || 'Failed to create request');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : 'Failed to create request',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Check file size (max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Please upload a valid image file (JPG or PNG)');
                return;
            }
            
            setFile(selectedFile);
            setError(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Request
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Request</DialogTitle>
                    <DialogDescription>
                        Fill in the request details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setError(null);
                            }}
                            placeholder="Enter request title"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                setError(null);
                            }}
                            placeholder="Enter request description"
                        />
                    </div>
                    <div>
                        <Label htmlFor="file">Supporting File</Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={(e) => {
                                handleFileChange(e);
                                setError(null);
                            }}
                            accept="image/jpeg,image/png"
                            placeholder="Upload supporting file"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Supported formats: JPG, PNG (max 5MB)
                        </p>
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Request'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
