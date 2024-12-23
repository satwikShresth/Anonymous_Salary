// src/routes/add.tsx
import { JobForm } from "../components/form";
import type { JobData } from "../types/job.ts";
import { ArrowLeft } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useFormSubmit } from "../hooks/useFormSubmit.tsx";

export const Route = createFileRoute("/form")({
  component: AddCompData,
});

export function AddCompData() {
  const { submitForm, error, success } = useFormSubmit();

  const handleSubmit = (job: JobData) => {
    submitForm(job)
  };

  return (
    <div className="w-11/12 mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          to="/table"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Salary List
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Share Your Co-op Details</h1>
        <p className="text-gray-600 mt-2">Your information will be shared anonymously to help other co-op students</p>
      </div>
      <JobForm onSubmit={handleSubmit} />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">Form submitted successfully!</div>}
    </div>
  );
}
