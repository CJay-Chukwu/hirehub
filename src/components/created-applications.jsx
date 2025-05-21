import React, { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { getApplications } from "@/api/apiApplications";
import ApplicationCard from "./application-card";

const CreatedApplications = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, { user_id: user.id });

  useEffect(() => {
    fnApplications();
  }, [isLoaded]);

  if (!isLoaded || loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#1e2a76" />;
  }
  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        );
      })}
    </div>
  );
};

export default CreatedApplications;
