// ============================================================
//  src/sections/LibraryDetails.jsx
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";

const YES_NO = ["Yes", "No"];

const emptyForm = {
  libraryAvailable: "",
  librarianAppointed: "",
  librarianName: "",
  totalBooks: "",
  totalTitles: "",
  newspapersAvailable: "",
  newspaperCount: "",
  magazinesAvailable: "",
  magazineCount: "",
  referenceBooks: "",
  libraryAreaSqft: "",
  readingRoomAvailable: "",
  readingRoomCapacity: "",
  eLibraryAvailable: "",
  internetInLibrary: "",
  libraryWorkingDays: "",
  libraryRemark: "",
};

export default function LibraryDetails({ onTabChange }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert]   = useState(null);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setAlert(null);
    try {
      await fetch("/o/c/librarydetails", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setAlert({ type: "success", message: "Library Details saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally { setSaving(false); }
  };

  const handleReset = () => { setForm(emptyForm); setAlert(null); };

  return (
    <SectionWrapper alert={alert} onCloseAlert={() => setAlert(null)}
      onSave={handleSave} onReset={handleReset} saving={saving}>

      <SectionHeading title="Library Details" />

      <Row3>
        <Field label="Library Available" required>
          <SelectInput value={form.libraryAvailable} onChange={set("libraryAvailable")} options={YES_NO} />
        </Field>
        <Field label="Librarian Appointed" required>
          <SelectInput value={form.librarianAppointed} onChange={set("librarianAppointed")} options={YES_NO} />
        </Field>
        <Field label="Librarian Name">
          <TextInput value={form.librarianName} onChange={set("librarianName")}
            disabled={form.librarianAppointed !== "Yes"} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Total Number of Books" required>
          <TextInput value={form.totalBooks} onChange={set("totalBooks")} type="number" />
        </Field>
        <Field label="Total Number of Titles" required>
          <TextInput value={form.totalTitles} onChange={set("totalTitles")} type="number" />
        </Field>
        <Field label="Reference Books Available" required>
          <SelectInput value={form.referenceBooks} onChange={set("referenceBooks")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Newspapers Available" required>
          <SelectInput value={form.newspapersAvailable} onChange={set("newspapersAvailable")} options={YES_NO} />
        </Field>
        <Field label="Number of Newspapers">
          <TextInput value={form.newspaperCount} onChange={set("newspaperCount")} type="number"
            disabled={form.newspapersAvailable !== "Yes"} />
        </Field>
        <Field label="Magazines Available" required>
          <SelectInput value={form.magazinesAvailable} onChange={set("magazinesAvailable")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Number of Magazines">
          <TextInput value={form.magazineCount} onChange={set("magazineCount")} type="number"
            disabled={form.magazinesAvailable !== "Yes"} />
        </Field>
        <Field label="Library Area (Sq ft)">
          <TextInput value={form.libraryAreaSqft} onChange={set("libraryAreaSqft")} type="number" />
        </Field>
        <Field label="Reading Room Available" required>
          <SelectInput value={form.readingRoomAvailable} onChange={set("readingRoomAvailable")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Reading Room Capacity">
          <TextInput value={form.readingRoomCapacity} onChange={set("readingRoomCapacity")} type="number"
            disabled={form.readingRoomAvailable !== "Yes"} />
        </Field>
        <Field label="E-Library Available" required>
          <SelectInput value={form.eLibraryAvailable} onChange={set("eLibraryAvailable")} options={YES_NO} />
        </Field>
        <Field label="Internet in Library" required>
          <SelectInput value={form.internetInLibrary} onChange={set("internetInLibrary")} options={YES_NO} />
        </Field>
      </Row3>

      <Row2>
        <Field label="Library Working Days Per Week">
          <TextInput value={form.libraryWorkingDays} onChange={set("libraryWorkingDays")} type="number" />
        </Field>
        <Field label="Remark">
          <TextInput value={form.libraryRemark} onChange={set("libraryRemark")} />
        </Field>
      </Row2>
    </SectionWrapper>
  );
}