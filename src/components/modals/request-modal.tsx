'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import RequestDetails from '@/components/modals/steps/RequestDetails'
import Review from '@/components/modals/steps/Review'
import AssignPersonnel from '@/components/modals/steps/AssignPersonel'
import Completion from '@/components/modals/steps/Completion'
import Feedback from '@/components/modals/steps/Feedback'

const steps = ['Request Details', 'Review', 'Assign Personnel', 'Completion', 'Feedback']

interface RequestModalProps {
  TriggerName: string
  StepNum?: number
}

export default function RequestModal({TriggerName, StepNum}: RequestModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(StepNum || 0)
  const [formData, setFormData] = useState({
    title: 'Outlet Broken',
    description: 'The outlet is defective',
    category: 'Electrical',
    priorityLevel: 'Low',
    fiscalYear: '2024',
    location: 'asd',
    supportingFile: null,
    requestor: {
      name: 'John Doe',
      department: 'Sample Department',
      division: 'Sample Division'
    },
    assignedPersonnel: [],
    serviceCompleted: false,
    feedback: ''
  })

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <RequestDetails formData={formData} updateFormData={updateFormData} onNext={handleNext} />
      case 1:
        return <Review formData={formData} onNext={handleNext} onPrevious={handlePrevious} />
      case 2:
        return <AssignPersonnel formData={formData} updateFormData={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />
      case 3:
        return <Completion formData={formData} updateFormData={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />
      case 4:
        return <Feedback formData={formData} updateFormData={updateFormData} onPrevious={handlePrevious} onComplete={() => setIsOpen(false)} />
      default:
        return null
    }
  }

  return (
    <>
      <Button variant='secondary' onClick={() => setIsOpen(true)}>{TriggerName}</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="h-[90%] p-0 gap-0">
          <div className="relative flex justify-between my-10 mx-6">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium 
                    ${index === currentStep
                      ? 'bg-primary text-primary-content'
                      : index < currentStep
                        ? 'bg-success text-success-content'
                        : 'bg-secondary text-secondary-content'
                    } z-10`}
                  aria-current={index === currentStep ? 'step' : undefined}
                >
                  {index < currentStep ? (
                    <Check className="size-6" />
                  ) : (
                    index + 1
                  )}
                </div>
              </div>
            ))}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-success/40 -z-10">
              <div
                className="h-full bg-success transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-center">{steps[currentStep]}</h2>
          </div>
          <div className='overflow-y-auto px-6 pb-6'>
            {renderStep()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
