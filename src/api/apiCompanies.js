import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export const getCompanies = async (token) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching company data: ", error);
    return null;
  }
  return data;
};

// create new company
export const addNewCompany = async (token, _, companyData) => {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  // upload to supabase bucket
  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo_url);

  if (storageError) {
    console.error("Error uploading company logo: ", storageError);
    return null;
  }

  // get full resume path
  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([{ name: companyData.name, logo_url }])
    .select();

  if (error) {
    console.error("Error creating company: ", error);
    return null;
  }
  return data;
};
