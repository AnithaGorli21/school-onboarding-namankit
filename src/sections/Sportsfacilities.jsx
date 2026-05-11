// ============================================================
//  src/sections/Sportsfacilities.jsx
// ============================================================
import { useState, useEffect } from "react";
import {
  Field, TextInput, SelectInput,
  SectionHeading, Row3, Row2,
  Alert, BtnSave, BtnReset,
} from "../components/FormFields";
import Pagination from "../components/Pagination";
import { TH, TD, DELETE_BTN, ADD_BTN } from "../utils/Tablestyles";
import {
  loadSportsDetails, submitSportsDetails,
  mapRecordToForm, mapCulturalToRows, mapToursToRows,
} from "../api/sportsDetails";
import { getPicklist } from "../api/liferay";
import Loader from "../components/Loader";

const YES_NO = ["Yes", "No"];
const MAGAZINE_TYPES = [
  { value: 1, label: "Monthly" },
  { value: 2, label: "Quarterly" },
  { value: 3, label: "Half-Yearly" },
  { value: 4, label: "Annual" },
];

const themeStyles = {
  container: { padding: "var(--spacing-md, 16px) var(--spacing-lg, 20px)", position: "relative" },
  card:      { background: "var(--card-bg, #ffffff)", border: "1px solid var(--border-color, #d6e0e0)", borderRadius: "var(--radius-sm, 3px)", padding: "18px 20px 22px", marginBottom: "20px" },
  addBtnRow: { display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "20px" },
};

const emptyForm = {
  noOfPhysicalEducationPTTeacherAvailable:  "",
  numberOfSportsPlayedOnPlayground:         "",
  detailsOfSportsPlayedOnPlayground:        "",
  availOfQualifiedSportsTeacherAsPerStuCnt: "",
  availabilityOfSeparateAuditorium:         "",
  auditoriumAreasqFt:                       "",
  schoolMagazine:                           "",
  schoolMagazineTypeId:                     "",
};

