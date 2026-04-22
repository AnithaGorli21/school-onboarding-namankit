// ============================================================
//  src/sections/LandDetails.jsx
//  UI only — API logic in src/api/landdetails.js
//
//  On mount: loads existing record by schoolProfileId → pre-fills form
//  On save:  POST (new) or PATCH (update) via submitLandDetails
// ============================================================
import { useState, useEffect } from "react";
import {
  Field, TextInput, SelectInput,
  SectionHeading, Row3, Row2,
  Alert, BtnSave, BtnReset,
} from "../components/FormFields";
import { loadLandDetails, submitLandDetails, mapRecordToForm } from "../api/landdetails";
import { getPicklist } from "../api/liferay";

const YES_NO        = ["Yes", "No"];
// Ownership and Sport Quality loaded from Liferay picklists
// Standard options loaded from Liferay picklist on mount
// ERC: update with your actual Standard/Grade picklist ERC from Liferay

const TH = {
  padding: "10px 12px", background: "#ffffff",
  borderBottom: "2px solid #dee2e6", fontSize: 13,
  fontWeight: 400, color: "#333", textAlign: "left",
  whiteSpace: "normal", verticalAlign: "bottom",
};
const TD = {
  padding: "9px 12px", borderBottom: "1px solid #dee2e6",
  fontSize: 13, color: "#333", verticalAlign: "middle",
};

function Pagination({ total, pageSize, setPageSize, page, setPage }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const navBtn = (label, action, active) => (
    <button key={label} onClick={active ? action : undefined} style={{
      padding: "5px 14px", fontSize: 13, fontFamily: "var(--font-main)", fontWeight: 400,
      border: active ? "1px solid #1a7a8a" : "1px solid #cccccc", borderRadius: 3,
      background: active ? "#1a7a8a" : "#ffffff",
      color: active ? "#ffffff" : "#aaaaaa",
      cursor: active ? "pointer" : "default", lineHeight: "1.5",
    }}>{label}</button>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", fontSize: 13, color: "#333", flexWrap: "wrap", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span>Total Records <strong>{total}</strong></span>
        <input type="number" value={pageSize} min={1}
          onChange={(e) => { setPageSize(Number(e.target.value) || 10); setPage(1); }}
          style={{ width: 55, height: 30, border: "1px solid #cccccc", borderRadius: 3, padding: "0 6px", fontSize: 13, color: "#333", textAlign: "center" }}
        />
      </div>
      <span>Page: {page} of {totalPages}</span>
      <div style={{ display: "flex", gap: 4 }}>
        {navBtn("First",    () => setPage(1),                                    page > 1)}
        {navBtn("Previous", () => setPage((p) => Math.max(1, p - 1)),           page > 1)}
        {navBtn("Next",     () => setPage((p) => Math.min(totalPages, p + 1)),  page < totalPages)}
        {navBtn("Last",     () => setPage(totalPages),                           page < totalPages)}
      </div>
    </div>
  );
}

const emptyLand = {
  ownership: "", totalAreaAcres: "", compoundWall: "",
  playground: "", playgroundAreaAcres: "", swimmingTank: "",
  runningTrack: "", basketballGround: "", khoKhokabaddiGround: "",
  sportsFacilityQuality: "", otherSports: "",
};

const emptyClassRow = {
  standard: "", division: "", separateClassroom: "",
  classroomWithBenches: "", classroomWithoutBenches: "",
};

