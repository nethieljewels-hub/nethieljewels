"use client";

import FormInput from "@/components/ui/FormInput";
import StateDropdown from "@/components/ui/StateDropdown";
import DistrictDropdown from "@/components/ui/DistrictDropdown";
import type { DeliveryDetails } from "@/utils/localStorage";

interface DeliveryFormProps {
  formData: DeliveryDetails;
  setFormData: (data: DeliveryDetails) => void;
  errors: Record<string, string>;
  onStateChange: (stateName: string, shippingCharge?: number) => void;
}

export default function DeliveryForm({ formData, setFormData, errors, onStateChange }: DeliveryFormProps) {
  function updateField(field: keyof DeliveryDetails, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-600 dark:text-neutral-400">
          Delivery Details &amp; Address
        </h3>
      </div>

      <FormInput
        id="delivery-name"
        label="Full Name"
        value={formData.customerName}
        onChange={(v) => updateField("customerName", v)}
        error={errors.customerName}
        placeholder="Your full name"
      />

      <FormInput
        id="delivery-phone"
        label="Phone Number"
        value={formData.phone}
        onChange={(v) => updateField("phone", v)}
        error={errors.phone}
        placeholder="10-digit mobile number"
        type="tel"
        inputMode="tel"
        maxLength={10}
      />

      <FormInput
        id="delivery-house"
        label="House Name / Flat No"
        value={formData.houseName}
        onChange={(v) => updateField("houseName", v)}
        error={errors.houseName}
        placeholder="House name, building, flat"
      />

      <FormInput
        id="delivery-address"
        label="Address / Street"
        value={formData.address}
        onChange={(v) => updateField("address", v)}
        error={errors.address}
        placeholder="Street, locality, landmark"
      />

      <DistrictDropdown
        value={formData.district}
        state={formData.state}
        onChange={(v) => updateField("district", v)}
        error={errors.district}
      />

      <StateDropdown
        value={formData.state}
        onChange={(stateName, shippingCharge) => {
          setFormData({
            ...formData,
            state: stateName,
            district: "", // reset district when state changes
          });
          onStateChange(stateName, shippingCharge);
        }}
        error={errors.state}
      />

      <FormInput
        id="delivery-pincode"
        label="Pincode"
        value={formData.pincode}
        onChange={(v) => updateField("pincode", v)}
        error={errors.pincode}
        placeholder="6-digit pincode"
        inputMode="numeric"
        maxLength={6}
      />
    </div>
  );
}
