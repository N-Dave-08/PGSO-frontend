import React from 'react'

interface CapabilitiesCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function CapabilitiesCard({ icon, title, description }: CapabilitiesCardProps) {
    return (
        <div className="card bg-neutral">
            <div className="card-body">
                {icon}
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    )
}
