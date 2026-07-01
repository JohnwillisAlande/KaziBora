import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AddressManager from "../../components/AddressManager";

export default async function AccountPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ message?: string, error?: string, state?: string }> 
}) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

    const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // --- SERVER ACTIONS ---

  const updateProfile = async (formData: FormData) => {
    "use server";
    const fullName = formData.get("fullName") as string;
    const supabaseServer = await createClient();
    await supabaseServer.from("profiles").update({ full_name: fullName }).eq("id", user.id);
    return redirect("/account?message=Profile updated successfully");
  };

  // Action 1: Send the Magic Link
  const sendPasswordResetLink = async () => {
    "use server";
    const supabaseServer = await createClient();
    
    // We explicitly tell Supabase to route them back through our callback, 
    // and then land them on this exact page in the 'update_password' state.
    const { error } = await supabaseServer.auth.resetPasswordForEmail(user.email as string, {
      redirectTo: `http://localhost:3000/auth/callback?next=/account?state=update_password`,
    });
    
    if (error) return redirect(`/account?error=${error.message}`);
    return redirect("/account?message=Check your email for the secure reset link."); 
  };

  // Action 2: Save the New Password (after they click the link)
  const saveNewPassword = async (formData: FormData) => {
    "use server";
    const newPassword = formData.get("newPassword") as string;
    const supabaseServer = await createClient();
    
    // Because they clicked the magic link, they are already securely authenticated!
    // We can confidently update their password immediately.
    const { error: updateError } = await supabaseServer.auth.updateUser({ 
      password: newPassword 
    });

    if (updateError) return redirect(`/account?state=update_password&error=${updateError.message}`);
    return redirect("/account?message=Password securely updated");
  };

  const deleteAccount = async () => {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer.rpc('delete_user');
    await supabaseServer.auth.signOut();
    return redirect("/");
  };

  // --- UI RENDER ---

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h1 className="text-3xl font-extrabold text-[var(--color-brand-dark)] tracking-tighter mb-8 uppercase">
          Account Management
        </h1>

        {/* Success Messages */}
        {resolvedParams.message && (
          <div className="p-4 mb-8 text-sm bg-gray-100 text-[var(--color-brand-dark)] font-bold border-l-4 border-[var(--color-brand-yellow)]">
            {resolvedParams.message}
          </div>
        )}

        {/* Error Messages */}
        {resolvedParams.error && (
          <div className="p-4 mb-8 text-sm bg-red-50 text-red-700 font-bold border-l-4 border-red-500">
            {resolvedParams.error}
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

          {/* --- NEW ADDRESS BOOK SECTION --- */}
          <AddressManager initialAddresses={addresses || []} />

          {/* Security Section (Magic Link Flow) */}
          <div className="bg-white p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Security</h2>
            
            {resolvedParams.state === "update_password" ? (
              
              // STATE 2: The user has clicked the email link and returned
              <form action={saveNewPassword} className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Your identity is verified. Enter your new password below.</p>
                
                <div className="w-full">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wider block mb-2">New Password</label>
                  <input type="password" name="newPassword" required placeholder="Enter new password" className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--color-brand-yellow)]" />
                </div>
                
                <button className="bg-[var(--color-brand-dark)] text-white px-8 py-3 font-bold uppercase tracking-widest mt-2 hover:bg-[var(--color-brand-yellow)] hover:text-[var(--color-brand-dark)] transition-colors">
                  Save New Password
                </button>
              </form>

            ) : (

              // STATE 1: Request the Magic Link
              <form action={sendPasswordResetLink}>
                <p className="text-sm text-gray-600 mb-4">To change your password, we will send a secure link to your email to verify your identity.</p>
                <button className="bg-gray-200 text-gray-800 px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors">
                  Send Reset Link
                </button>
              </form>

            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-8 shadow-sm border border-red-100">
            <h2 className="text-lg font-bold text-red-700 uppercase tracking-widest border-b border-red-200 pb-4 mb-6">Danger Zone</h2>
            <p className="text-sm text-red-600 mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <form action={deleteAccount}>
              <button className="bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-red-700 transition-colors">
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