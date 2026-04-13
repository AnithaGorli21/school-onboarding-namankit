// ============================================================
//  src/sections/SchoolProfile.jsx
//  FIXED: State dropdown added before District
//  Cascade: State → District → Taluka → Village → PO Name
// ============================================================
import { useEffect, useState } from "react";
import {
  Field, TextInput, SelectInput,
  SectionHeading, Row3, Row2,
} from "../components/FormFields";
import {
  getStates, getDistricts, getTalukas, getVillages, getPoNames,
} from "../api/liferay";

const SCHOOL_BOARD_OPTIONS   = ["SSC Board", "CBSE Board", "ICSE Board", "State Board"];
const WEBSITE_OPTIONS        = ["Yes", "No"];
const AREA_OPTIONS           = ["Rural", "Urban", "Semi-Urban", "Tribal"];
const YEAR_OPTIONS           = Array.from({ length: 75 }, (_, i) => String(2024 - i));
const SELECTION_YEAR_OPTIONS = [
  "2018-19","2019-20","2020-21","2021-22","2022-23","2023-24","2024-25",
];

export default function SchoolProfile({ form, setForm, errors }) {
  const [states,    setStates]    = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas,   setTalukas]   = useState([]);
  const [villages,  setVillages]  = useState([]);
  const [poNames,   setPoNames]   = useState([]);

  // ── Load states once on mount ──────────────────────────────
  useEffect(() => {
    getStates()
      .then(setStates)
      .catch(() => setStates([
        { value: 1, label: "Maharashtra" },
        { value: 2, label: "Gujarat" },
        { value: 3, label: "Karnataka" },
      ]));
  }, []);

  // ── Load districts when state changes ─────────────────────
  useEffect(() => {
    if (!form.state) { setDistricts([]); return; }
    getDistricts(form.state)
      .then(setDistricts)
      .catch(() => setDistricts([
        { value: 1, label: "Nashik" },
        { value: 2, label: "Pune" },
        { value: 3, label: "Nagpur" },
      ]));
  }, [form.state]);

  // ── Load talukas when district changes ─────────────────────
  useEffect(() => {
    if (!form.district) { setTalukas([]); return; }
    getTalukas(form.district)
      .then(setTalukas)
      .catch(() => setTalukas([{ value: 1, label: "Trimbakeshwar" }]));
  }, [form.district]);

  // ── Load villages when taluka changes ──────────────────────
  useEffect(() => {
    if (!form.taluka) { setVillages([]); return; }
    getVillages(form.taluka)
      .then(setVillages)
      .catch(() => setVillages([{ value: 1, label: "Anjaneri" }]));
  }, [form.taluka]);

  // ── Load PO names when village changes ─────────────────────
  useEffect(() => {
    if (!form.village) { setPoNames([]); return; }
    getPoNames(form.village)
      .then(setPoNames)
      .catch(() => setPoNames([{ value: 1, label: "Nashik PO" }]));
  }, [form.village]);

  const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

  // Cascade reset handlers
  const onStateChange = (val) =>
    setForm((p) => ({ ...p, state: val, district: "", taluka: "", village: "", poName: "" }));

  const onDistrictChange = (val) =>
    setForm((p) => ({ ...p, district: val, taluka: "", village: "", poName: "" }));

  const onTalukaChange = (val) =>
    setForm((p) => ({ ...p, taluka: val, village: "", poName: "" }));

  const onVillageChange = (val) =>
    setForm((p) => ({ ...p, village: val, poName: "" }));

  return (
    <div>
      <SectionHeading title="School Profile" />

      {/* Row 1: Trustee Name | School Name | Address */}
      <Row3>
        <Field label="Trustee Name" required error={errors.trusteeName}>
          <TextInput value={form.trusteeName} onChange={set("trusteeName")} />
        </Field>
        <Field label="School Name" error={errors.schoolName}>
          <TextInput value={form.schoolName} onChange={set("schoolName")} />
        </Field>
        <Field label="Address" error={errors.address}>
          <TextInput value={form.address} onChange={set("address")} />
        </Field>
      </Row3>

      {/* Row 2: Mobile No | State | District */}
      <Row3>
        <Field label="Mobile No" error={errors.mobileNumber}>
          <TextInput value={form.mobileNumber} onChange={set("mobileNumber")} type="tel" />
        </Field>
        <Field label="State" error={errors.state}>
          <SelectInput
            value={form.state}
            onChange={onStateChange}
            options={states}
          />
        </Field>
        <Field label="District" error={errors.district}>
          <SelectInput
            value={form.district}
            onChange={onDistrictChange}
            options={districts}
            disabled={!form.state}
          />
        </Field>
      </Row3>

      {/* Row 3: Taluka | Village | Pincode */}
      <Row3>
        <Field label="Taluka" error={errors.taluka}>
          <SelectInput
            value={form.taluka}
            onChange={onTalukaChange}
            options={talukas}
            disabled={!form.district}
          />
        </Field>
        <Field label="Village" error={errors.village}>
          <SelectInput
            value={form.village}
            onChange={onVillageChange}
            options={villages}
            disabled={!form.taluka}
          />
        </Field>
        <Field label="Pincode" required error={errors.pincode}>
          <TextInput value={form.pincode} onChange={set("pincode")} />
        </Field>
      </Row3>

      {/* Row 4: Email ID | PO Name | UDISE Code */}
      <Row3>
        <Field label="Email ID" error={errors.emailId}>
          <TextInput value={form.emailId} onChange={set("emailId")} type="email" />
        </Field>
        <Field label="PO Name" error={errors.poName}>
          <SelectInput
            value={form.poName}
            onChange={set("poName")}
            options={poNames}
            disabled={!form.village}
          />
        </Field>
        <Field label="UDISE Code" error={errors.udiseCode}>
          <TextInput value={form.udiseCode} onChange={set("udiseCode")} />
        </Field>
      </Row3>

      {/* Row 5: School Selection Year | School Reg No | School Board */}
      <Row3>
        <Field label="School Selection Year" required error={errors.schoolSelectionYear}>
          <SelectInput
            value={form.schoolSelectionYear}
            onChange={set("schoolSelectionYear")}
            options={SELECTION_YEAR_OPTIONS}
          />
        </Field>
        <Field label="School Registration No" required error={errors.schoolRegistrationNumber}>
          <TextInput value={form.schoolRegistrationNumber} onChange={set("schoolRegistrationNumber")} />
        </Field>
        <Field label="School Board" required error={errors.schoolBoard}>
          <SelectInput
            value={form.schoolBoard}
            onChange={set("schoolBoard")}
            options={SCHOOL_BOARD_OPTIONS}
          />
        </Field>
      </Row3>

      {/* Row 6: SSC Batches | Year of Establishment | Website Available */}
      <Row3>
        <Field label="Total Number Of SSC Batches Completed" required error={errors.sscBatchesCompletedCount}>
          <TextInput value={form.sscBatchesCompletedCount} onChange={set("sscBatchesCompletedCount")} type="number" />
        </Field>
        <Field label="Year Of Establishment" required error={errors.yearOfEstablishment}>
          <SelectInput
            value={form.yearOfEstablishment}
            onChange={set("yearOfEstablishment")}
            options={YEAR_OPTIONS}
          />
        </Field>
        <Field label="School Website Available" required error={errors.isWebsiteAvailable}>
          <SelectInput
            value={form.isWebsiteAvailable}
            onChange={set("isWebsiteAvailable")}
            options={WEBSITE_OPTIONS}
          />
        </Field>
      </Row3>

      {/* Row 7: Website Link | School Area | Toilets */}
      <Row3>
        <Field label="Website Link" error={errors.websiteLink}>
          <TextInput
            value={form.websiteLink}
            onChange={set("websiteLink")}
            disabled={form.isWebsiteAvailable !== "Yes"}
            placeholder={form.isWebsiteAvailable !== "Yes" ? "N/A" : "https://..."}
          />
        </Field>
        <Field label="School Falls Under Which Area" required error={errors.schoolAreaType}>
          <SelectInput
            value={form.schoolAreaType}
            onChange={set("schoolAreaType")}
            options={AREA_OPTIONS}
          />
        </Field>
        <Field label="Number of Toilets On Each Floor In School Building" required error={errors.toiletsPerFloorCount}>
          <TextInput value={form.toiletsPerFloorCount} onChange={set("toiletsPerFloorCount")} type="number" />
        </Field>
      </Row3>
    </div>
  );
}
