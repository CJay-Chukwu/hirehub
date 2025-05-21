import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

// custom hook to fetch data
const useFetch = (cb, options = {}) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const { session } = useSession(); // depends on user being loaded

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });

      // call the passed function that gets the job data
      const response = await cb(supabaseAccessToken, options, ...args);

      setData(response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { fn, data, loading, error };
};

export default useFetch;
