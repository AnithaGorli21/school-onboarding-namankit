// ============================================================
//  src/sections/SchoolProfile.jsx
//  Cascade: State → District → Taluka → Village → PO Name
//  Required (*) added on all mandatory fields per Excel spec
// ============================================================
import React, { useEffect, useState } from "react";
import {
  Field, TextInput, SelectInput,
  SectionHeading, Row3, Row2,
} from "../components/FormFields";
import {
  getStates, getDistricts, getTalukas, getVillages, getPoNames, getPicklist,
} from "../api/liferay";
import { fetchPOByATC } from "../api/fetch-masters";

const WEBSITE_OPTIONS = ["Yes", "No"];
const SELECTION_YEAR_OPTIONS = [
  "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25",
];

export default function SchoolProfile({ form, setForm, errors }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);
  const [poNames, setPoNames] = useState([]);
  const [boardOpts, setBoardOpts] = useState([]);
  const [areaOpts, setAreaOpts] = useState([]);
  const [yearOpts, setYearOpts] = useState([]);
  console.log('form data:::', form)

  useEffect(() => {
    getStates()
      .then(setStates)
      .catch(() => setStates([
        { value: 1, label: "Maharashtra" },
        { value: 2, label: "Gujarat" },
        { value: 3, label: "Karnataka" },
      ]));
  }, []);

  useEffect(() => {
    if (!form.state) { setDistricts([]); return; }
    getDistricts(form.state).then(setDistricts).catch(() => setDistricts([]));
  }, [form.state]);

  useEffect(() => {
    if (!form.district) { setTalukas([]); return; }
    getTalukas(form.district).then(setTalukas).catch(() => setTalukas([]));
  }, [form.district]);

  useEffect(() => {
    if (!form.taluka) { setVillages([]); return; }
    getVillages(form.taluka).then(setVillages).catch(() => setVillages([]));
  }, [form.taluka]);

  // useEffect(() => {
  //   if (!form.village) { setPoNames([]); return; }
  //   getPoNames(form.village).then(setPoNames).catch(() => setPoNames([]));
  // }, [form.village]);

  // ✅ Temporary — load all states as PO options
  useEffect(() => {
    let cancelled = false;

    fetchPOByATC()
          .then((data) => {
            console.log("fetch PO masters...", data);
    
            if (!cancelled) setPoNames(Array.isArray(data) ? data : []);
          })
    
          .catch((err) => {
            console.error("[SchoolMasterForm] PO Names load failed:", err);
    
            if (!cancelled) setPoNames([]);
          })
    
          .finally(() => {
            //if (!cancelled) setLoadingPO(false);
          });
  }, []);

  useEffect(() => {
    getPicklist("DBT-NAMANKIT-SCHOOL-PROFILE-BOARDS")
      .then(res=>{
        console.log('Board options:', res);
        setBoardOpts(res);
      })
      .catch(() => setBoardOpts([
        { value: "SSC", label: "SSC Board" },
        { value: "CBSE", label: "CBSE Board" },
        { value: "ICSE", label: "ICSE Board" },
        { value: "State", label: "State Board" },
      ]));
  }, []);

  useEffect(() => {
    getPicklist("DBT-NAMANKIT-SCHOOL-PROFILE-AREAS")
      .then(res=>{
        console.log('Area options:', res);
        setAreaOpts(res);
      })
      .catch(() => setAreaOpts([
        { value: "Rural", label: "Rural" },
        { value: "NagarPalika", label: "Nagar Palika" },
        { value: "MahaNagarPalika", label: "Maha Nagar Palika" },
      ]));
  }, []);

  useEffect(() => {
    getPicklist("DBT-ADMISSION-YEAR-IN-COLLEGE")
      .then(setYearOpts)
      .catch(() => setYearOpts(
        Array.from({ length: 75 }, (_, i) => ({
          value: String(2024 - i),
          label: String(2024 - i),
        }))
      ));
  }, []);

  const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

  const onStateChange = (val) => setForm((p) => ({ ...p, state: val, district: "", taluka: "", village: "", poName: "" }));
  const onDistrictChange = (val) => setForm((p) => ({ ...p, district: val, taluka: "", village: "", poName: "" }));
  const onTalukaChange = (val) => setForm((p) => ({ ...p, taluka: val, village: "", poName: "" }));
  const onVillageChange = (val) => setForm((p) => ({ ...p, village: val, poName: "" }));
  const onSchoolBoardChange = (val) =>{
    console.log('School board change:', val);
    boardOpts.forEach((opt,i)=> {
      if (opt.value === val) {
        setForm((p) => ({ ...p, schoolBoard: i }));
      }
    });
  } 
   const getSchoolBoardValue=(val)=>{
    if(typeof val === 'number'){
      return boardOpts[val]?.value || "";
    }
    return val;
   }
   const onPONameChange = (val) =>{
    console.log('PO name change:', typeof val, val);
    poNames.forEach((opt,i)=> {
      console.log('PO name option:', opt.value);
      if (opt.value === Number(val)) {
      console.log('PO name value:', poNames[val]?.value);
        setForm((p) => ({ ...p, poName: i }));
      }
    });
  } 
   //School Area
   const onSchoolAreaChange = (val) =>{
    console.log('School area change:', val);
    areaOpts.forEach((opt,i)=> {
      if (opt.value === val) {
        setForm((p) => ({ ...p, schoolAreaType: i }));
      }
    });
  } 
   const getSchoolAreaValue=(val)=>{
    if(typeof val === 'number'){
      return areaOpts[val]?.value || "";
    }
    return val;
   }
    const getPONameValue=(val)=>{
      console.log('PO name value:', val, poNames);
    if(typeof val === 'number'){
      console.log('PO name value:', poNames[val]?.value);
      return poNames[val]?.value || "";
    }
      console.log('PO name value:', poNames[val]?.value);

    return val;
   }
  return (
    <div>
      <SectionHeading title="School Profile" />

      {/* Row 1-3: Trustee Name (No*), School Name (Yes*), Address (Yes*) */}
      <Row3>
        {/* Row 1 — Trustee Name: NOT mandatory per Excel */}
        <Field label="Trustee Name" error={errors.trusteeName}>
          <TextInput value={form.trusteeName} onChange={set("trusteeName")} />
        </Field>
        {/* Row 2 — School Name: Mandatory */}
        <Field label="School Name" required error={errors.schoolName}>
          <TextInput value={form.schoolName} onChange={set("schoolName")} />
        </Field>
        {/* Row 3 — Address: Mandatory */}
        <Field label="Address" required error={errors.address}>
          <TextInput value={form.address} onChange={set("address")} />
        </Field>
      </Row3>

      {/* Row 4-5-6: Mobile (Yes*), State (Yes*), District (Yes*) */}
      <Row3>
        {/* Row 4 — Mobile Number: Mandatory */}
        <Field label="Mobile No" required error={errors.mobileNumber}>
          <TextInput value={form.mobileNumber} onChange={set("mobileNumber")} type="tel" />
        </Field>
        {/* Row 5 — District: Mandatory (State is prerequisite) */}
        <Field label="State" required error={errors.state}>
          <SelectInput value={form.state} onChange={onStateChange} options={states} />
        </Field>
        {/* Row 5 — District: Mandatory */}
        <Field label="District" required error={errors.district}>
          <SelectInput value={form.district} onChange={onDistrictChange} options={districts} disabled={!form.state} />
        </Field>
      </Row3>

      {/* Row 6-7-8: Taluka (Yes*), Village (Yes*), Pincode (Yes*) */}
      <Row3>
        {/* Row 6 — Taluka: Mandatory */}
        <Field label="Taluka" required error={errors.taluka}>
          <SelectInput value={form.taluka} onChange={onTalukaChange} options={talukas} disabled={!form.district} />
        </Field>
        {/* Row 7 — Village: Mandatory */}
        <Field label="Village" required error={errors.village}>
          <SelectInput value={form.village} onChange={onVillageChange} options={villages} disabled={!form.taluka} />
        </Field>
        {/* Row 8 — Pincode: Mandatory */}
        <Field label="Pincode" required error={errors.pincode}>
          <TextInput value={form.pincode} onChange={set("pincode")} />
        </Field>
      </Row3>

      {/* Row 9-10-11: Email (Yes*), PO Name (Yes*), UDISE Code (Yes*) */}
      <Row3>
        {/* Row 9 — Email ID: Mandatory */}
        <Field label="Email ID" required error={errors.emailId}>
          <TextInput value={form.emailId} onChange={set("emailId")} type="email" />
        </Field>
        {/* Row 10 — PO Name: Mandatory */}
        <Field label="PO Name" required error={errors.poName}>
          <SelectInput value={getPONameValue(form.poName)} onChange={e=>onPONameChange(e)} options={poNames} disabled={!form.village} />
        </Field>
        {/* Row 11 — UDISE Code: Mandatory */}
        <Field label="UDISE Code" required error={errors.udiseCode}>
          <TextInput value={form.udiseCode} onChange={set("udiseCode")} />
        </Field>
      </Row3>

      {/* Row 12-13-14: School Selection Year (Yes*), Reg No (Yes*), Board (Yes*) */}
      <Row3>
        {/* Row 12 — School Selection Year: Mandatory */}
        <Field label="School Selection Year" required error={errors.schoolSelectionYear}>
          <SelectInput value={form.schoolSelectionYear} onChange={set("schoolSelectionYear")} options={SELECTION_YEAR_OPTIONS} />
        </Field>
        {/* Row 13 — School Registration Number: Mandatory */}
        <Field label="School Registration No" required error={errors.schoolRegistrationNumber}>
          <TextInput value={form.schoolRegistrationNumber} onChange={set("schoolRegistrationNumber")} />
        </Field>
        {/* Row 14 — School Board: Mandatory (DDL: CBSE Board, SCC Board, SSC Board) */}
        <Field label="School Board" required error={errors.schoolBoard}>
          <SelectInput value={getSchoolBoardValue(form.schoolBoard)} onChange={e=>onSchoolBoardChange(e)} options={boardOpts} />
        </Field>
      </Row3>

      {/* Row 15-16-17: SSC Batches (Yes*), Year of Est (Yes*), Website Available (Yes*) */}
      <Row3>
        {/* Row 15 — Total SSC Batches: Mandatory + Numeric */}
        <Field label="Total Number Of SSC Batches Completed" required error={errors.sscBatchesCompletedCount}>
          <TextInput value={form.sscBatchesCompletedCount} onChange={set("sscBatchesCompletedCount")} type="number" />
        </Field>
        {/* Row 16 — Year of Establishment: Mandatory (4-digit year) */}
        <Field label="Year Of Establishment" required error={errors.yearOfEstablishment}>
          <SelectInput value={form.yearOfEstablishment} onChange={set("yearOfEstablishment")} options={yearOpts} />
        </Field>
        {/* Row 17 — School Website Available: Mandatory */}
        <Field label="School Website Available" required error={errors.isWebsiteAvailable}>
          <SelectInput value={form.isWebsiteAvailable} onChange={set("isWebsiteAvailable")} options={WEBSITE_OPTIONS} />
        </Field>
      </Row3>

      {/* Row 18-19-20 */}
      <Row3>
        {/* Row 18 — Website Link: NOT mandatory, only shown if Yes selected */}
        {form.isWebsiteAvailable === "Yes" && (
          <Field label="Website Link" error={errors.websiteLink}>
            <TextInput
              value={form.websiteLink}
              onChange={set("websiteLink")}
              placeholder="https://..."
            />
          </Field>
        )}
        {/* Row 19 — School Falls Under Which Area: Mandatory (Rural, Nagar Palika, Maha Nagar Palika) */}
        <Field label="School Falls Under Which Area" required error={errors.schoolAreaType}>
          <SelectInput value={getSchoolAreaValue(form.schoolAreaType)} onChange={e=>onSchoolAreaChange(e)} options={areaOpts} />
        </Field>
        {/* Row 20 — Number of Toilets: Mandatory + Numeric */}
        <Field label="Number of Toilets On Each Floor In School Building" required error={errors.toiletsPerFloorCount}>
          <TextInput value={form.toiletsPerFloorCount} onChange={set("toiletsPerFloorCount")} type="number" />
        </Field>
      </Row3>
    </div>
  );
}