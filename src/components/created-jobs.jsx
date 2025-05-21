import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";

const CreatedJobs = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingMyCreatedJobs,
    data: myCreatedJobs,
    fn: fnMyCreatedJobs,
  } = useFetch(getMyJobs, { recruiter_id: user.id });

  useEffect(() => {
    fnMyCreatedJobs();
  }, [isLoaded]);

  if (!isLoaded || loadingMyCreatedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#1e2a76" />;
  }
  return (
    <div>
      {loadingMyCreatedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCreatedJobs?.length ? (
            myCreatedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onJobSaved={fnMyCreatedJobs}
                isMyJob={true}
              />
            ))
          ) : (
            <div>No Created Jobs found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
