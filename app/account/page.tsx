import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Protect the route
  if (!user) {
    return redirect("/login");
  }

  // Fetch their profile name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Server Action: Update Name
  const updateProfile = async (formData: FormData) => {
    "use server";
    const fullName = formData.get("fullName") as string;
    const supabaseServer = await createClient();
    
    await supabaseServer.from("profiles").update({ full_name: fullName }).eq("id", user.id);
    return redirect("/account?message=Profile updated successfully");
  };

  // Server Action: Update Password
  const updatePassword = async (formData: FormData) => {
    "use server";
    const password = formData.get("password") as string;
    const supabaseServer = await createClient();
    
    const { error } = await supabaseServer.auth.updateUser({ password });
    if (error) return redirect(`/account?message=${error.message}`);
    return redirect("/account?message=Password updated successfully");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h1 className="text-3xl font-extrabold text-[var(--color-brand-dark)] tracking-tighter mb-8 uppercase">
          Account Management
        </h1>

        {resolvedParams.message && (
          <div className="p-4 mb-8 text-sm bg-gray-100 text-[var(--color-brand-dark)] font-bold border-l-4 border-[var(--color-brand-yellow)]">
            {resolvedParams.message}
          </div>
        )}

        <div className="space-y-8">
          
          {/* Profile Section */}
          <div className="bg-white p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Profile Details</h2>
            <form action={updateProfile} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow w-full">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wider block mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  defaultValue={profile?.full_name || ""} 
                  className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--color-brand-yellow)]"
                />
              </div>
              <button className="bg-[var(--color-brand-dark)] text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors h-[50px]">
                Save
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-500">Email: {user.email}</p>
          </div>

          {/* Security Section */}
          <div className="bg-white p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Security</h2>
            <form action={updatePassword} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow w-full">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wider block mb-2">New Password</label>
                <input 
                  type="password" 
                  name="password" 
                  required
                  placeholder="Leave blank to keep current"
                  className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--color-brand-yellow)]"
                />
              </div>
              <button className="bg-gray-200 text-gray-800 px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors h-[50px]">
                Update
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-8 shadow-sm border border-red-100">
            <h2 className="text-lg font-bold text-red-700 uppercase tracking-widest border-b border-red-200 pb-4 mb-6">Danger Zone</h2>
            <p className="text-sm text-red-600 mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <form>
              <button 
                formAction={async () => {
                  "use server";
                  const supabaseServer = await createClient();
                  // Call the SQL function we created
                  await supabaseServer.rpc('delete_user');
                  await supabaseServer.auth.signOut();
                  return redirect("/");
                }}
                className="bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </form>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}