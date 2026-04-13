// ============================================================
//  src/sections/SchoolBankDetails.jsx
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";

const ACCOUNT_TYPE = ["Savings","Current","OD Account"];

const emptyForm = {
  bankName: "", branchName: "", ifscCode: "",
  accountNumber: "", confirmAccountNumber: "",
  accountHolderName: "", accountType: "",
  micrCode: "", bankAddress: "",
};

export default function SchoolBankDetails({ onTabChange }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [alert, setAlert]   = useState(null);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.bankName.trim())          e.bankName = "Required";
    if (!form.branchName.trim())        e.branchName = "Required";
    if (!form.ifscCode.trim())          e.ifscCode = "Required";
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode.toUpperCase()))
                                        e.ifscCode = "Invalid IFSC format (e.g. SBIN0001234)";
    if (!form.accountNumber.trim())     e.accountNumber = "Required";
    if (form.accountNumber !== form.confirmAccountNumber)
                                        e.confirmAccountNumber = "Account numbers do not match";
    if (!form.accountHolderName.trim()) e.accountHolderName = "Required";
    if (!form.accountType)              e.accountType = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setAlert({ type: "error", message: "Please fix the highlighted errors." }); return;
    }
    setSaving(true); setAlert(null);
    try {
      const { confirmAccountNumber, ...payload } = form;
      await fetch("/o/c/schoolbankdetails", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setAlert({ type: "success", message: "School Bank Details saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally { setSaving(false); }
  };

  const handleReset = () => { setForm(emptyForm); setErrors({}); setAlert(null); };

  return (
    <SectionWrapper alert={alert} onCloseAlert={() => setAlert(null)}
      onSave={handleSave} onReset={handleReset} saving={saving}>

      <SectionHeading title="School Bank Details" />

      <Row3>
        <Field label="Bank Name" required error={errors.bankName}>
          <TextInput value={form.bankName} onChange={set("bankName")} />
        </Field>
        <Field label="Branch Name" required error={errors.branchName}>
          <TextInput value={form.branchName} onChange={set("branchName")} />
        </Field>
        <Field label="IFSC Code" required error={errors.ifscCode}>
          <TextInput value={form.ifscCode} onChange={(v) => set("ifscCode")(v.toUpperCase())} placeholder="e.g. SBIN0001234" />
        </Field>
      </Row3>

      <Row3>
        <Field label="Account Number" required error={errors.accountNumber}>
          <TextInput value={form.accountNumber} onChange={set("accountNumber")} />
        </Field>
        <Field label="Confirm Account Number" required error={errors.confirmAccountNumber}>
          <TextInput value={form.confirmAccountNumber} onChange={set("confirmAccountNumber")} />
        </Field>
        <Field label="Account Holder Name" required error={errors.accountHolderName}>
          <TextInput value={form.accountHolderName} onChange={set("accountHolderName")} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Account Type" required error={errors.accountType}>
          <SelectInput value={form.accountType} onChange={set("accountType")} options={ACCOUNT_TYPE} />
        </Field>
        <Field label="MICR Code">
          <TextInput value={form.micrCode} onChange={set("micrCode")} />
        </Field>
        <Field label="Bank Address">
          <TextInput value={form.bankAddress} onChange={set("bankAddress")} />
        </Field>
      </Row3>

    </SectionWrapper>
  );
}