export default function SportsFacilities({ onTabChange, onSave, schoolProfileId, isEditMode, onLoadingChange }) {
  const [form,         setForm]         = useState(emptyForm);
  const [saving,       setSaving]       = useState(false);
  const [alert,        setAlert]        = useState(null);
  const [recordId,     setRecordId]     = useState(null);
  const [loadingData,  setLoadingData]  = useState(false);
  const [lookupLoadingCount, setLookupLoadingCount] = useState(0);
  const [yearOpts,     setYearOpts]     = useState([]);
  const [culturalRows, setCulturalRows] = useState([]);
  const [newCultural,  setNewCultural]  = useState({ yearId: "", programName: "", remarks: "" });
  
  // ✅ Fix 3 — Edit state for cultural rows
  const [editingCulturalId, setEditingCulturalId] = useState(null);
  const [editCultural, setEditCultural] = useState({ yearId: "", programName: "", remarks: "" });

  const [tourRows,     setTourRows]     = useState([]);
  const [newTour,      setNewTour]      = useState({ yearId: "", programName: "", place: "", purpose: "" });

  // ✅ Fix 1 — Special characters validation for sports details
  const [sportsDetailsError, setSportsDetailsError] = useState("");

  const trackLookupCall = (promise) => {
    setLookupLoadingCount((count) => count + 1);
    return promise.finally(() => setLookupLoadingCount((count) => Math.max(0, count - 1)));
  };

  useEffect(() => {
    onLoadingChange?.(loadingData || lookupLoadingCount > 0);
  }, [loadingData, lookupLoadingCount, onLoadingChange]);

  useEffect(() => {
    trackLookupCall(getPicklist("44a7021a-e02e-2a85-16c5-5173bd49bd02"))
      .then(setYearOpts)
      .catch(() => setYearOpts([
        { value: "2023-2024", label: "2023-2024" },
        { value: "2024-2025", label: "2024-2025" },
        { value: "2025-2026", label: "2025-2026" },
      ]));
  }, []);

  useEffect(() => {
    if (!schoolProfileId || !isEditMode) return;
    setLoadingData(true);
    loadSportsDetails(schoolProfileId)
      .then(({ record, recordId: rid, culturalRecords, tourRecords }) => {
        setRecordId(rid);
        const formData = mapRecordToForm(record);
        if (formData) setForm(formData);
        const cultural = mapCulturalToRows(culturalRecords);
        if (cultural.length > 0) setCulturalRows(cultural);
        const tours = mapToursToRows(tourRecords);
        if (tours.length > 0) setTourRows(tours);
      })
      .catch((err) => console.error("[SportsFacilities] load error:", err))
      .finally(() => setLoadingData(false));
  }, [schoolProfileId]);

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const getYearLabel = (id) => yearOpts.find((y) => y.value === id || y.value === Number(id))?.label || id;

  // ✅ Fix 1 — Handle sports details change with special char validation
  const handleSportsDetailsChange = (val) => {
    const specialCharRegex = /[^a-zA-Z0-9\s,.\-]/;
    if (specialCharRegex.test(val)) {
      setSportsDetailsError("Special characters are not allowed.");
    } else {
      setSportsDetailsError("");
    }
    set("detailsOfSportsPlayedOnPlayground")(val);
  };

  // ✅ Fix 2 — addCultural — remarks NOT mandatory
  const addCultural = () => {
    if (!newCultural.yearId || !newCultural.programName) return;
    setCulturalRows([...culturalRows, { ...newCultural, id: Date.now(), liferayId: null }]);
    setNewCultural({ yearId: "", programName: "", remarks: "" });
  };

  // ✅ Fix 3 — Edit cultural row handlers
  const handleEditCultural = (row) => {
    setEditingCulturalId(row.id);
    setEditCultural({ yearId: row.yearId, programName: row.programName, remarks: row.remarks });
  };

  const handleSaveCultural = (id) => {
    setCulturalRows((prev) =>
      prev.map((r) => r.id === id ? { ...r, ...editCultural } : r)
    );
    setEditingCulturalId(null);
    setEditCultural({ yearId: "", programName: "", remarks: "" });
  };

  const handleCancelCultural = () => {
    setEditingCulturalId(null);
    setEditCultural({ yearId: "", programName: "", remarks: "" });
  };

  const addTour = () => {
    if (!newTour.yearId || !newTour.programName || !newTour.place) return;
    setTourRows([...tourRows, { ...newTour, id: Date.now(), liferayId: null }]);
    setNewTour({ yearId: "", programName: "", place: "", purpose: "" });
  };

  const handleSave = async () => {
    // ✅ Fix 1 — Block save if sports details has special chars
    if (sportsDetailsError) {
      setAlert({ type: "error", message: "Please fix validation errors before saving." });
      return;
    }
    setSaving(true);
    setAlert(null);
    setLoadingData(true);
    try {
      await submitSportsDetails({ form, culturalRows, tourRows, schoolProfileId, recordId });
      setAlert({ type: "success", message: `Sports Facilities ${recordId ? "updated" : "saved"} successfully!` });
      onSave?.(form);
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally {
      setSaving(false);
      setLoadingData(false);
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setCulturalRows([]);
    setTourRows([]);
    setNewCultural({ yearId: "", programName: "", remarks: "" });
    setNewTour({ yearId: "", programName: "", place: "", purpose: "" });
    setAlert(null);
    setSportsDetailsError("");
    setEditingCulturalId(null);
  };

  return (
    <div style={themeStyles.container}>
      {(loadingData || lookupLoadingCount > 0) && (
        <div style={{ width: "100%", height: "100%", top: 0, left: 0, position: "absolute", zIndex: 1000, background: "rgba(255, 255, 255, 0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader />
        </div>
      )}
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
          {/* ✅ Fix 1 — Special char validation */}
          <Field label="Details Of sports Played On PlayGround" required error={sportsDetailsError}>
            <TextInput
              value={form.detailsOfSportsPlayedOnPlayground}
              onChange={handleSportsDetailsChange}
              placeholder="Basketball, Football..."
            />
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
            <SelectInput value={form.schoolMagazineTypeId} onChange={set("schoolMagazineTypeId")} options={MAGAZINE_TYPES} />
          </Field>
        </Row2>

        {/* ── Cultural Programs ── */}
        <div style={{ marginTop: 30 }}>
          <SectionHeading title="Cultural programs conducted by school" />
          <Row3>
            <Field label="Year" required>
              <SelectInput value={newCultural.yearId} onChange={(v) => setNewCultural({ ...newCultural, yearId: v })} options={yearOpts} />
            </Field>
            <Field label="Program Name" required>
              <TextInput value={newCultural.programName} onChange={(v) => setNewCultural({ ...newCultural, programName: v })} />
            </Field>
            {/* ✅ Fix 2 — Remarks NOT required */}
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
                  {/* ✅ Fix 3 — Added Edit column */}
                  <th style={TH}>Edit</th>
                  <th style={TH}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {culturalRows.map((r, i) => (
                  <tr key={r.id}>
                    {editingCulturalId === r.id ? (
                      // ✅ Fix 3 — Inline edit mode
                      <>
                        <td style={TD}>{i + 1}</td>
                        <td style={TD}>
                          <SelectInput
                            value={editCultural.yearId}
                            onChange={(v) => setEditCultural({ ...editCultural, yearId: v })}
                            options={yearOpts}
                          />
                        </td>
                        <td style={TD}>
                          <TextInput
                            value={editCultural.programName}
                            onChange={(v) => setEditCultural({ ...editCultural, programName: v })}
                          />
                        </td>
                        <td style={TD}>
                          <TextInput
                            value={editCultural.remarks}
                            onChange={(v) => setEditCultural({ ...editCultural, remarks: v })}
                          />
                        </td>
                        <td style={TD}>
                          <button
                            style={{ ...ADD_BTN, padding: "4px 10px", fontSize: 12, marginRight: 4 }}
                            onClick={() => handleSaveCultural(r.id)}
                          >
                            Save
                          </button>
                          <button
                            style={{ ...DELETE_BTN, padding: "4px 10px", fontSize: 12 }}
                            onClick={handleCancelCultural}
                          >
                            Cancel
                          </button>
                        </td>
                        <td style={TD}>—</td>
                      </>
                    ) : (
                      // Normal view mode
                      <>
                        <td style={TD}>{i + 1}</td>
                        <td style={TD}>{getYearLabel(r.yearId)}</td>
                        <td style={TD}>{r.programName}</td>
                        <td style={TD}>{r.remarks || "—"}</td>
                        <td style={TD}>
                          {/* ✅ Fix 3 — Edit button */}
                          <button
                            style={{ ...ADD_BTN, padding: "4px 12px", fontSize: 12 }}
                            onClick={() => handleEditCultural(r)}
                          >
                            Edit
                          </button>
                        </td>
                        <td style={TD}>
                          <button style={DELETE_BTN} onClick={() => setCulturalRows(culturalRows.filter((x) => x.id !== r.id))}>Delete</button>
                        </td>
                      </>
                    )}
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
              <SelectInput value={newTour.yearId} onChange={(v) => setNewTour({ ...newTour, yearId: v })} options={yearOpts} />
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
                    <td style={TD}>{r.purpose || "—"}</td>
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