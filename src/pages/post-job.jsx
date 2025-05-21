import React, { useEffect } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/use-fetch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { City } from "country-state-city";
import { Input } from "@/components/ui/input";
import { getCompanies } from "@/api/apiCompanies";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Navigate, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { addNewJob } from "@/api/apiJobs";
import CompanyDrawer from "@/components/company-drawer";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new company" }),
  requirements: z.string().min(1, { message: "Requirements must be provided" }),
});

const PostJob = () => {
  const navigate = useNavigate();

  const { user, isLoaded } = useUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  const {
    loading: loadingCreateJob,
    data: dataCreateJob,
    error: errorCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  // handle submit
  const onSubmit = (data) => {
    fnCreateJob({ ...data, recruiter_id: user.id, isOpen: true });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) {
      navigate("/jobs");
    }
  }, [loadingCreateJob]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#1e2a76" />;
  }

  // candidate can't access page
  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }
  return (
    <div>
      <h1 className="gradient text-transparent bg-clip-text font-extrabold text-4xl sm:text-6xl text-center pb-8">
        Post a Job
      </h1>

      <form
        className="flex flex-col gap-4 p-4 pb-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              className="flex-1"
              placeholder="Job title"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              placeholder="Job description"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {City.getCitiesOfCountry("SZ").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Other company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ id, name }) => {
                      return (
                        <SelectItem key={name} value={id}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {/* Add company drawer to add new company */}
          <CompanyDrawer fetchCompanies={fnCompanies} />
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        {/* adding markdown for the requirements */}
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}

        {/* error if cannot post job */}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}

        {/* loader as submitting is being done */}
        {loadingCreateJob && (
          <BarLoader className="mb-4" width={"100%"} color="#1e2a76" />
        )}

        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
