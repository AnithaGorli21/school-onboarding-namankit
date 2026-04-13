// ============================================================
//  src/sections/SchoolIntake.jsx
//  Sub-section 2 — student count grid with auto-totals
//  Exactly matches the table in image3.png
// ============================================================
import { TextInput, SectionHeading } from "../components/FormFields";

// Cell style helpers
const th = (extra = {}) => ({
  padding: "9px 10px",
  background: "#f8f9fa",
  borderBottom: "1px solid #dee2e6",
  borderRight: "1px solid #dee2e6",
  fontSize: 13,
  fontWeight: 600,
  color: "#333",
  textAlign: "left",
  ...extra,
});

const td = (extra = {}) => ({
  padding: "7px 10px",
  borderBottom: "1px solid #dee2e6",
  borderRight: "1px solid #dee2e6",
  fontSize: 13,
  color: "#333",
  ...extra,
});

const toNum = (v) => parseInt(v || 0, 10);

export default function SchoolIntake({ intake, setIntake }) {
  const set = (key) => (val) =>
    setIntake((prev) => ({ ...prev, [key]: val }));

  // ── Computed totals ──────────────────────────────────────
  const namankit_res_boys    = toNum(intake.namankit_boys_residential);
  const namankit_nonres_boys = toNum(intake.namankit_boys_nonresidential);
  const other_res_boys       = toNum(intake.other_boys_residential);
  const other_nonres_boys    = toNum(intake.other_boys_nonresidential);

  const namankit_res_girls    = toNum(intake.namankit_girls_residential);
  const namankit_nonres_girls = toNum(intake.namankit_girls_nonresidential);
  const other_res_girls       = toNum(intake.other_girls_residential);
  const other_nonres_girls    = toNum(intake.other_girls_nonresidential);

  const total_boys  = namankit_res_boys + namankit_nonres_boys + other_res_boys + other_nonres_boys;
  const total_girls = namankit_res_girls + namankit_nonres_girls + other_res_girls + other_nonres_girls;

  const col_namankit_res    = namankit_res_boys    + namankit_res_girls;
  const col_namankit_nonres = namankit_nonres_boys + namankit_nonres_girls;
  const col_other_res       = other_res_boys       + other_res_girls;
  const col_other_nonres    = other_nonres_boys    + other_nonres_girls;
  const grand_total         = total_boys + total_girls;

  return (
    <div style={{ marginTop: 28 }}>
      <SectionHeading title="School Intake" />

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #dee2e6",
            fontSize: 13,
          }}
        >
          <thead>
            {/* Row 1: group headers */}
            <tr>
              <th style={th({ width: 60 })}></th>
              <th style={th({ textAlign: "center" })} colSpan={2}>
                Total Students Under Namankit Scheme
              </th>
              <th style={th({ textAlign: "center" })} colSpan={2}>
                Total Students Except Namankit Scheme
              </th>
              <th style={th({ textAlign: "center", borderRight: "none" })}>
                Total
              </th>
            </tr>
            {/* Row 2: sub-headers */}
            <tr>
              <th style={th()}></th>
              <th style={th()}>Residential</th>
              <th style={th()}>Non-residential</th>
              <th style={th()}>Residential</th>
              <th style={th()}>Non-residential</th>
              <th style={th({ borderRight: "none" })}></th>
            </tr>
          </thead>

          <tbody>
            {/* Boys row */}
            <tr>
              <td style={td({ fontWeight: 600 })}>Boys</td>
              <td style={td()}>
                <TextInput
                  value={intake.namankit_boys_residential}
                  onChange={set("namankit_boys_residential")}
                  type="number"
                />
              </td>
              <td style={td()}>
                <TextInput
                  value={intake.namankit_boys_nonresidential}
                  onChange={set("namankit_boys_nonresidential")}
                  type="number"
                />
              </td>
              <td style={td()}>
                <TextInput
                  value={intake.other_boys_residential}
                  onChange={set("other_boys_residential")}
                  type="number"
                />
              </td>
              <td style={td()}>
                <TextInput
                  value={intake.other_boys_nonresidential}
                  onChange={set("other_boys_nonresidential")}
                  type="number"
                />
              </td>
              <td style={td({ background: "#f5f5f5", fontWeight: 600, borderRight: "none" })}>
                {total_boys}
              </td>
            </tr>

            {/* Girls row */}
            <tr>
              <td style={td({ fontWeight: 600 })}>Girls</td>
              <td style={td()}>
                <TextInput
                  value={intake.namankit_girls_residential}
                  onChange={set("namankit_girls_residential")}
                  type="number"
                />
              </td>
              <td style={td()}>
                <TextInput
                  value={intake.namankit_girls_nonresidential}
                  onChange={set("namankit_girls_nonresidential")}
                  type="number"
                />
              </td>
              <td style={td()}>
                <TextInput
                  value={intake.other_girls_residential}
                  onChange={set("other_girls_residential")}
                  type="number"
                />
              </td>
              <td style={td()}>
                <TextInput
                  value={intake.other_girls_nonresidential}
                  onChange={set("other_girls_nonresidential")}
                  type="number"
                />
              </td>
              <td style={td({ background: "#f5f5f5", fontWeight: 600, borderRight: "none" })}>
                {total_girls}
              </td>
            </tr>

            {/* Total row */}
            <tr style={{ background: "#f0f4f8" }}>
              <td style={td({ fontWeight: 600 })}>Total</td>
              <td style={td({ fontWeight: 600 })}>{col_namankit_res}</td>
              <td style={td({ fontWeight: 600 })}>{col_namankit_nonres}</td>
              <td style={td({ fontWeight: 600 })}>{col_other_res}</td>
              <td style={td({ fontWeight: 600 })}>{col_other_nonres}</td>
              <td
                style={td({
                  fontWeight: 400,
                  color: "#1a6070",
                  background: "#e8f4f8",
                  borderRight: "none",
                })}
              >
                {grand_total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}