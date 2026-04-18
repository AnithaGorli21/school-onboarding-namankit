// ============================================================
//  src/sections/SportsFacilities.jsx
//
//  FIXES:
//  1. Three separate endpoints confirmed from swagger:
//     - /o/c/sportfacilities            → main sports form
//     - /o/c/culturalprogramsportsfacilities  → one POST per cultural row
//     - /o/c/educationaltourssportsfacilities → one POST per tour row
//  2. culturalPrograms and educationalTours removed from main payload
//     (they were nested — Liferay needs separate POSTs)
//  3. schoolMagazineTypeId sent as number not MAGAZINE_TYPES.indexOf()
//     ⚠️ Replace IDs with actual Liferay picklist values
//  4. Uses saveSportsFacilities, saveCulturalProgram, saveEducationalTour
//     from liferay.js (Authorization header)
// ============================================================
import { useState } from "react";
import {
  Field, TextInput, SelectInput,
  SectionHeading, Row3, Row2,
  Alert, BtnSave, BtnReset,
} from "../components/FormFields";
import Pagination from "../components/Pagination";
import { TH, TD, DELETE_BTN, ADD_BTN } from "../utils/Tablestyles";
import { saveSportsFacilities, saveCulturalProgram, saveEducationalTour } from "../api/liferay";

const YES_NO = ["Yes", "No"];

// ⚠️ Replace value IDs with actual Liferay picklist IDs
const MAGAZINE_TYPES = [
  { value: 1, label: "Monthly" },
  { value: 2, label: "Quarterly" },
  { value: 3, label: "Half-Yearly" },
  { value: 4, label: "Annual" },
];

// ⚠️ Replace value IDs with actual Liferay picklist IDs for year
const YEARS = [
  { value: 1, label: "2023-2024" },
  { value: 2, label: "2024-2025" },
  { value: 3, label: "2025-2026" },
];

const themeStyles = {
  container: { padding: "var(--spacing-md, 16px) var(--spacing-lg, 20px)" },
  card: {
    background: "var(--card-bg, #ffffff)",
    border: "1px solid var(--border-color, #d6e0e0)",
    borderRadius: "var(--radius-sm, 3px)",
    padding: "18px 20px 22px",
    marginBottom: "20px",
  },
  addBtnRow: { display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "20px" },
};

const emptyForm = {
  noOfPhysicalEducationPTTeacherAvailable:   "",
  numberOfSportsPlayedOnPlayground:          "",
  detailsOfSportsPlayedOnPlayground:         "",
  availOfQualifiedSportsTeacherAsPerStuCnt:  "",
  availabilityOfSeparateAuditorium:          "",
  auditoriumAreasqFt:                        "",
  schoolMagazine:                            "",
  schoolMagazineTypeId:                      "",
};

