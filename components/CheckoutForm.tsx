"use client";

import { useState } from "react";
import { createClient } from "../utils/supabase/client";
import kenyaData from "../data/kenyaLocations.json";
import { useRouter } from "next/navigation";

// Define our types
type Address = {
  id: string;
  county: string;
  constituency: string;
  physical_address: string;
};

type CheckoutFormProps = {
  initialAddresses: Address[];
  cartTotal: number;
};

export default function CheckoutForm({ initialAddresses, cartTotal }: CheckoutFormProps) {
  const router = useRouter();
  const supabase = createClient();
  
  // States
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(initialAddresses.length > 0 ? initialAddresses[0].id : null);
  const [showNewAddress, setShowNewAddress] = useState(initialAddresses.length === 0);

  // New Address Form States
  const [newCounty, setNewCounty] = useState("");
  const [newConstituency, setNewConstituency] = useState("");
  const [newPhysicalAddress, setNewPhysicalAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Get constituencies based on selected county
  const availableConstituencies = kenyaData.find(c => c.county === newCounty)?.constituencies || [];

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const newAddressData = {
      user_id: session.user.id,
      county: newCounty,
      constituency: newConstituency,
      physical_address: newPhysicalAddress
    };

    const { data, error } = await supabase
      .from("addresses")
      .insert([newAddressData])
      .select()
      .single();

    if (!error && data) {
      setAddresses([...addresses, data]);
      setSelectedAddressId(data.id);
      setShowNewAddress(false);
      // Reset form
      setNewCounty("");
      setNewConstituency("");
      setNewPhysicalAddress("");
    }
    setIsSaving(false);
  };

  const handlePlaceOrder = () => {
    // This is where you will eventually link to M-Pesa or a payment gateway
    if (deliveryMethod === "delivery" && !selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }
    alert(`Order placed successfully via ${deliveryMethod}!`);
    router.push("/account"); // Redirect somewhere safe for now
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      
      {/* LEFT COLUMN: Delivery Details */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Method Toggle */}
        <div className="bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b pb-4">Fulfillment Method</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setDeliveryMethod("delivery")}
              className={`flex-1 py-4 border-2 font-bold uppercase tracking-widest transition-colors ${deliveryMethod === "delivery" ? "border-[var(--color-brand-dark)] text-[var(--color-brand-dark)] bg-gray-50" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
            >
              Delivery
            </button>
            <button 
              onClick={() => setDeliveryMethod("pickup")}
              className={`flex-1 py-4 border-2 font-bold uppercase tracking-widest transition-colors ${deliveryMethod === "pickup" ? "border-[var(--color-brand-dark)] text-[var(--color-brand-dark)] bg-gray-50" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
            >
              Pick Up at Store
            </button>
          </div>
        </div>

        {/* Dynamic Delivery/Pickup Section */}
        {deliveryMethod === "pickup" ? (
          <div className="bg-white p-6 shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Store Location</h2>
             <p className="text-gray-600">KaziBora Main Depot</p>
             <p className="text-gray-600">Industrial Area, Enterprise Road</p>
             <p className="text-gray-600">Nairobi, Kenya</p>
             <p className="text-sm font-bold text-[var(--color-brand-yellow)] mt-4">Ready within 2 hours of payment.</p>
          </div>
        ) : (
          <div className="bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b pb-4">Shipping Address</h2>
            
            {/* List Saved Addresses */}
            {addresses.length > 0 && !showNewAddress && (
              <div className="space-y-4 mb-6">
                {addresses.map((address, index) => (
                  <label key={address.id} className={`flex items-start p-4 border-2 cursor-pointer transition-colors ${selectedAddressId === address.id ? "border-[var(--color-brand-dark)] bg-gray-50" : "border-gray-100 hover:border-gray-200"}`}>
                    <input 
                      type="radio" 
                      name="address" 
                      className="mt-1 mr-4 accent-[var(--color-brand-dark)]"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                    />
                    <div>
                      <p className="font-bold text-gray-900 uppercase text-sm mb-1">Address {index + 1}</p>
                      <p className="text-gray-600 text-sm">{address.physical_address}</p>
                      <p className="text-gray-600 text-sm">{address.constituency}, {address.county}</p>
                    </div>
                  </label>
                ))}
                <button 
                  onClick={() => setShowNewAddress(true)}
                  className="text-sm font-bold tracking-widest uppercase text-[var(--color-brand-dark)] hover:text-[var(--color-brand-yellow)] transition-colors mt-4 block"
                >
                  + Add New Address
                </button>
              </div>
            )}

            {/* New Address Form */}
            {showNewAddress && (
              <form onSubmit={handleSaveAddress} className="space-y-4 bg-gray-50 p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* County Dropdown */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">County *</label>
                    <select 
                      required 
                      value={newCounty} 
                      onChange={(e) => { setNewCounty(e.target.value); setNewConstituency(""); }}
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--color-brand-yellow)] bg-white"
                    >
                      <option value="">Select County</option>
                      {kenyaData.map(location => (
                        <option key={location.county} value={location.county}>{location.county}</option>
                      ))}
                    </select>
                  </div>

                  {/* Constituency Dropdown */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Constituency *</label>
                    <select 
                      required 
                      value={newConstituency} 
                      onChange={(e) => setNewConstituency(e.target.value)}
                      disabled={!newCounty}
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--color-brand-yellow)] bg-white disabled:bg-gray-100"
                    >
                      <option value="">Select Constituency</option>
                      {availableConstituencies.map(constituency => (
                        <option key={constituency} value={constituency}>{constituency}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Physical Address */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Physical Address *</label>
                  <input 
                    type="text" 
                    required 
                    value={newPhysicalAddress}
                    onChange={(e) => setNewPhysicalAddress(e.target.value)}
                    placeholder="e.g. Apartment, Suite, Building, Street"
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--color-brand-yellow)]"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={isSaving} className="bg-[var(--color-brand-dark)] text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-gray-800 text-sm">
                    {isSaving ? "Saving..." : "Save Address"}
                  </button>
                  {addresses.length > 0 && (
                    <button type="button" onClick={() => setShowNewAddress(false)} className="text-gray-500 font-bold uppercase tracking-widest text-sm hover:text-gray-800">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Order Summary */}
      <div className="bg-gray-50 p-6 border border-gray-200 h-fit sticky top-24">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-300 pb-4">Order Summary</h2>
        
        <div className="space-y-3 mb-6 border-b border-gray-300 pb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>{deliveryMethod === "pickup" ? "Free" : "Calculated at next step"}</span>
          </div>
        </div>
        
        <div className="flex justify-between text-2xl font-bold text-[var(--color-brand-dark)] mb-8">
          <span>Total</span>
          <span>${cartTotal.toLocaleString()}</span>
        </div>

        <button onClick={handlePlaceOrder} className="w-full bg-[var(--color-brand-yellow)] text-[var(--color-brand-dark)] py-4 font-extrabold tracking-widest uppercase hover:bg-yellow-400 transition-colors shadow-sm">
          Confirm & Pay
        </button>
      </div>

    </div>
  );
}