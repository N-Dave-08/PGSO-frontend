import { HTMLAttributes } from 'react';

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export interface Capability {
  title: string;
  description: string;
}

export interface Process {
  title: string;
  description: string;
  steps: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
