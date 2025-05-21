import React, { useEffect } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { addNewCompany } from "@/api/apiCompanies";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Input } from "./ui/input";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (files) =>
        files &&
        files.length > 0 &&
        ["image/png", "image/jpeg", "image/svg+xml"].includes(files[0].type),
      { message: "Only images are allowed" }
    ),
});

const CompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    data: dataAddCompany,
    error: errorAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  // handle submit
  const onSubmit = (data) => {
    fnAddCompany({ ...data, logo_url: data.logo[0] });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
    }
  }, [loadingAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a new company</DrawerTitle>
        </DrawerHeader>
        <form className="flex gap-2 p-4 pb-0">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Company name"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="logo"
            render={({ field }) => (
              <Input
                type="file"
                accept="image/*"
                className="file:text-gray-500"
                onChange={(e) => field.onChange(e.target.files)}
              />
            )}
          />

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40"
          >
            Add
          </Button>
        </form>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}

        {/* error adding to DB */}
        {errorAddCompany?.message && (
          <p className="text-red-500">{errorAddCompany?.message}</p>
        )}
        {loadingAddCompany && (
          <BarLoader className="mb-4" width={"100%"} color="#1e2a76" />
        )}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CompanyDrawer;
