"use client";

import { useState } from "react";
import { createClient } from "../utils/supabase/client";
import kenyaData from "../data/kenyaLocations.json";

type Address = {
  id: string;
  county: string;
  constituency: string;
  physical_address: string;
};

export default function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  
  // Form States
  const [newCounty, setNewCounty] = useState("");
  const [newConstituency, setNewConstituency] = useState("");
  const [newPhysicalAddress, setNewPhysicalAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();
  const availableConstituencies = kenyaData.find(c => c.county === newCounty)?.constituencies || [];

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("addresses")
      .insert([{
        user_id: session.user.id,
        county: newCounty,
        constituency: newConstituency,
        physical_address: newPhysicalAddress
      }])
      .select()
      .single();

    if (!error && data) {
      setAddresses([...addresses, data]);
      setShowForm(false);
      setNewCounty("");
      setNewConstituency("");
      setNewPhysicalAddress("");
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setAddresses(addresses.filter(addr => addr.id !== id));
    
    // Cloud sync
    await supabase.from("addresses").delete().eq("id", id);
  };

  return (
    <div className="bg-white p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-lg font-bold uppercase tracking-widest">Address Book</h2>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="text-sm font-bold text-[var(--color-brand-dark)] hover:text-[var(--color-brand-yellow)] uppercase tracking-widest transition-colors"
          >
            + Add New
          </button>
        )}
      </div>

      {/* Address List */}
      {!showForm && (
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <p className="text-gray-500 text-sm">You have no saved addresses.</p>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="flex justify-between items-start p-4 border border-gray-200 bg-gray-50">
                <div>
                  <p className="text-gray-900 font-bold mb-1 text-sm">{address.physical_address}</p>
                  <p className="text-gray-600 text-sm">{address.constituency}, {address.county}</p>
                </div>
                <button 
                  onClick={() => handleDelete(address.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-bold uppercase tracking-widest transition-colors"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add New Address Form */}
      {showForm && (
        <form onSubmit={handleAddAddress} className="space-y-4 bg-gray-50 p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 font-bold uppercase tracking-widest text-sm hover:text-gray-800">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}