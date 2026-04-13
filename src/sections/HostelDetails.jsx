import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";
import Pagination from "../components/Pagination";
import { TH, TD, DELETE_BTN, ADD_BTN } from "../utils/Tablestyles";

const YES_NO = ["Yes", "No"];
const HOSTEL_TYPE = ["Government", "Private", "Trust"];

const emptyForm = {
  boysHostelAvailable: "", boysHostelCapacity: "",
  girlsHostelAvailable: "", girlsHostelCapacity: "",
  hostelType: "", hostelBuildingCondition: "",
  hostelWaterSupply: "", hostelElectricity: "",
  separateDiningHall: "", separateStudyRoom: "",
  hostelWarden: "", wardenName: "", wardenMobile: "",
  hostelRemark: "",
};

const emptyRow = { roomType: "", totalRooms: "", capacity: "" };

export default function HostelDetails({ onTabChange }) {
  const [form, setForm] = useState(emptyForm);
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState(emptyRow);
  const [rowErr, setRowErr] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));
  const setR = (k) => (v) => setNewRow(p => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!newRow.roomType || !newRow.totalRooms || !newRow.capacity) {
      setRowErr("Please fill all room fields before adding."); return;
    }
    setRowErr("");
    setRows(p => [...p, { ...newRow, id: Date.now() }]);
    setNewRow(emptyRow); 
    setPage(1);
  };

  const handleSave = async () => {
    setSaving(true); setAlert(null);
    try {
      await fetch("/o/c/hosteldetails", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, roomsData: JSON.stringify(rows) }),
      });
      setAlert({ type: "success", message: "Hostel Details saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally { setSaving(false); }
  };

  const handleReset = () => {
    setForm(emptyForm); setRows([]); setNewRow(emptyRow);
    setAlert(null); setRowErr(""); setPage(1);
  };

  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <SectionWrapper alert={alert} onCloseAlert={() => setAlert(null)}
      onSave={handleSave} onReset={handleReset} saving={saving}>

      <SectionHeading title="Hostel Details" />

      <Row3>
        <Field label="Boys Hostel Available" required>
          <SelectInput value={form.boysHostelAvailable} onChange={set("boysHostelAvailable")} options={YES_NO} />
        </Field>
        <Field label="Boys Hostel Capacity">
          <TextInput value={form.boysHostelCapacity} onChange={set("boysHostelCapacity")} type="number"
            disabled={form.boysHostelAvailable !== "Yes"} />
        </Field>
        <Field label="Girls Hostel Available" required>
          <SelectInput value={form.girlsHostelAvailable} onChange={set("girlsHostelAvailable")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Girls Hostel Capacity">
          <TextInput value={form.girlsHostelCapacity} onChange={set("girlsHostelCapacity")} type="number"
            disabled={form.girlsHostelAvailable !== "Yes"} />
        </Field>
        <Field label="Hostel Type" required>
          <SelectInput value={form.hostelType} onChange={set("hostelType")} options={HOSTEL_TYPE} />
        </Field>
        <Field label="Hostel Building Condition" required>
          <SelectInput value={form.hostelBuildingCondition} onChange={set("hostelBuildingCondition")}
            options={["Good", "Average", "Poor", "Under Construction"]} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Water Supply in Hostel" required>
          <SelectInput value={form.hostelWaterSupply} onChange={set("hostelWaterSupply")} options={YES_NO} />
        </Field>
        <Field label="Electricity in Hostel" required>
          <SelectInput value={form.hostelElectricity} onChange={set("hostelElectricity")} options={YES_NO} />
        </Field>
        <Field label="Separate Dining Hall" required>
          <SelectInput value={form.separateDiningHall} onChange={set("separateDiningHall")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Separate Study Room" required>
          <SelectInput value={form.separateStudyRoom} onChange={set("separateStudyRoom")} options={YES_NO} />
        </Field>
        <Field label="Hostel Warden Appointed" required>
          <SelectInput value={form.hostelWarden} onChange={set("hostelWarden")} options={YES_NO} />
        </Field>
        <Field label="Warden Name">
          <TextInput value={form.wardenName} onChange={set("wardenName")}
            disabled={form.hostelWarden !== "Yes"} />
        </Field>
      </Row3>

      <Row2>
        <Field label="Warden Mobile Number">
          <TextInput value={form.wardenMobile} onChange={set("wardenMobile")} type="tel"
            disabled={form.hostelWarden !== "Yes"} />
        </Field>
        <Field label="Remark">
          <TextInput value={form.hostelRemark} onChange={set("hostelRemark")} />
        </Field>
      </Row2>

      {/* Room Details */}
      <div style={{ marginTop: 24 }}>
        <SectionHeading title="Hostel Room Details" />
        {rowErr && <div style={{ color: "#cc0000", fontSize: 12, marginBottom: 8 }}>{rowErr}</div>}
        <Row3>
          <Field label="Room Type" required>
            <SelectInput value={newRow.roomType} onChange={setR("roomType")}
              options={["Single", "Double", "Dormitory"]} />
          </Field>
          <Field label="Total Rooms" required>
            <TextInput value={newRow.totalRooms} onChange={setR("totalRooms")} type="number" />
          </Field>
          <Field label="Capacity Per Room" required>
            <TextInput value={newRow.capacity} onChange={setR("capacity")} type="number" />
          </Field>
        </Row3>
        <div style={{ marginBottom: 16 }}>
          <button onClick={handleAdd} style={ADD_BTN}>Add</button>
        </div>

        {rows.length > 0 && (
          <>
            <div style={{ fontSize: 16, fontWeight: 400, color: "#333", marginBottom: 10 }}>Filled Details</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr>
                {["Sr No", "Room Type", "Total Rooms", "Capacity Per Room", "Delete"].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {paged.map((r, i) => (
                  <tr key={r.id}>
                    <td style={TD}>{(page - 1) * pageSize + i + 1}</td>
                    <td style={TD}>{r.roomType}</td>
                    <td style={TD}>{r.totalRooms}</td>
                    <td style={TD}>{r.capacity}</td>
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