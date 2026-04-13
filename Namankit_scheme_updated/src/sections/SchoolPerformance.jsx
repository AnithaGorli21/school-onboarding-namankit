// ============================================================
//  src/sections/SchoolPerformance.jsx
//  Sub-section 3 — add/delete performance rows
//  Matches the table + "Filled Details" from image3.png
// ============================================================
import { useState } from "react";
import {
  Field, SelectInput, TextInput,
  SectionHeading, Row3, BtnAdd, Alert,
} from "../components/FormFields";

const YEAR_OPTIONS = [
  "2020-2021","2021-2022","2022-2023","2023-2024","2024-2025",
];
const STANDARD_OPTIONS = ["SSC","HSC","CBSE 10","CBSE 12","ICSE 10","ICSE 12"];

const th = {
  padding: "9px 12px",
  background: "#f8f9fa",
  borderBottom: "1px solid #dee2e6",
  fontSize: 13,
  fontWeight: 400,
  color: "#333",
  textAlign: "left",
};
const td = {
  padding: "8px 12px",
  borderBottom: "1px solid #eee",
  fontSize: 13,
  color: "#333",
};

export default function SchoolPerformance({ rows, setRows }) {
  const [newRow, setNewRow] = useState({
    year: "", standard: "", studentsAppeared: "", studentsPassed: "",
  });
  const [rowError, setRowError] = useState("");

  const setR = (key) => (val) =>
    setNewRow((prev) => ({ ...prev, [key]: val }));

  const handleAdd = () => {
    const { year, standard, studentsAppeared, studentsPassed } = newRow;
    if (!year || !standard || !studentsAppeared || !studentsPassed) {
      setRowError("Please fill all fields before clicking Add.");
      return;
    }
    setRowError("");
    setRows((prev) => [
      ...prev,
      { ...newRow, id: Date.now() },
    ]);
    setNewRow({ year: "", standard: "", studentsAppeared: "", studentsPassed: "" });
  };

  const handleDelete = (id) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  return (
    <div style={{ marginTop: 28 }}>
      {/* Performance entry row */}
      {rowError && (
        <Alert type="error" message={rowError} onClose={() => setRowError("")} />
      )}

      <Row3>
        <Field label="School Performance Year" required>
          <SelectInput
            value={newRow.year}
            onChange={setR("year")}
            options={YEAR_OPTIONS}
          />
        </Field>
        <Field label="Standard" required>
          <SelectInput
            value={newRow.standard}
            onChange={setR("standard")}
            options={STANDARD_OPTIONS}
          />
        </Field>
        <Field label="No of Students Appeared" required>
          <TextInput
            value={newRow.studentsAppeared}
            onChange={setR("studentsAppeared")}
            type="number"
          />
        </Field>
      </Row3>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 24 }}>
        <div style={{ width: "calc(33.33% - 10px)" }}>
          <Field label="No of Students Passed" required>
            <TextInput
              value={newRow.studentsPassed}
              onChange={setR("studentsPassed")}
              type="number"
            />
          </Field>
        </div>
        <BtnAdd onClick={handleAdd}>Add</BtnAdd>
      </div>

      {/* Filled details table */}
      {rows.length > 0 && (
        <>
          <SectionHeading title="Filled Details" />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Sr No","Year","Standard","No of Students Appeared","No of Students Passed","Delete"]
                  .map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.id}
                  style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                >
                  <td style={td}>{idx + 1}</td>
                  <td style={td}>{row.year}</td>
                  <td style={td}>{row.standard}</td>
                  <td style={td}>{row.studentsAppeared}</td>
                  <td style={td}>{row.studentsPassed}</td>
                  <td style={td}>
                    <button
                      onClick={() => handleDelete(row.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#c0392b",
                        cursor: "pointer",
                        fontWeight: 500,
                        fontSize: 13,
                        padding: 0,
                        fontFamily: "var(--font-main)",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}