export default function SportsFacilities() {
  const [form,    setForm]    = useState(emptyForm);
  const [saving,  setSaving]  = useState(false);
  const [alert,   setAlert]   = useState(null);

  const [culturalRows, setCulturalRows] = useState([]);
  const [newCultural,  setNewCultural]  = useState({ yearId: "", programName: "", remarks: "" });

  const [tourRows, setTourRows] = useState([]);
  const [newTour,  setNewTour]  = useState({ yearId: "", programName: "", place: "", purpose: "" });

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  // Helper to get label for display in table
  const getYearLabel = (id) => YEARS.find((y) => y.value === Number(id))?.label || id;

  const addCultural = () => {
    if (!newCultural.yearId || !newCultural.programName) return;
    setCulturalRows([...culturalRows, { ...newCultural, id: Date.now() }]);
    setNewCultural({ yearId: "", programName: "", remarks: "" });
  };

  const addTour = () => {
    if (!newTour.yearId || !newTour.programName || !newTour.place) return;
    setTourRows([...tourRows, { ...newTour, id: Date.now() }]);
    setNewTour({ yearId: "", programName: "", place: "", purpose: "" });
  };

  const handleSave = async () => {
    setSaving(true);
    setAlert(null);
    try {
      // ── 1. POST main sports facilities payload ────────────
      const sportsPayload = {
        auditoriumAreasqFt:                        Number(form.auditoriumAreasqFt)                       || 0,
        availabilityOfSeparateAuditorium:           form.availabilityOfSeparateAuditorium                === "Yes",
        availOfQualifiedSportsTeacherAsPerStuCnt:   form.availOfQualifiedSportsTeacherAsPerStuCnt        === "Yes",
        detailsOfSportsPlayedOnPlayground:          form.detailsOfSportsPlayedOnPlayground               || "",
        noOfPhysicalEducationPTTeacherAvailable:    Number(form.noOfPhysicalEducationPTTeacherAvailable) || 0,
        numberOfSportsPlayedOnPlayground:           Number(form.numberOfSportsPlayedOnPlayground)        || 0,
        schoolMagazine:                             form.schoolMagazine                                  === "Yes",
        schoolMagazineTypeId:                       Number(form.schoolMagazineTypeId)                    || 0,
      };

      console.log("[SportsFacilities] payload →", JSON.stringify(sportsPayload, null, 2));
      await saveSportsFacilities(sportsPayload);

      // ── 2. POST each cultural program row individually ────
      for (const row of culturalRows) {
        const culturalPayload = {
          culturalProgramConductedBySchoolYearId: Number(row.yearId)       || 0,
          culturalProgramName:                    row.programName           || "",
          culturalProgramRemarks:                 row.remarks               || "",
        };
        console.log("[CulturalProgram] payload →", JSON.stringify(culturalPayload, null, 2));
        await saveCulturalProgram(culturalPayload);
      }

      // ── 3. POST each educational tour row individually ────
      for (const row of tourRows) {
        const tourPayload = {
          educationalToursCondBySchoolYearId: Number(row.yearId)   || 0,
          educationalToursPlace:              row.place             || "",
          educationalToursProgramName:        row.programName       || "",
          educationalToursPurpose:            row.purpose           || "",
        };
        console.log("[EducationalTour] payload →", JSON.stringify(tourPayload, null, 2));
        await saveEducationalTour(tourPayload);
      }

      setAlert({ type: "success", message: "Sports Facilities saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setCulturalRows([]);
    setTourRows([]);
    setNewCultural({ yearId: "", programName: "", remarks: "" });
    setNewTour({ yearId: "", programName: "", place: "", purpose: "" });
    setAlert(null);
  };

  return (
    <div style={themeStyles.container}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div style={themeStyles.card}>
        <SectionHeading title="Sports Facilities" />

        <Row3>
          <Field label="Number Of Physical Education (PT) teacher available" required>
            <TextInput value={form.noOfPhysicalEducationPTTeacherAvailable} onChange={set("noOfPhysicalEducationPTTeacherAvailable")} type="number" />
          </Field>
          <Field label="Number Of sports Played On PlayGround" required>
            <TextInput value={form.numberOfSportsPlayedOnPlayground} onChange={set("numberOfSportsPlayedOnPlayground")} type="number" />
          </Field>
          <Field label="Details Of sports Played On PlayGround" required>
            <TextInput value={form.detailsOfSportsPlayedOnPlayground} onChange={set("detailsOfSportsPlayedOnPlayground")} placeholder="Basketball, Football..." />
          </Field>
        </Row3>

        <Row3>
          <Field label="Availabilty of qualified Sport's Teachers as per students' count" required>
            <SelectInput value={form.availOfQualifiedSportsTeacherAsPerStuCnt} onChange={set("availOfQualifiedSportsTeacherAsPerStuCnt")} options={YES_NO} />
          </Field>
          <div /><div />
        </Row3>

        <Row2>
          <Field label="Availabilty Of Separate Auditorium" required>
            <SelectInput value={form.availabilityOfSeparateAuditorium} onChange={set("availabilityOfSeparateAuditorium")} options={YES_NO} />
          </Field>
          <Field label="Auditorium Area(sq ft)" required>
            <TextInput value={form.auditoriumAreasqFt} onChange={set("auditoriumAreasqFt")} type="number" />
          </Field>
        </Row2>

        <Row2>
          <Field label="School Magazine" required>
            <SelectInput value={form.schoolMagazine} onChange={set("schoolMagazine")} options={YES_NO} />
          </Field>
          <Field label="School Magazine Type" required>
            {/* ⚠️ value stores numeric ID — replace IDs with actual Liferay picklist values */}
            <SelectInput value={form.schoolMagazineTypeId} onChange={set("schoolMagazineTypeId")} options={MAGAZINE_TYPES} />
          </Field>
        </Row2>

        {/* ── Cultural Programs ── */}
        <div style={{ marginTop: 30 }}>
          <SectionHeading title="Cultural programs conducted by school" />
          <Row3>
            <Field label="Year" required>
              {/* ⚠️ value stores numeric ID — replace IDs with actual Liferay picklist values */}
              <SelectInput value={newCultural.yearId} onChange={(v) => setNewCultural({ ...newCultural, yearId: v })} options={YEARS} />
            </Field>
            <Field label="Program Name" required>
              <TextInput value={newCultural.programName} onChange={(v) => setNewCultural({ ...newCultural, programName: v })} />
            </Field>
            <Field label="Remarks">
              <TextInput value={newCultural.remarks} onChange={(v) => setNewCultural({ ...newCultural, remarks: v })} />
            </Field>
          </Row3>
          <div style={themeStyles.addBtnRow}>
            <button type="button" onClick={addCultural} style={ADD_BTN}>Add Program</button>
          </div>
          {culturalRows.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <thead>
                <tr>
                  <th style={TH}>Sr No</th>
                  <th style={TH}>Year</th>
                  <th style={TH}>Program Name</th>
                  <th style={TH}>Remarks</th>
                  <th style={TH}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {culturalRows.map((r, i) => (
                  <tr key={r.id}>
                    <td style={TD}>{i + 1}</td>
                    <td style={TD}>{getYearLabel(r.yearId)}</td>
                    <td style={TD}>{r.programName}</td>
                    <td style={TD}>{r.remarks}</td>
                    <td style={TD}>
                      <button style={DELETE_BTN} onClick={() => setCulturalRows(culturalRows.filter((x) => x.id !== r.id))}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Educational Tours ── */}
        <div style={{ marginTop: 30 }}>
          <SectionHeading title="Educational tours conducted by school" />
          <Row3>
            <Field label="Year" required>
              <SelectInput value={newTour.yearId} onChange={(v) => setNewTour({ ...newTour, yearId: v })} options={YEARS} />
            </Field>
            <Field label="Program Name" required>
              <TextInput value={newTour.programName} onChange={(v) => setNewTour({ ...newTour, programName: v })} />
            </Field>
            <Field label="Place" required>
              <TextInput value={newTour.place} onChange={(v) => setNewTour({ ...newTour, place: v })} />
            </Field>
          </Row3>
          <Row2>
            <Field label="Purpose">
              <TextInput value={newTour.purpose} onChange={(v) => setNewTour({ ...newTour, purpose: v })} />
            </Field>
            <div />
          </Row2>
          <div style={themeStyles.addBtnRow}>
            <button type="button" onClick={addTour} style={ADD_BTN}>Add Educational Tours</button>
          </div>
          {tourRows.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={TH}>Sr No</th>
                  <th style={TH}>Year</th>
                  <th style={TH}>Program Name</th>
                  <th style={TH}>Place</th>
                  <th style={TH}>Purpose</th>
                  <th style={TH}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {tourRows.map((r, i) => (
                  <tr key={r.id}>
                    <td style={TD}>{i + 1}</td>
                    <td style={TD}>{getYearLabel(r.yearId)}</td>
                    <td style={TD}>{r.programName}</td>
                    <td style={TD}>{r.place}</td>
                    <td style={TD}>{r.purpose}</td>
                    <td style={TD}>
                      <button style={DELETE_BTN} onClick={() => setTourRows(tourRows.filter((x) => x.id !== r.id))}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <BtnReset onClick={handleReset} />
        <BtnSave onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </BtnSave>
      </div>
    </div>
  );
}