"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Pencil, Trash2, Check, X, Home, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

const MOCK_ADDRESSES = [
  {
    id: "addr-1",
    label: "Home",
    firstName: "Pratibha",
    lastName: "Sharma",
    phone: "9876543210",
    addressLine1: "Flat 402, Green Meadows",
    addressLine2: "Near Lotus Park",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    firstName: "Pratibha",
    lastName: "Sharma",
    phone: "9876543210",
    addressLine1: "9 & 10, ADI House, Ground Floor",
    addressLine2: "Vijay Manjrekar Rd, Dadar West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400028",
    isDefault: false,
  },
];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh","Puducherry"
];

const EMPTY_FORM = {
  label: "Home", firstName: "", lastName: "", phone: "",
  addressLine1: "", addressLine2: "", city: "", state: "Maharashtra", pincode: "",
};

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47]";

function AddressForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "Valid 10-digit number needed";
    if (!form.addressLine1.trim()) e.addressLine1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.pincode || !/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Valid 6-digit PIN required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave({ ...form, id: initial?.id || `addr-${Date.now()}`, isDefault: initial?.isDefault || false });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-[#FAF8F5] p-5 rounded-2xl border border-amber-100/60">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-sm font-bold text-[#141b28]">{initial ? "Edit Address" : "New Address"}</h3>
        <div className="flex gap-2 ml-auto">
          {["Home", "Office", "Other"].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => set("label", l)}
              className={`px-3 py-1 rounded-full text-xs border font-medium transition-all ${
                form.label === l ? "bg-[#41542f] text-white border-[#41542f]" : "bg-white text-slate-500 border-slate-200"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">First Name *</label>
          <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
            className={errors.firstName ? inputCls.replace("border-slate-200", "border-red-400") : inputCls}
            placeholder="e.g. Pratibha" />
          {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Last Name *</label>
          <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
            className={errors.lastName ? inputCls.replace("border-slate-200", "border-red-400") : inputCls}
            placeholder="e.g. Sharma" />
          {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700 block mb-1">Mobile Number *</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">+91</span>
          <input value={form.phone} maxLength={10} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
            className={`${errors.phone ? inputCls.replace("border-slate-200","border-red-400") : inputCls} pl-11`}
            placeholder="9876543210" />
        </div>
        {errors.phone && <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700 block mb-1">Street Address *</label>
        <input value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)}
          className={errors.addressLine1 ? inputCls.replace("border-slate-200","border-red-400") : inputCls}
          placeholder="Flat no., Society/Building name" />
        {errors.addressLine1 && <p className="text-xs text-red-500 mt-0.5">{errors.addressLine1}</p>}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700 block mb-1">Landmark (Optional)</label>
        <input value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)}
          className={inputCls} placeholder="Near xyz, Area name" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">City *</label>
          <input value={form.city} onChange={(e) => set("city", e.target.value)}
            className={errors.city ? inputCls.replace("border-slate-200","border-red-400") : inputCls}
            placeholder="Mumbai" />
          {errors.city && <p className="text-xs text-red-500 mt-0.5">{errors.city}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">State</label>
          <select value={form.state} onChange={(e) => set("state", e.target.value)}
            className={`${inputCls} appearance-none`}>
            {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">PIN Code *</label>
          <input value={form.pincode} maxLength={6} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
            className={errors.pincode ? inputCls.replace("border-slate-200","border-red-400") : inputCls}
            placeholder="400050" />
          {errors.pincode && <p className="text-xs text-red-500 mt-0.5">{errors.pincode}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#997b47] text-white text-sm font-semibold hover:bg-[#836838] transition-colors shadow-gold disabled:opacity-60"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <Check className="w-4 h-4"/>}
          {saving ? "Saving..." : (initial ? "Save Changes" : "Add Address")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const LabelIcon = address.label === "Office" ? Briefcase : Home;
  return (
    <div className={`relative bg-white rounded-2xl border shadow-soft-sm p-5 transition-all ${
      address.isDefault ? "border-[#997b47]/40 shadow-gold/10" : "border-slate-100 hover:shadow-soft"
    }`}>
      {address.isDefault && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-[#997b47] bg-[#997b47]/10 px-2 py-0.5 rounded-full">
          <Check className="w-2.5 h-2.5" /> Default
        </span>
      )}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-[#f7ece6] rounded-lg flex items-center justify-center">
          <LabelIcon className="w-3.5 h-3.5 text-[#997b47]" />
        </div>
        <span className="text-xs font-bold text-[#141b28] uppercase tracking-wide">{address.label}</span>
      </div>
      <p className="text-sm font-semibold text-[#141b28]">{address.firstName} {address.lastName}</p>
      <p className="text-xs text-slate-500 leading-relaxed mt-1">
        {address.addressLine1}
        {address.addressLine2 && `, ${address.addressLine2}`},
        {" "}{address.city}, {address.state} - {address.pincode}
      </p>
      <p className="text-xs text-slate-400 mt-1">+91 {address.phone}</p>

      <div className="flex items-center gap-2 mt-4">
        <button onClick={() => onEdit(address)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#997b47] border border-slate-200 px-2.5 py-1.5 rounded-lg hover:border-[#997b47]/40 transition-all">
          <Pencil className="w-3 h-3" /> Edit
        </button>
        {!address.isDefault && (
          <button onClick={() => onSetDefault(address.id)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#41542f] border border-slate-200 px-2.5 py-1.5 rounded-lg transition-all">
            <Check className="w-3 h-3" /> Set Default
          </button>
        )}
        <button onClick={() => onDelete(address.id)}
          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 border border-red-100 px-2.5 py-1.5 rounded-lg hover:border-red-300 transition-all ml-auto">
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  );
}

import { addressesApi } from "@/services/api";

export default function AddressesClient() {
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const res = await addressesApi.getAll();
      const mapped = res.data.map(addr => {
        const parts = (addr.full_name || "").split(" ");
        return {
          id: addr.id,
          label: addr.type ? addr.type.charAt(0).toUpperCase() + addr.type.slice(1) : "Home",
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" ") || "",
          phone: addr.phone || "",
          addressLine1: addr.address_line_1 || "",
          addressLine2: addr.address_line_2 || "",
          city: addr.city || "",
          state: addr.state || "",
          pincode: addr.postal_code || "",
          isDefault: addr.is_default || false,
          original: addr // Keep original for update reference
        };
      });
      setAddresses(mapped);
    } catch (err) {
      toast.error("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAddresses();
  }, []);

  if (!mounted) return null;

  const handleSave = async (addrForm) => {
    try {
      const payload = {
        type: addrForm.label.toLowerCase(),
        full_name: `${addrForm.firstName} ${addrForm.lastName}`.trim(),
        phone: addrForm.phone,
        address_line_1: addrForm.addressLine1,
        address_line_2: addrForm.addressLine2,
        city: addrForm.city,
        state: addrForm.state,
        postal_code: addrForm.pincode,
        country: 'India',
        is_default: addrForm.isDefault || false,
      };

      if (editingAddr) {
        await addressesApi.update(editingAddr.id, payload);
        toast.success("Address updated!");
      } else {
        await addressesApi.create(payload);
        toast.success("Address added!");
      }
      
      setShowForm(false);
      setEditingAddr(null);
      fetchAddresses();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save address.");
    }
  };

  const handleEdit = (addr) => {
    setEditingAddr({
      id: addr.id,
      label: addr.label,
      firstName: addr.firstName,
      lastName: addr.lastName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await addressesApi.delete(id);
      toast.success("Address deleted.");
      fetchAddresses();
    } catch {
      toast.error("Failed to delete address.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const addrToUpdate = addresses.find(a => a.id === id);
      if(!addrToUpdate) return;
      await addressesApi.update(id, {
        type: addrToUpdate.label.toLowerCase(),
        full_name: `${addrToUpdate.firstName} ${addrToUpdate.lastName}`.trim(),
        phone: addrToUpdate.phone,
        address_line_1: addrToUpdate.addressLine1,
        address_line_2: addrToUpdate.addressLine2,
        city: addrToUpdate.city,
        state: addrToUpdate.state,
        postal_code: addrToUpdate.pincode,
        is_default: true,
      });
      toast.success("Default address updated.");
      fetchAddresses();
    } catch {
      toast.error("Failed to update default address.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#141b28]"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}>
            Saved Addresses
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{addresses.length} saved address{addresses.length !== 1 ? "es" : ""}</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setEditingAddr(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#41542f] text-white text-sm font-semibold hover:bg-[#344326] transition-colors shadow-brand"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        )}
      </div>

      {showForm && (
        <AddressForm
          initial={editingAddr}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingAddr(null); }}
        />
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <MapPin className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">No saved addresses</p>
          <p className="text-slate-400 text-xs mt-1">Add an address to speed up future checkouts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
}