export default function LandDetails({ onTabChange, onSave, schoolProfileId }) {
  const [land,         setLand]         = useState(emptyLand);
  const [classRow,     setClassRow]     = useState(emptyClassRow);
  const [classRows,    setClassRows]    = useState([]);
  const [photoFile,    setPhotoFile]    = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors,       setErrors]       = useState({});
  const [rowError,     setRowError]     = useState("");
  const [saving,       setSaving]       = useState(false);
  const [alert,        setAlert]        = useState(null);
  const [page,         setPage]         = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [recordId,     setRecordId]     = useState(null);
  const [loadingData,  setLoadingData]  = useState(false);
  const [standardOpts,     setStandardOpts]     = useState([]);
  const [ownershipOpts,    setOwnershipOpts]    = useState([]);
  const [sportQualityOpts, setSportQualityOpts] = useState([]);

  // ── Load existing record when schoolProfileId is available ──
  useEffect(() => {
    if (!schoolProfileId) return;
    console.log('[LandDetails] loading for schoolProfileId →', schoolProfileId);
    setLoadingData(true);
    loadLandDetails(schoolProfileId)
      .then(({ record, recordId: rid }) => {
        setRecordId(rid);
        const formData = mapRecordToForm(record);
        if (formData) setLand(formData);
      })
      .catch((err) => console.error("[LandDetails] load error:", err))
      .finally(() => setLoadingData(false));
  }, [schoolProfileId]);

  // ── Load Ownership picklist ───────────────────────────────
  useEffect(() => {
    getPicklist("DBT-NAMANKIT-LAND-DETAILS-OWNERSHIP")
      .then(opts => setOwnershipOpts(opts.map(o => ({
        value: Number(o.label),  // name field has the number (1,2,3)
        label: o.value,          // key field has the text (Owned, Rented)
      }))))
      .catch(() => setOwnershipOpts([
        { value: "Owned", label: "Owned" },
        { value: "Rented", label: "Rented" },
        { value: "Government", label: "Government" },
      ]));
  }, []);

  // ── Load Sport Quality picklist ───────────────────────────
  useEffect(() => {
    getPicklist("DBT-NAMANKIT-LAND-DETAILS-SPORTS-QUALITY")
      .then(opts => setSportQualityOpts(opts.map(o => ({
        value: Number(o.label),  // name field has the number
        label: o.value,          // key field has the text
      }))))
      .catch(() => setSportQualityOpts([
        { value: "Excellent", label: "Excellent" },
        { value: "Good", label: "Good" },
        { value: "Average", label: "Average" },
        { value: "Poor", label: "Poor" },
      ]));
  }, []);

  // ── Load Standard picklist from Liferay ──────────────────
  useEffect(() => {
    getPicklist("dbt-standard-grade")   // ⚠️ Replace with actual ERC from Liferay picklist
      .then(setStandardOpts)
      .catch(() => {
        // Fallback to hardcoded if API fails
        setStandardOpts(Array.from({ length: 12 }, (_, i) => ({ value: String(i+1), label: String(i+1) })));
      });
  }, []);

  const setL  = (k) => (v) => setLand((p)     => ({ ...p, [k]: v }));
  const setCR = (k) => (v) => setClassRow((p) => ({ ...p, [k]: v }));
  const pagedRows = classRows.slice((page - 1) * pageSize, page * pageSize);

  const handleAddRow = () => {
    const { standard, division, separateClassroom, classroomWithBenches, classroomWithoutBenches } = classRow;
    if (!standard || !division || !separateClassroom || !classroomWithBenches || !classroomWithoutBenches) {
      setRowError("Please fill all classroom fields before clicking Add.");
      return;
    }
    setRowError("");
    setClassRows((prev) => [...prev, { ...classRow, id: Date.now() }]);
    setClassRow(emptyClassRow);
    setPage(1);
  };

  const handleDeleteRow = (id) => {
    setClassRows((prev) => prev.filter((r) => r.id !== id));
    setPage(1);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const sizeKB = file.size / 1024;
    if (sizeKB < 5 || sizeKB > 100) {
      setAlert({ type: "error", message: "Photo size must be between 5KB and 100KB." });
      e.target.value = "";
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!land.ownership)             e.ownership             = "Required";
    if (!land.totalAreaAcres)        e.totalAreaAcres        = "Required";
    if (!land.compoundWall)          e.compoundWall          = "Required";
    if (!land.playground)            e.playground            = "Required";
    if (!land.swimmingTank)          e.swimmingTank          = "Required";
    if (!land.runningTrack)          e.runningTrack          = "Required";
    if (!land.basketballGround)      e.basketballGround      = "Required";
    if (!land.khoKhokabaddiGround)   e.khoKhokabaddiGround   = "Required";
    if (!land.sportsFacilityQuality) e.sportsFacilityQuality = "Required";
    if (!land.otherSports)           e.otherSports           = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setAlert({ type: "error", message: "Please fix the highlighted errors before saving." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);
    setAlert(null);
    try {
      await submitLandDetails({ land, photoFile, schoolProfileId, recordId });
      setAlert({ type: "success", message: `Land Details ${recordId ? "updated" : "saved"} successfully!` });
      onSave?.(land);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setAlert({ type: "error", message: "Save failed — " + (err.message || "Please try again.") });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLand(emptyLand);
    setClassRow(emptyClassRow);
    setClassRows([]);
    setPhotoFile(null);
    setPhotoPreview(null);
    setErrors({});
    setAlert(null);
    setPage(1);
  };

  return (
    <div style={{ padding: "16px 20px 32px" }}>
      {loadingData && (
        <div style={{ textAlign: "center", padding: "12px", color: "#888", fontSize: 13 }}>
          Loading saved data...
        </div>
      )}
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div style={{ background: "#ffffff", border: "1px solid #d6e0e0", borderRadius: 3, padding: "18px 20px 22px" }}>

        <SectionHeading title="School Land Details" />
        <Row3>
          <Field label="Ownership" required error={errors.ownership}>
            <SelectInput value={land.ownership} onChange={setL("ownership")} options={ownershipOpts} />
          </Field>
          <Field label="Total Area(In Acres)[Building + Playground + Hostel etc]" required error={errors.totalAreaAcres}>
            <TextInput value={land.totalAreaAcres} onChange={setL("totalAreaAcres")} type="number" placeholder="e.g. 35.00" />
          </Field>
          <Field label="School Compound Wall" required error={errors.compoundWall}>
            <SelectInput value={land.compoundWall} onChange={setL("compoundWall")} options={YES_NO} />
          </Field>
        </Row3>
        <Row3>
          <Field label="Playground" required error={errors.playground}>
            <SelectInput value={land.playground} onChange={setL("playground")} options={YES_NO} />
          </Field>
          <Field label="Playground Area(In Acres)" error={errors.playgroundAreaAcres}>
            <TextInput value={land.playgroundAreaAcres} onChange={setL("playgroundAreaAcres")} type="number" placeholder="e.g. 10.00" />
          </Field>
          <Field label="Swimming Tank" required error={errors.swimmingTank}>
            <SelectInput value={land.swimmingTank} onChange={setL("swimmingTank")} options={YES_NO} />
          </Field>
        </Row3>
        <Row3>
          <Field label="Running Track" required error={errors.runningTrack}>
            <SelectInput value={land.runningTrack} onChange={setL("runningTrack")} options={YES_NO} />
          </Field>
          <Field label="Basket ball Ground" required error={errors.basketballGround}>
            <SelectInput value={land.basketballGround} onChange={setL("basketballGround")} options={YES_NO} />
          </Field>
          <Field label="Kho-Kho,Kabaddi Ground" required error={errors.khoKhokabaddiGround}>
            <SelectInput value={land.khoKhokabaddiGround} onChange={setL("khoKhokabaddiGround")} options={YES_NO} />
          </Field>
        </Row3>
        <Row2>
          <Field label="Quality Of Sport Facilities / Infrastructure available" required error={errors.sportsFacilityQuality}>
            <SelectInput value={land.sportsFacilityQuality} onChange={setL("sportsFacilityQuality")} options={sportQualityOpts} />
          </Field>
          <Field label="Others Sports" required error={errors.otherSports}>
            <TextInput value={land.otherSports} onChange={setL("otherSports")} placeholder="e.g. cricket, horse riding, kabaddi" />
          </Field>
        </Row2>

        {/* Classroom Details */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 400, color: "#333", paddingBottom: 8, marginBottom: 16, borderBottom: "1px solid #cccccc" }}>
            School Classroom details(RCC Constructed)
          </div>
          {rowError && <Alert type="error" message={rowError} onClose={() => setRowError("")} />}
          <Row3>
            <Field label="Standard" required>
              <SelectInput value={classRow.standard} onChange={setCR("standard")} options={standardOpts} />
            </Field>
            <Field label="Division" required>
              <TextInput value={classRow.division} onChange={setCR("division")} type="number" />
            </Field>
            <Field label="Separate Classroom For Each Division" required>
              <SelectInput value={classRow.separateClassroom} onChange={setCR("separateClassroom")} options={YES_NO} />
            </Field>
          </Row3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <Field label="Total Classroom With Benches" required>
                <TextInput value={classRow.classroomWithBenches} onChange={setCR("classroomWithBenches")} type="number" />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Total Classroom Without Benches" required>
                <TextInput value={classRow.classroomWithoutBenches} onChange={setCR("classroomWithoutBenches")} type="number" />
              </Field>
            </div>
            <button onClick={handleAddRow} style={{ background: "#28a745", color: "#fff", border: "none", borderRadius: 4, padding: "6px 20px", fontSize: 14, cursor: "pointer", height: 32, flexShrink: 0 }}>
              Add
            </button>
          </div>
          {classRows.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 400, color: "#333", marginBottom: 12 }}>Filled Details</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, border: "1px solid #dee2e6" }}>
                  <thead>
                    <tr>
                      {["Sr No","Standard","Division","Separate Classroom For Each Division","Total Classroom With Benches","Total Classroom Without Benches","Delete"].map((h) => (
                        <th key={h} style={TH}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row, idx) => (
                      <tr key={row.id}>
                        <td style={TD}>{(page - 1) * pageSize + idx + 1}</td>
                        <td style={TD}>{row.standard}</td>
                        <td style={TD}>{row.division}</td>
                        <td style={TD}>{row.separateClassroom}</td>
                        <td style={TD}>{row.classroomWithBenches}</td>
                        <td style={TD}>{row.classroomWithoutBenches}</td>
                        <td style={TD}>
                          <button onClick={() => handleDeleteRow(row.id)} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 13, padding: 0 }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination total={classRows.length} pageSize={pageSize} setPageSize={setPageSize} page={page} setPage={setPage} />
            </div>
          )}
        </div>

        {/* Upload Photo */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 400, color: "#333", marginBottom: 14 }}>Upload Photo</div>
          <p style={{ color: "#cc0000", fontSize: 13, fontWeight: 400, marginBottom: 14, lineHeight: 1.5 }}>
            Note:- The size of the photograph should fall between 5KB to 100KB.
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <div>
              <Field label="Upload School Land Photo" required error={errors.photo}>
                <input type="file" accept="image/*" onChange={handlePhotoChange}
                  style={{ fontSize: 13, fontFamily: "var(--font-main)", padding: "4px 0" }} />
              </Field>
            </div>
            {photoPreview && (
              <div style={{ width: 120, height: 90, border: "1px solid #cccccc", borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
                <img src={photoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
          </div>
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