import supabaseClient from "@/utils/supabase";

// retrieve all jobs based on filters
export const getJobs = async (token, { location, company_id, searchQuery }) => {
  const supabase = await supabaseClient(token);

  // define query
  let query = supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url), saved:saved_jobs(id)");

  // filter by location
  if (location) {
    query = query.eq("location", location);
  }

  // filter by company_id
  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  // filter by searchQuery
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  // send query
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching jobs: ", error);
    return null;
  }
  return data;
};

// mark a job as saved or unsave
export const saveJob = async (token, { alreadySaved }, saveData) => {
  const supabase = await supabaseClient(token);

  // if already saved, remove from saved_jobs table
  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error deleting saved job: ", deleteError);
      return null;
    }
    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error inserting saved job: ", insertError);
      return null;
    }
    return data;
  }
};

// retrieve a single job  using id
export const getSingleJob = async (token, { job_id }) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "*, company:companies(name, logo_url), applications:applications(*)"
    )
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error fetching single job: ", error);
    return null;
  }
  return data;
};

// change job isOpen value
export const updateHiringStatus = async (token, { job_id }, isOpen) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error updating job: ", error);
    return null;
  }
  return data;
};

// insert new job from jobData object
export const addNewJob = async (token, _, jobData) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Error creating job: ", error);
    return null;
  }
  return data;
};

// get saved jobs
export const getSavedJobs = async (token) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job:jobs(*, company:companies(name,logo_url))");

  if (error) {
    console.error("Error fetching saved jobs: ", error);
    return null;
  }
  return data;
};

// get all jobs posted by recruiter
export const getMyJobs = async (token, { recruiter_id }) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching my jobs: ", error);
    return null;
  }
  return data;
};

// delete a job
export const deleteJob = async (token, { job_id }) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error deleting job: ", error);
    return null;
  }
  return data;
};
