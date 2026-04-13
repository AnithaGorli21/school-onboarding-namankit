
import { useState } from "react";

import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";

import SectionWrapper from "../components/SectionWrapper";

import Pagination from "../components/Pagination";

import { TH, TD, DELETE_BTN, ADD_BTN } from "../utils/Tablestyles";



const YES_NO       = ["Yes", "No"];

const ACHIEVEMENT  = ["District Level","State Level","National Level","International Level"];



const emptyForm = {

  ptTeacherAvailable: "", ptTeacherName: "", ptTeacherMobile: "",

  annualSportsDayObserved: "", interSchoolCompetition: "",

  sportsEquipmentAvailable: "", sportsEquipmentCondition: "",

  swimmingPool: "", swimmingCoach: "",

  athleticsTrack: "", indoorGamesRoom: "",

};



const emptyRow = {

  sportName: "", level: "", achievement: "", year: "",

};



export default function SportsFacilities({ onTabChange }) {

  const [form, setForm]     = useState(emptyForm);

  const [rows, setRows]     = useState([]);

  const [newRow, setNewRow] = useState(emptyRow);

  const [rowErr, setRowErr] = useState("");

  const [page, setPage]     = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [saving, setSaving] = useState(false);

  const [alert, setAlert]   = useState(null);



  const set  = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const setR = (k) => (v) => setNewRow(p => ({ ...p, [k]: v }));



  const handleAdd = () => {

    if (!newRow.sportName || !newRow.level || !newRow.year) {

      setRowErr("Please fill Sport Name, Level and Year."); return;

    }

    setRowErr("");

    setRows(p => [...p, { ...newRow, id: Date.now() }]);

    setNewRow(emptyRow); setPage(1);

  };



  const handleSave = async () => {

    setSaving(true); setAlert(null);

    try {

      await fetch("/o/c/sportsfacilities", {

        method: "POST", credentials: "include",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ ...form, achievementsData: JSON.stringify(rows) }),

      });

      setAlert({ type: "success", message: "Sports Facilities saved successfully!" });

    } catch (e) {

      setAlert({ type: "error", message: "Save failed — " + e.message });

    } finally { setSaving(false); }

  };



  const handleReset = () => {

    setForm(emptyForm); setRows([]); setNewRow(emptyRow);

    setAlert(null); setRowErr(""); setPage(1);

  };



  const paged = rows.slice((page-1)*pageSize, page*pageSize);



  return (

    <SectionWrapper alert={alert} onCloseAlert={() => setAlert(null)}

      onSave={handleSave} onReset={handleReset} saving={saving}>



      <SectionHeading title="Sports Facilities" />



      <Row3>

        <Field label="Physical Training Teacher Available" required>

          <SelectInput value={form.ptTeacherAvailable} onChange={set("ptTeacherAvailable")} options={YES_NO} />

        </Field>

        <Field label="PT Teacher Name">

          <TextInput value={form.ptTeacherName} onChange={set("ptTeacherName")}

            disabled={form.ptTeacherAvailable !== "Yes"} />

        </Field>

        <Field label="PT Teacher Mobile">

          <TextInput value={form.ptTeacherMobile} onChange={set("ptTeacherMobile")} type="tel"

            disabled={form.ptTeacherAvailable !== "Yes"} />

        </Field>

      </Row3>



      <Row3>

        <Field label="Annual Sports Day Observed" required>

          <SelectInput value={form.annualSportsDayObserved} onChange={set("annualSportsDayObserved")} options={YES_NO} />

        </Field>

        <Field label="Inter School Competition Participated" required>

          <SelectInput value={form.interSchoolCompetition} onChange={set("interSchoolCompetition")} options={YES_NO} />

        </Field>

        <Field label="Sports Equipment Available" required>

          <SelectInput value={form.sportsEquipmentAvailable} onChange={set("sportsEquipmentAvailable")} options={YES_NO} />

        </Field>

      </Row3>



      <Row3>

        <Field label="Sports Equipment Condition">

          <SelectInput value={form.sportsEquipmentCondition} onChange={set("sportsEquipmentCondition")}

            options={["Excellent","Good","Average","Poor"]}

            disabled={form.sportsEquipmentAvailable !== "Yes"} />

        </Field>

        <Field label="Swimming Pool Available" required>

          <SelectInput value={form.swimmingPool} onChange={set("swimmingPool")} options={YES_NO} />

        </Field>

        <Field label="Swimming Coach Available">

          <SelectInput value={form.swimmingCoach} onChange={set("swimmingCoach")} options={YES_NO}

            disabled={form.swimmingPool !== "Yes"} />

        </Field>

      </Row3>



      <Row2>

        <Field label="Athletics Track Available" required>

          <SelectInput value={form.athleticsTrack} onChange={set("athleticsTrack")} options={YES_NO} />

        </Field>

        <Field label="Indoor Games Room Available" required>

          <SelectInput value={form.indoorGamesRoom} onChange={set("indoorGamesRoom")} options={YES_NO} />

        </Field>

      </Row2>



      {/* Sports Achievements */}

      <div style={{ marginTop: 24 }}>

        <SectionHeading title="Sports Achievements" />

        {rowErr && <div style={{ color: "#cc0000", fontSize: 12, marginBottom: 8 }}>{rowErr}</div>}

        <Row3>

          <Field label="Sport Name" required>

            <TextInput value={newRow.sportName} onChange={setR("sportName")} />

          </Field>

          <Field label="Level" required>

            <SelectInput value={newRow.level} onChange={setR("level")} options={ACHIEVEMENT} />

          </Field>

          <Field label="Achievement / Position">

            <TextInput value={newRow.achievement} onChange={setR("achievement")} />

          </Field>

        </Row3>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 20 }}>

          <div style={{ width: "calc(33% - 8px)" }}>

            <Field label="Year" required>

              <TextInput value={newRow.year} onChange={setR("year")} type="number" placeholder="e.g. 2023" />

            </Field>

          </div>

          <button onClick={handleAdd} style={ADD_BTN}>Add</button>

        </div>



        {rows.length > 0 && (

          <>

            <div style={{ fontSize: 16, fontWeight: 400, color: "#333", marginBottom: 10 }}>Filled Details</div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>

              <thead><tr>

                {["Sr No","Sport Name","Level","Achievement","Year","Delete"].map(h => <th key={h} style={TH}>{h}</th>)}

              </tr></thead>

              <tbody>

                {paged.map((r, i) => (

                  <tr key={r.id}>

                    <td style={TD}>{(page-1)*pageSize+i+1}</td>

                    <td style={TD}>{r.sportName}</td>

                    <td style={TD}>{r.level}</td>

                    <td style={TD}>{r.achievement}</td>

                    <td style={TD}>{r.year}</td>

                    <td style={TD}><button style={DELETE_BTN} onClick={() => setRows(p => p.filter(x => x.id !== r.id))}>Delete</button></td>

                  </tr>

                ))}

              </tbody>

            </table>

            <Pagination total={rows.length} pageSize={pageSize} setPageSize={setPageSize} page={page} setPage={setPage} />

          </>

        )}

      </div>

    </SectionWrapper>

  );

}