// ============================================================
//  src/sections/SportsFacilities.jsx
// ============================================================
import { useState } from "react";
import { 
  Field, TextInput, SelectInput, 
  SectionHeading, Row3, Row2, 
  Alert, BtnSave, BtnReset 
} from "../components/FormFields";
import Pagination from "../components/Pagination";
import { TH, TD, DELETE_BTN, ADD_BTN } from "../utils/Tablestyles";

const YES_NO = ["Yes", "No"];
const MAGAZINE_TYPES = ["Monthly", "Quarterly", "Half-Yearly", "Annual"];
const YEARS = ["2023-2024", "2024-2025", "2025-2026"];

const themeStyles = {
  container: { padding: "var(--spacing-md, 16px) var(--spacing-lg, 20px)" },
  card: {
    background: "var(--card-bg, #ffffff)",
    border: "1px solid var(--border-color, #d6e0e0)",
    borderRadius: "var(--radius-sm, 3px)",
    padding: "18px 20px 22px",
    marginBottom: "20px"
  },
  addBtnRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    marginBottom: "20px"
  }
};

const emptyForm = {
  numPTTeachers: "",
  numSportsPlayed: "",
  detailsSportsPlayed: "", // Textarea/Text
  qualifiedSportsTeacher: "",
  separateAuditorium: "",
  auditoriumArea: "",
  schoolMagazine: "",
  schoolMagazineType: "",
};

export default function SportsFacilities() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  // States for Cultural Programs table
  const [culturalRows, setCulturalRows] = useState([]);
  const [newCultural, setNewCultural] = useState({ year: "", programName: "", remarks: "" });

  // States for Educational Tours table
  const [tourRows, setTourRows] = useState([]);
  const [newTour, setNewTour] = useState({ year: "", programName: "", place: "", purpose: "" });

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const addCultural = () => {
    if (!newCultural.year || !newCultural.programName) return;
    setCulturalRows([...culturalRows, { ...newCultural, id: Date.now() }]);
    setNewCultural({ year: "", programName: "", remarks: "" });
  };

  const addTour = () => {
    if (!newTour.year || !newTour.programName || !newTour.place) return;
    setTourRows([...tourRows, { ...newTour, id: Date.now() }]);
    setNewTour({ year: "", programName: "", place: "", purpose: "" });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        culturalPrograms: culturalRows,
        educationalTours: tourRows
      };
      await fetch("/o/c/sportsfacilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setAlert({ type: "success", message: "Sports Facilities saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed." });
    } finally { setSaving(false); }
  };

  return (
    <div style={themeStyles.container}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div style={themeStyles.card}>
        <SectionHeading title="Sports Facilities" />
        
        <Row3>
          <Field label="Number Of Physical Education (PT) teacher available" required>
            <TextInput value={form.numPTTeachers} onChange={set("numPTTeachers")} type="number" />
          </Field>
          <Field label="Number Of sports Played On PlayGround" required>
            <TextInput value={form.numSportsPlayed} onChange={set("numSportsPlayed")} type="number" />
          </Field>
          <Field label="Details Of sports Played On PlayGround" required>
            <TextInput value={form.detailsSportsPlayed} onChange={set("detailsSportsPlayed")} placeholder="Basketball, Football..." />
          </Field>
        </Row3>

        <Row3>
          <Field label="Availabilty of qualified Sport's Teachers as per students' count" required>
            <SelectInput value={form.qualifiedSportsTeacher} onChange={set("qualifiedSportsTeacher")} options={YES_NO} />
          </Field>
          <div /> <div />
        </Row3>

        <Row2>
          <Field label="Availabilty Of Separate Auditorium" required>
            <SelectInput value={form.separateAuditorium} onChange={set("separateAuditorium")} options={YES_NO} />
          </Field>
          <Field label="Auditorium Area(sq ft)" required>
            <TextInput value={form.auditoriumArea} onChange={set("auditoriumArea")} type="number" />
          </Field>
        </Row2>

        <Row2>
          <Field label="School Magazine" required>
            <SelectInput value={form.schoolMagazine} onChange={set("schoolMagazine")} options={YES_NO} />
          </Field>
          <Field label="School MagazineType" required>
            <SelectInput value={form.schoolMagazineType} onChange={set("schoolMagazineType")} options={MAGAZINE_TYPES} />
          </Field>
        </Row2>

        {/* CULTURAL PROGRAMS SECTION */}
        <div style={{ marginTop: 30 }}>
          <SectionHeading title="Cultural programs conducted by school" />
          <Row3>
            <Field label="Year" required>
              <SelectInput value={newCultural.year} onChange={(v) => setNewCultural({...newCultural, year: v})} options={YEARS} />
            </Field>
            <Field label="Program Name" required>
              <TextInput value={newCultural.programName} onChange={(v) => setNewCultural({...newCultural, programName: v})} />
            </Field>
            <Field label="Remarks" required>
              <TextInput value={newCultural.remarks} onChange={(v) => setNewCultural({...newCultural, remarks: v})} />
            </Field>
          </Row3>
          <div style={themeStyles.addBtnRow}>
            <button onClick={addCultural} style={ADD_BTN}>Add Program</button>
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
                    <td style={TD}>{r.year}</td>
                    <td style={TD}>{r.programName}</td>
                    <td style={TD}>{r.remarks}</td>
                    <td style={TD}><button style={DELETE_BTN} onClick={() => setCulturalRows(culturalRows.filter(x => x.id !== r.id))}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* EDUCATIONAL TOURS SECTION */}
        <div style={{ marginTop: 30 }}>
          <SectionHeading title="Educational tours conducted by school" />
          <Row3>
            <Field label="Year" required>
              <SelectInput value={newTour.year} onChange={(v) => setNewTour({...newTour, year: v})} options={YEARS} />
            </Field>
            <Field label="Program Name" required>
              <TextInput value={newTour.programName} onChange={(v) => setNewTour({...newTour, programName: v})} />
            </Field>
            <Field label="Place" required>
              <TextInput value={newTour.place} onChange={(v) => setNewTour({...newTour, place: v})} />
            </Field>
          </Row3>
          <Row2>
            <Field label="Purpose" required>
              <TextInput value={newTour.purpose} onChange={(v) => setNewTour({...newTour, purpose: v})} />
            </Field>
            <div />
          </Row2>
          <div style={themeStyles.addBtnRow}>
            <button onClick={addTour} style={ADD_BTN}>Add Educational Tours</button>
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
                    <td style={TD}>{r.year}</td>
                    <td style={TD}>{r.programName}</td>
                    <td style={TD}>{r.place}</td>
                    <td style={TD}>{r.purpose}</td>
                    <td style={TD}><button style={DELETE_BTN} onClick={() => setTourRows(tourRows.filter(x => x.id !== r.id))}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 12 }}>
        <BtnSave onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</BtnSave>
      </div>
    </div>
  );
}