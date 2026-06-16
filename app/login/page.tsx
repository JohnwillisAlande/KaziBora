import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const resolvedParams = await searchParams;
  const message = resolvedParams.message;

  // Server Action: Handle Logging In
  const signIn = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
    return redirect("/"); // Send them to the homepage on success
  };

  // Server Action: Handle Sign Up
  const signUp = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    console.log("=== ENV CHECK ===");
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) + "...");
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName, // This maps to your profiles table!
        },
      },
    });

    if (error) {
        console.error("SUPABASE SIGNUP ERROR:", error.message);
      return redirect("/login?message=Could not create account");
    }
    return redirect("/login?message=Check your email to continue sign in process");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <Link href="/" className="text-2xl font-bold text-[var(--color-brand-dark)] tracking-tighter mb-8 block">
        KaziBora
      </Link>

      <div className="w-full max-w-md bg-white p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-widest">
          Account Portal
        </h2>

        {message && (
          <div className="p-4 mb-6 text-sm text-center bg-gray-100 text-gray-900 font-semibold border-l-4 border-[var(--color-brand-yellow)]">
            {message}
          </div>
        )}

        <form className="flex flex-col space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wider block mb-1">Full Name (New Users)</label>
            <input
              name="fullName"
              placeholder="John Doe"
              className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--color-brand-yellow)]"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wider block mb-1">Email *</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--color-brand-yellow)]"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wider block mb-1">Password *</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--color-brand-yellow)]"
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              formAction={signIn}
              className="w-full bg-[var(--color-brand-dark)] text-white font-bold tracking-widest uppercase py-4 hover:bg-gray-800 transition-colors"
            >
              Sign In
            </button>
            <button
              formAction={signUp}
              className="w-full bg-white text-[var(--color-brand-dark)] border border-[var(--color-brand-dark)] font-bold tracking-widest uppercase py-4 hover:bg-gray-50 transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}