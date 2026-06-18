import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CheckoutForm from "../../components/CheckoutForm";
import allProducts from "../../data/products.json";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Kick out unauthenticated users
  if (!user) {
    return redirect("/login?message=Please log in to checkout");
  }

  // 2. Fetch their saved addresses
  const { data: savedAddresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 3. Fetch their cart from the database to securely calculate the total on the server
  const { data: dbCart } = await supabase
    .from("cart_items")
    .select("product_id, quantity")
    .eq("user_id", user.id);

  if (!dbCart || dbCart.length === 0) {
    return redirect("/cart"); // Don't let them checkout an empty cart
  }

  // Calculate total securely
  const cartTotal = dbCart.reduce((total, item) => {
    const product = allProducts.find(p => p.id === item.product_id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[var(--color-brand-dark)] tracking-tighter uppercase">
            Secure Checkout
          </h1>
        </div>

        {/* Mount the interactive Client Component */}
        <CheckoutForm 
          initialAddresses={savedAddresses || []} 
          cartTotal={cartTotal} 
        />

      </div>

      <Footer />
    </main>
  );
}