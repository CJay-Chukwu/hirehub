import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // call to clerk to update user meta data
  const handleRoleSelection = async (role) => {
    await user
      .update({
        unsafeMetadata: { role },
      })
      .then(() => navigate(role === "recruiter" ? "/post-job" : "/jobs"))
      .catch((err) => console.error("Error updating role: ", err));
  };

  // prevent user from going back to onboarding once role is chosen
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(
        user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs"
      );
    }
  }, [user]);

  //while still loading user data, show spinner
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#1e2a76" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <h2 className="gradient text-transparent bg-clip-text font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a ...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          className="h-36 text-2xl"
          variant="blue"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          className="h-36 text-2xl"
          variant="destructive"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
