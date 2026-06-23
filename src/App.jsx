import { useState, useMemo } from "react";

// ── Theme: #d0f8ce light AIS Fibre ──
const C = {
  bg: "#d0f8ce",           // main page bg
  cardBg: "#ffffff",
  headerBg: "#2e7d32",     // dark green header
  headerLight: "#43a047",
  primary: "#2e7d32",
  primaryLight: "#e8f5e9",
  accent: "#43a047",
  border: "#a5d6a7",
  text: "#1b5e20",
  textLight: "#388e3c",
  gray: "#81c784",
  white: "#ffffff",
  summaryBg: "#388e3c",
};

const P = {
  "ODF 32F Wall": 6500, "ODF 72F Wall": 18500, "ODF 144F Wall": 26500, "ODF 288F Wall": 35500,
  "ODF 72F Ground": 20500, "CONC BASE 72F": 10500,
  "ODF 600F Cabinet": 90000, "ODF 120F 4U Rack": 20000, "ODF 24F 1U Rack": 10000,
  "Install ODF 600F": 7000, "CONC BASE 600F": 20000,
  "Splitter 1:4": 350, "Splitter 1:8": 550, "Splitter 1:16": 700, "Panel 8S": 200,
  "Pole 1:8 L1": 4000, "Pole 1:8 L2": 2500, "Pole 1:16 L2": 5000, "RISER POLE": 3000,
  "ADSS 24C": 60, "ADSS 48C": 70, "ADSS 120C": 145, "ADSS-M 12C": 40,
  "ADSS-D 12C": 55, "ADSS-D 24C": 59, "ADSS-D 48C": 78, "ADSS-D 120C": 117,
  "Duct 12C": 65, "Duct 24C": 75, "Duct 48C": 95, "Duct 120C": 180,
  "Duct BJ 12C": 4500, "Duct BJ 24C": 5300, "Duct BJ 48C": 6800, "Duct BJ 120C": 10800,
  "Splice 12F": 4300, "Splice 24F": 5600, "Splice 48F": 7000, "Splice 120F": 12500,
  "Term 1C": 400, "Term 2C": 780, "Term 3C": 1170, "Term 4C": 1300,
  "Term 6C": 1560, "Term 12C": 4500, "Term 24C": 9000, "Term 48C": 17000, "Term 120C": 25000,
  "A8 Pole": 18000,
  'Flex RT 1/2"': 200, 'Flex RT 3/4"': 250, 'Flex RT 1"': 300,
  'Flex 1/2"': 100, 'Flex 3/4"': 150, 'Flex 1"': 200,
  'IMC 1/2"': 200, 'IMC 3/4"': 250, 'IMC 1"': 300,
  'uPVC 1/2"': 100, 'uPVC 3/4"': 120, 'uPVC 1"': 150,
  'PVC 1/2"': 80, 'PVC 3/4"': 100, 'PVC 1"': 130,
  'HDPE 1/2"': 80, 'HDPE 3/4"': 120, 'HDPE 1"': 150, 'HDPE 2"': 250,
  "Road Cut": 850, "Break PB": 850,
  "PB 4x4 Galv": 650, "PB 6x6 Galv": 845, "PB 10x10 Galv": 1235, "PB 12x12 Galv": 1514.5,
  "PB 4x4 Plastic": 180, "PB 6x6 Plastic": 200, "PB 10x10 Plastic": 400, "PB 12x12 Plastic": 450,
  "HH-01 CONC": 6000,
  "Flat 1C": 15, "Flat 2C": 18, "Round 1C": 21, "Round 2C": 25,
  "Armoured 1C": 21, "Armoured 2C": 25, "Duct Flat 1C": 16.38, "Duct Flat 2C": 18.72,
  "TB Outlet 1C": 200, "Splice@House": 350,
  "Splice Drop Wire": 350, "Break Sewer": 2500,
  "Survey": 5000, "IGIS": 5000, "Test & Report": 4000,
  "Accessories Fee": 500, "Management Fee": 1000,
};

const fmt = (n) => Math.round(n).toLocaleString("th-TH");
const nv = (v) => parseFloat(v) || 0;
const FONT = "'Taviraj', 'Sarabun', sans-serif";

// ── Stepper input: +/- buttons for easy qty entry ──
function Stepper({ value, onChange, min = 0 }) {
  const v = nv(value);
  const btn = (delta) => ({
    onClick: () => onChange(String(Math.max(min, v + delta))),
    style: {
      width: 28, height: 32, border: `1px solid ${C.border}`,
      background: delta > 0 ? C.primaryLight : "#fff",
      borderRadius: delta > 0 ? "0 6px 6px 0" : "6px 0 0 6px",
      cursor: "pointer", fontSize: 16, fontWeight: 700,
      color: C.primary, display: "flex", alignItems: "center",
      justifyContent: "center", flexShrink: 0,
    }
  });
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button {...btn(-1)}>−</button>
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: 46, height: 32, border: `1px solid ${C.border}`,
          borderLeft: "none", borderRight: "none",
          textAlign: "center", fontSize: 14, fontFamily: "monospace",
          fontWeight: 700, color: C.text, background: "#fff", outline: "none",
        }} />
      <button {...btn(1)}>+</button>
    </div>
  );
}

function SubLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: FONT,
      textTransform: "uppercase", letterSpacing: "0.8px",
      marginTop: 6, paddingBottom: 4, borderBottom: `1px solid ${C.border}` }}>
      {children}
    </div>
  );
}

function Section({ num, title, total, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: C.cardBg, borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: "0 1px 6px rgba(46,125,50,0.08)", overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        background: `linear-gradient(90deg, ${C.headerBg}, ${C.headerLight})`,
        border: "none", cursor: "pointer", padding: "11px 14px", color: C.white, fontFamily: FONT,
      }}>
        <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 5, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{num}</span>
        <span style={{ fontSize: 14, fontWeight: 600, flex: 1, textAlign: "left", fontFamily: FONT }}>{title}</span>
        {total > 0 && <span style={{ fontFamily: "monospace", fontSize: 13, color: "#c8f7c5", fontWeight: 600 }}>฿{fmt(total)}</span>}
        <span style={{ color: "#c8f7c5", fontSize: 11, marginLeft: 4 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>{children}</div>}
    </div>
  );
}

function Collapsible({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, fontSize: 11, fontWeight: 600, padding: "3px 0", display: "flex", alignItems: "center", gap: 4, fontFamily: FONT }}>
        <span style={{ fontSize: 10 }}>{open ? "▼" : "▶"}</span>{open ? "ซ่อน" : "แสดง"} {label}
      </button>
      {open && <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>{children}</div>}
    </div>
  );
}

// Checkbox group with stepper qty
function CheckGroup({ items, values, setValues }) {
  const toggle = (key) => setValues(p => {
    const n = { ...p };
    if (n[key] !== undefined) delete n[key]; else n[key] = "0";
    return n;
  });
  const setQty = (key, val) => setValues(p => ({ ...p, [key]: val }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map(item => {
        const active = values[item.key] !== undefined;
        const q = values[item.key] ?? "0";
        const total = nv(q) * (P[item.key] || 0);
        return (
          <div key={item.key} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 10px", borderRadius: 8,
            border: `1.5px solid ${active ? C.primary : C.border}`,
            background: active ? C.primaryLight : "#fafcfa",
          }}>
            <input type="checkbox" checked={active} onChange={() => toggle(item.key)}
              style={{ accentColor: C.primary, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }} />
            <span onClick={() => toggle(item.key)} style={{ fontSize: 13, flex: 1, color: active ? C.text : C.textLight, fontWeight: active ? 600 : 400, cursor: "pointer", fontFamily: FONT }}>{item.label}</span>
            {active && <Stepper value={q} onChange={v => setQty(item.key, v)} />}
            {active && nv(q) > 0
              ? <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.primary, minWidth: 64, textAlign: "right" }}>฿{fmt(total)}</span>
              : <span style={{ minWidth: 64 }} />}
          </div>
        );
      })}
    </div>
  );
}

// BJ+Splice paired
function BjSpliceGroup({ bjSels, setBjSels }) {
  const PAIRS = [
    { core: "12C", bjKey: "Duct BJ 12C", spKey: "Splice 12F" },
    { core: "24C", bjKey: "Duct BJ 24C", spKey: "Splice 24F" },
    { core: "48C", bjKey: "Duct BJ 48C", spKey: "Splice 48F" },
    { core: "120C", bjKey: "Duct BJ 120C", spKey: "Splice 120F" },
  ];
  const toggle = (bj, sp) => setBjSels(p => {
    const n = { ...p };
    if (n[bj] !== undefined) { delete n[bj]; delete n[sp]; } else { n[bj] = "0"; n[sp] = "0"; }
    return n;
  });
  const setQ = (bj, sp, val) => setBjSels(p => ({ ...p, [bj]: val, [sp]: val }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {PAIRS.map(({ core, bjKey, spKey }) => {
        const active = bjSels[bjKey] !== undefined;
        const q = bjSels[bjKey] ?? "0";
        const total = nv(q) * (P[bjKey] + P[spKey]);
        return (
          <div key={core} style={{ borderRadius: 8, border: `1.5px solid ${active ? C.primary : C.border}`, background: active ? C.primaryLight : "#fafcfa", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px" }}>
              <input type="checkbox" checked={active} onChange={() => toggle(bjKey, spKey)}
                style={{ accentColor: C.primary, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }} />
              <span onClick={() => toggle(bjKey, spKey)} style={{ fontSize: 13, flex: 1, fontWeight: active ? 600 : 400, color: active ? C.text : C.textLight, cursor: "pointer", fontFamily: FONT }}>Core {core}</span>
              {active && <Stepper value={q} onChange={v => setQ(bjKey, spKey, v)} />}
              {active && nv(q) > 0
                ? <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.primary, minWidth: 64, textAlign: "right" }}>฿{fmt(total)}</span>
                : <span style={{ minWidth: 64 }} />}
            </div>
            {active && nv(q) > 0 && (
              <div style={{ padding: "0 10px 6px 42px", fontSize: 11, color: C.textLight, fontFamily: FONT }}>
                BJ: ฿{fmt(nv(q) * P[bjKey])} + Splice: ฿{fmt(nv(q) * P[spKey])}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Simple qty row with stepper
function QtyRow({ label, unit, priceKey, value, onChange }) {
  const total = nv(value) * (P[priceKey] || 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 7, border: `1px solid ${C.border}`, background: "#fafcfa" }}>
      <span style={{ fontSize: 12, flex: 1, color: C.text, fontFamily: FONT }}>{label}</span>
      <Stepper value={value} onChange={onChange} />
      <span style={{ fontSize: 11, color: C.gray, width: 22 }}>{unit}</span>
      {total > 0
        ? <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.primary, minWidth: 64, textAlign: "right" }}>฿{fmt(total)}</span>
        : <span style={{ minWidth: 64 }} />}
    </div>
  );
}

// Per-home row with price override input
// qty auto = จำนวนหลัง, แก้ได้ด้วย stepper, ราคาคงที่จาก P[]
function PerHomeRow({ label, priceKey, homesN, qtyOverride, setQtyOverride }) {
  const price = P[priceKey] || 0;
  const qty = qtyOverride !== "" ? nv(qtyOverride) : homesN;
  const total = qty * price;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7, border: "1px solid #b3dfd4", background: "#f0fbf6" }}>
      <span style={{ fontSize: 12, flex: 1, color: C.text, fontFamily: FONT }}>{label}</span>
      <span style={{ fontSize: 11, color: C.gray, whiteSpace: "nowrap" }}>จำนวน</span>
      <Stepper value={String(qty)} onChange={v => setQtyOverride(v)} />
      <span style={{ fontSize: 11, color: C.gray, whiteSpace: "nowrap" }}>× ฿{fmt(price)}</span>
      {total > 0
        ? <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.primary, minWidth: 68, textAlign: "right" }}>฿{fmt(total)}</span>
        : <span style={{ minWidth: 68 }} />}
    </div>
  );
}

function AutoNote({ children }) {
  return (
    <div style={{ fontSize: 11, color: "#1b5e20", background: "#dcedc8", borderRadius: 5, padding: "5px 9px", border: "1px solid #aed581", fontFamily: FONT }}>
      ✓ {children}
    </div>
  );
}

// ── JSON EXPORT (สำหรับ Python fill_template.py) ──
// ── EXCEL EXPORT ──
// Sheet1: Summary แนวนอน
// Sheet2: Template-compatible — col A=row_number, col B=qty
//         วางตรง col H ของ Price_Underground_V6_2.xlsx ได้เลย
async function doExport(state) {
  const XLSX = await import("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/xlsx.mjs");
  const wb = XLSX.utils.book_new();
  const { homes, villageName, oltPON, odnVal, onuPerHome, onuBoxPerHome, pipeNotes, sub } = state;
  const homesN = nv(homes);

  // ── Sheet 1: Summary ──
  const hdr = ["ชื่อหมู่บ้าน","จำนวนหลัง","Cost/Sub","Total Village Cost","OLT+ODN","Main Fiber ถึง SPT2","LM/หลัง","ติดตั้ง ONU/หลัง","ONU Box/หลัง","ค่าเดินท่อ (บันทึก)"];
  const val = [villageName||"", homesN, Math.round(sub.costPerSub), Math.round(sub.totalVillage), Math.round(sub.oltOdn), Math.round(sub.mainSPT), Math.round(sub.lmPerHome), nv(onuPerHome), nv(onuBoxPerHome), nv(pipeNotes)];
  const ws1 = XLSX.utils.aoa_to_sheet([hdr, val]);
  ws1["!cols"] = hdr.map(h => ({ wch: Math.max(h.length + 2, 14) }));
  XLSX.utils.book_append_sheet(wb, ws1, "Summary");

  // ── Sheet 2: Template Qty Column ──
  // row map: key=row# ใน template, value=qty
  // วิธีใช้: copy col B (qty) ทั้งหมด แล้ว paste-special (values only) ที่ col H ของ template
  const rowMap = {};
  const set = (r, q) => { if (q > 0) rowMap[r] = q; };

  // Cabinet Wall Mount
  const wR = { "ODF 32F Wall": 5, "ODF 72F Wall": 6, "ODF 144F Wall": 7, "ODF 288F Wall": 8 };
  Object.entries(state.wallVals).forEach(([k, q]) => { if (wR[k]) set(wR[k], nv(q)); });
  // On Ground
  const gq = nv(state.groundVals["ODF 72F Ground"]);
  set(9, gq); set(10, gq); // CONC BASE auto
  // 600F
  const c6q = nv(state.cab600qtys["ODF 600F Cabinet"]);
  set(11, c6q); set(12, nv(state.cab600qtys["ODF 120F 4U Rack"])); set(13, nv(state.cab600qtys["ODF 24F 1U Rack"]));
  set(14, c6q); set(15, c6q); // Install + CONC auto
  // Splitter
  const sR = { "Splitter 1:4": 16, "Splitter 1:8": 17, "Splitter 1:16": 18, "Panel 8S": 19 };
  Object.entries(state.splSels).forEach(([k, q]) => { if (sR[k]) set(sR[k], nv(q)); });
  // Pole
  const pR = { "Pole 1:8 L1": 20, "Pole 1:8 L2": 21, "Pole 1:16 L2": 22 };
  let tp = 0;
  Object.entries(state.poleSels).forEach(([k, q]) => { if (pR[k]) { set(pR[k], nv(q)); tp += nv(q); } });
  set(23, tp); // RISER auto
  // Fiber
  const fR = { "ADSS 24C":28,"ADSS 48C":29,"ADSS 120C":30,"ADSS-M 12C":31,"ADSS-D 12C":32,"ADSS-D 24C":33,"ADSS-D 48C":34,"ADSS-D 120C":35,"Duct 12C":40,"Duct 24C":41,"Duct 48C":42,"Duct 120C":43 };
  Object.entries(state.fiberVals).forEach(([k, q]) => { if (fR[k]) set(fR[k], nv(q)); });
  // ODP BJ + Splice
  const bR = { "Duct BJ 12C":46,"Duct BJ 24C":47,"Duct BJ 48C":48,"Duct BJ 120C":49,"Splice 12F":50,"Splice 24F":51,"Splice 48F":52,"Splice 120F":53 };
  Object.entries(state.bjSels).forEach(([k, q]) => { if (bR[k]) set(bR[k], nv(q)); });
  // Terminate
  const tR = { "Term 1C":63,"Term 2C":64,"Term 3C":65,"Term 4C":66,"Term 6C":68,"Term 12C":74,"Term 24C":75,"Term 48C":76,"Term 120C":77 };
  Object.entries(state.termSels).forEach(([k, q]) => { if (tR[k]) set(tR[k], nv(q)); });
  // Civil
  const cR = { "A8 Pole":79,'Flex RT 1/2"':80,'Flex RT 3/4"':81,'Flex RT 1"':82,'Flex 1/2"':83,'Flex 3/4"':84,'Flex 1"':85,'IMC 1/2"':86,'IMC 3/4"':87,'IMC 1"':88,'uPVC 1/2"':89,'uPVC 3/4"':90,'uPVC 1"':91,'PVC 1/2"':92,'PVC 3/4"':93,'PVC 1"':94,'HDPE 1/2"':95,'HDPE 3/4"':96,'HDPE 1"':97,'HDPE 2"':98,"Road Cut":100,"Break PB":101,"PB 4x4 Galv":102,"PB 6x6 Galv":103,"PB 10x10 Galv":104,"PB 12x12 Galv":105,"PB 4x4 Plastic":106,"PB 6x6 Plastic":107,"PB 10x10 Plastic":108,"PB 12x12 Plastic":109,"HH-01 CONC":110 };
  Object.entries(state.civilVals).forEach(([k, q]) => { if (cR[k]) set(cR[k], nv(q)); });
  // Lastmile
  const lR = { "Flat 1C":112,"Flat 2C":113,"Round 1C":114,"Round 2C":115,"Armoured 1C":116,"Armoured 2C":117,"Duct Flat 1C":118,"Duct Flat 2C":119 };
  Object.entries(state.lmSels).forEach(([k, q]) => { if (lR[k]) set(lR[k], nv(q)); });
  set(120, state.tbQty !== "" ? nv(state.tbQty) : homesN);
  set(123, state.spliceHouseQty !== "" ? nv(state.spliceHouseQty) : homesN);
  set(124, nv(state.spliceDrop)); set(125, nv(state.breakSewer));
  // Management
  set(127, nv(state.survey)); set(128, nv(state.igis)); set(129, nv(state.testReport));
  set(130, state.accQty !== "" ? nv(state.accQty) : homesN);
  set(131, state.mgmtQty !== "" ? nv(state.mgmtQty) : homesN);
  set(249, homesN);

  // Build sheet: col A = row#, col B = description (อ้างอิง), col C = qty
  const tmplRows = [
    ["วิธีใช้: Copy คอลัมน์ C (Qty) ทั้งหมด → Paste Special (Values Only) ที่คอลัมน์ H ของ Price_Underground_V6_2.xlsx"],
    [`หมู่บ้าน: ${villageName || "-"}`, "", `จำนวนหลัง: ${homesN}`],
    ["Row#", "Description", "Qty (วางที่ col H)"],
  ];
  const descMap = {
    5:"ODF 32F Wall Mount",6:"ODF 72F Wall Mount",7:"ODF 144F Wall Mount",8:"ODF 288F Wall Mount",
    9:"ODF 72F On Ground",10:"CONC BASE 72F (auto)",11:"ODF 600F Cabinet",12:"120F 4U Rack",
    13:"24F 1U Rack",14:"Install ODF 600F (auto)",15:"CONC BASE 600F (auto)",
    16:"Splitter 1:4",17:"Splitter 1:8",18:"Splitter 1:16",19:"Panel 8S",
    20:"Pole 1:8 L1",21:"Pole 1:8 L2",22:"Pole 1:16 L2",23:"RISER POLE (auto)",
    28:"ADSS 24C",29:"ADSS 48C",30:"ADSS 120C",31:"ADSS-M 12C",
    32:"ADSS-D 12C",33:"ADSS-D 24C",34:"ADSS-D 48C",35:"ADSS-D 120C",
    40:"Duct 12C",41:"Duct 24C",42:"Duct 48C",43:"Duct 120C",
    46:"Duct BJ 12C",47:"Duct BJ 24C",48:"Duct BJ 48C",49:"Duct BJ 120C",
    50:"Splice 12F",51:"Splice 24F",52:"Splice 48F",53:"Splice 120F",
    63:"Term 1C",64:"Term 2C",65:"Term 3C",66:"Term 4C",68:"Term 6C",
    74:"Term 12C",75:"Term 24C",76:"Term 48C",77:"Term 120C",
    79:"A8 Pole",80:'Flex RT 1/2"',81:'Flex RT 3/4"',82:'Flex RT 1"',
    83:'Flex 1/2"',84:'Flex 3/4"',85:'Flex 1"',86:'IMC 1/2"',87:'IMC 3/4"',88:'IMC 1"',
    89:'uPVC 1/2"',90:'uPVC 3/4"',91:'uPVC 1"',92:'PVC 1/2"',93:'PVC 3/4"',94:'PVC 1"',
    95:'HDPE 1/2"',96:'HDPE 3/4"',97:'HDPE 1"',98:'HDPE 2"',
    100:"Road Cut",101:"Break PB",102:'PB 4x4 Galv',103:'PB 6x6 Galv',
    104:'PB 10x10 Galv',105:'PB 12x12 Galv',106:'PB 4x4 Plastic',107:'PB 6x6 Plastic',
    108:'PB 10x10 Plastic',109:'PB 12x12 Plastic',110:"HH-01 CONC",
    112:"Flat 1C",113:"Flat 2C",114:"Round 1C",115:"Round 2C",
    116:"Armoured 1C",117:"Armoured 2C",118:"Duct Flat 1C",119:"Duct Flat 2C",
    120:"TB Outlet 1C",123:"Splice@House",124:"Splice Drop Wire",125:"Break Sewer",
    127:"Survey",128:"IGIS",129:"Test & Report",130:"Accessories",131:"Management",
    249:"ONU (จำนวนหลัง)",
  };
  // Output all rows 1-249, qty=0 if not set (template expects all rows)
  for (let r = 1; r <= 249; r++) {
    if (descMap[r]) {
      const qty = rowMap[r] || 0;
      tmplRows.push([r, descMap[r], qty > 0 ? qty : ""]);
    }
  }

  const ws2 = XLSX.utils.aoa_to_sheet(tmplRows);
  ws2["!cols"] = [{ wch: 6 }, { wch: 36 }, { wch: 14 }];
  // Highlight qty cells that have values
  XLSX.utils.book_append_sheet(wb, ws2, "Template-Qty");

  const fname = villageName ? `BOQ_${villageName}.xlsx` : "BOQ_Underground.xlsx";
  XLSX.writeFile(wb, fname);
}

// ── ADMIN MODAL ──
const ADMIN_PASS = "Noi029277577";
const PRICE_GROUPS = [
  { label:"Cabinet & ตู้", keys:["ODF 32F Wall","ODF 72F Wall","ODF 144F Wall","ODF 288F Wall","ODF 72F Ground","CONC BASE 72F","ODF 600F Cabinet","ODF 120F 4U Rack","ODF 24F 1U Rack","Install ODF 600F","CONC BASE 600F","Splitter 1:4","Splitter 1:8","Splitter 1:16","Panel 8S","Pole 1:8 L1","Pole 1:8 L2","Pole 1:16 L2","RISER POLE"] },
  { label:"Fiber Cable", keys:["ADSS 24C","ADSS 48C","ADSS 120C","ADSS-M 12C","ADSS-D 12C","ADSS-D 24C","ADSS-D 48C","ADSS-D 120C","Duct 12C","Duct 24C","Duct 48C","Duct 120C"] },
  { label:"ODP + Splice", keys:["Duct BJ 12C","Duct BJ 24C","Duct BJ 48C","Duct BJ 120C","Splice 12F","Splice 24F","Splice 48F","Splice 120F"] },
  { label:"Terminate", keys:["Term 1C","Term 2C","Term 3C","Term 4C","Term 6C","Term 12C","Term 24C","Term 48C","Term 120C"] },
  { label:"Civil Work", keys:['IMC 1"','uPVC 1"','HDPE 1"','HDPE 2"',"Road Cut","Break PB","PB 4x4 Galv","PB 6x6 Galv","PB 4x4 Plastic","PB 6x6 Plastic","PB 10x10 Galv","PB 12x12 Galv","HH-01 CONC"] },
  { label:"Last Mile", keys:["Flat 1C","Flat 2C","Armoured 1C","Armoured 2C","Round 1C","Round 2C","Duct Flat 1C","Duct Flat 2C","TB Outlet 1C","Splice@House","Splice Drop Wire","Break Sewer"] },
  { label:"Management", keys:["Survey","IGIS","Test & Report","Accessories Fee","Management Fee"] },
];

function AdminModal({ prices, setPrices, onClose }) {
  // ── Hooks ทั้งหมดต้องอยู่ก่อน return ──
  const [inp, setInp] = useState("");
  const [auth, setAuth] = useState(false);
  const [err, setErr] = useState(false);
  const [local, setLocal] = useState({...prices});
  const [saved, setSaved] = useState(false);

  const tryLogin = () => {
    if (inp === ADMIN_PASS) setAuth(true);
    else { setErr(true); setInp(""); }
  };
  const save = () => { setPrices({...local}); Object.assign(P, local); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  if (!auth) return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999 }}>
      <div style={{ background:"#fff",borderRadius:14,padding:"32px 28px",width:300,textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.2)",fontFamily:FONT }}>
        <div style={{ fontSize:24,marginBottom:8 }}>🔐</div>
        <div style={{ fontWeight:700,fontSize:16,color:C.text,marginBottom:4 }}>Admin เท่านั้น</div>
        <div style={{ fontSize:12,color:C.gray,marginBottom:20 }}>ใส่รหัสเพื่อแก้ไขราคา</div>
        <input type="password" value={inp} onChange={e=>{setInp(e.target.value);setErr(false)}}
          onKeyDown={e=>e.key==="Enter"&&tryLogin()} autoFocus placeholder="รหัสผ่าน"
          style={{ width:"100%",padding:"9px 12px",borderRadius:8,border:`2px solid ${err?"#e53935":C.border}`,fontSize:14,textAlign:"center",outline:"none",marginBottom:8,fontFamily:FONT }} />
        {err && <div style={{ color:"#e53935",fontSize:12,marginBottom:8 }}>รหัสไม่ถูกต้อง</div>}
        <div style={{ display:"flex",gap:8 }}>
          <button onClick={onClose} style={{ flex:1,padding:"9px",borderRadius:8,border:`1px solid ${C.border}`,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:FONT }}>ยกเลิก</button>
          <button onClick={tryLogin} style={{ flex:1,padding:"9px",borderRadius:8,border:"none",background:C.primary,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:FONT }}>เข้าสู่ระบบ</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:999,overflowY:"auto",padding:"20px 12px" }}>
      <div style={{ background:"#fff",borderRadius:14,width:"100%",maxWidth:600,boxShadow:"0 8px 32px rgba(0,0,0,0.25)",fontFamily:FONT }}>
        <div style={{ background:`linear-gradient(90deg,${C.headerBg},${C.headerLight})`,padding:"14px 18px",borderRadius:"14px 14px 0 0",display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ color:"#fff",fontWeight:700,fontSize:15,flex:1 }}>⚙ แก้ไขราคา — Admin Only</span>
          {saved && <span style={{ background:"#c8f7c5",color:C.primary,borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:600 }}>✓ บันทึกแล้ว</span>}
          <button onClick={save} style={{ background:"#fff",border:"none",borderRadius:7,color:C.primary,fontWeight:700,fontSize:13,padding:"6px 14px",cursor:"pointer",fontFamily:FONT }}>บันทึก</button>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.2)",border:"none",borderRadius:7,color:"#fff",fontSize:18,cursor:"pointer",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
        </div>
        <div style={{ padding:"14px 16px",display:"flex",flexDirection:"column",gap:14,maxHeight:"75vh",overflowY:"auto" }}>
          {PRICE_GROUPS.map(g => (
            <div key={g.label}>
              <div style={{ fontSize:11,fontWeight:700,color:C.accent,textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:6,paddingBottom:3,borderBottom:`1px solid ${C.border}` }}>{g.label}</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:5 }}>
                {g.keys.map(k => (
                  <div key={k} style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 8px",borderRadius:6,border:`1px solid ${C.border}`,background:"#fafcfa" }}>
                    <span style={{ fontSize:11,flex:1,color:C.text }}>{k}</span>
                    <span style={{ fontSize:11,color:C.gray }}>฿</span>
                    <input type="number" value={local[k]||""} onChange={e=>setLocal(p=>({...p,[k]:parseFloat(e.target.value)||0}))}
                      style={{ width:72,padding:"3px 5px",borderRadius:5,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"monospace",textAlign:"right",outline:"none" }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──
export default function App() {
  const [villageName, setVillageName] = useState("");
  const [homes, setHomes] = useState("0");
  const [showAdmin, setShowAdmin] = useState(false);
  const [prices, setPrices] = useState({...P});

  // Sec 1
  const [wallVals, setWallVals] = useState({});
  const [groundVals, setGroundVals] = useState({});
  const [cab600qtys, setCab600qtys] = useState({ "ODF 600F Cabinet": "0", "ODF 120F 4U Rack": "0", "ODF 24F 1U Rack": "0" });
  const [poleSels, setPoleSels] = useState({});
  const [splSels, setSplSels] = useState({});

  // Sec 2
  const [fiberVals, setFiberVals] = useState({});

  // Sec 3
  const [bjSels, setBjSels] = useState({});

  // Sec 4
  const [termSels, setTermSels] = useState({});

  // Sec 5
  const [civilVals, setCivilVals] = useState({});
  const sc = (k) => ({ value: civilVals[k] || "0", onChange: v => setCivilVals(p => ({ ...p, [k]: v })) });

  // Sec 6
  const [lmSels, setLmSels] = useState({});
  const [tbQty, setTbQty] = useState("");
  const [spliceHouseQty, setSpliceHouseQty] = useState("");
  const [spliceDrop, setSpliceDrop] = useState("0");
  const [breakSewer, setBreakSewer] = useState("0");

  // Sec 7
  const [survey, setSurvey] = useState("1");
  const [igis, setIgis] = useState("1");
  const [testReport, setTestReport] = useState("1");
  const [accQty, setAccQty] = useState("");
  const [mgmtQty, setMgmtQty] = useState("");

  // Summary top
  const [oltPON, setOltPON] = useState("0");
  const [odnVal, setOdnVal] = useState("0");
  const [onuPerHome, setOnuPerHome] = useState("550");
  const [onuBoxPerHome, setOnuBoxPerHome] = useState("1000");
  const [pipeNotes, setPipeNotes] = useState("0");

  const homesN = nv(homes);

  const sub = useMemo(() => {
    const s1_wall = Object.entries(wallVals).reduce((s, [k, q]) => s + nv(q) * (P[k] || 0), 0);
    const groundQ = nv(groundVals["ODF 72F Ground"]);
    const s1_ground = groundQ * (P["ODF 72F Ground"] + P["CONC BASE 72F"]);
    const c6q = nv(cab600qtys["ODF 600F Cabinet"]);
    const s1_600 = c6q * P["ODF 600F Cabinet"]
      + nv(cab600qtys["ODF 120F 4U Rack"]) * P["ODF 120F 4U Rack"]
      + nv(cab600qtys["ODF 24F 1U Rack"]) * P["ODF 24F 1U Rack"]
      + c6q * (P["Install ODF 600F"] + P["CONC BASE 600F"]);
    const totalPoles = Object.values(poleSels).reduce((s, q) => s + nv(q), 0);
    const s1_pole = Object.entries(poleSels).reduce((s, [k, q]) => s + nv(q) * (P[k] || 0), 0) + totalPoles * P["RISER POLE"];
    const s1_spl = Object.entries(splSels).reduce((s, [k, q]) => s + nv(q) * (P[k] || 0), 0);
    const s1 = s1_wall + s1_ground + s1_600 + s1_pole + s1_spl;

    const s2 = Object.entries(fiberVals).reduce((s, [k, q]) => s + nv(q) * (P[k] || 0), 0);
    const s3 = Object.entries(bjSels).reduce((s, [k, q]) => s + nv(q) * (P[k] || 0), 0);
    const s4 = Object.entries(termSels).reduce((s, [k, q]) => s + nv(q) * (P[k] || 0), 0);
    const s5 = Object.entries(civilVals).reduce((s, [k, q]) => s + nv(q) * (P[k] || 0), 0);

    const lmCable = Object.entries(lmSels).reduce((s, [k, q]) => s + nv(q) * (P[k] || 0), 0);
    const tbQtyN = tbQty !== "" ? nv(tbQty) : homesN;
    const spliceHouseQtyN = spliceHouseQty !== "" ? nv(spliceHouseQty) : homesN;
    const accQtyN = accQty !== "" ? nv(accQty) : homesN;
    const mgmtQtyN = mgmtQty !== "" ? nv(mgmtQty) : homesN;
    const s6 = lmCable
      + tbQtyN * P["TB Outlet 1C"]
      + spliceHouseQtyN * P["Splice@House"]
      + nv(spliceDrop) * P["Splice Drop Wire"]
      + nv(breakSewer) * P["Break Sewer"];

    const s7 = nv(survey) * P["Survey"] + nv(igis) * P["IGIS"] + nv(testReport) * P["Test & Report"]
      + accQtyN * P["Accessories Fee"] + mgmtQtyN * P["Management Fee"];

    const mainSPT = s1 + s2 + s3 + s4 + s5 + s7;
    const oltCost = nv(oltPON) * 7500;
    const odnCost = nv(odnVal);
    const oltOdn = oltCost + odnCost;
    const lmPerHome = homesN > 0 ? s6 / homesN : 0;
    const totalVillage = (oltOdn + mainSPT) + (lmPerHome + nv(onuPerHome) + nv(onuBoxPerHome)) * homesN;
    const costPerSub = homesN > 0 ? totalVillage / homesN : 0;

    return { s1, s2, s3, s4, s5, s6, s7, mainSPT, oltCost, odnCost, oltOdn, lmPerHome, totalVillage, costPerSub, totalPoles, c6q, groundQ };
  }, [wallVals, groundVals, cab600qtys, poleSels, splSels,
      fiberVals, bjSels, termSels, civilVals, lmSels,
      tbQty, spliceHouseQty, spliceDrop, breakSewer,
      survey, igis, testReport, accQty, mgmtQty,
      oltPON, odnVal, onuPerHome, onuBoxPerHome, homes]);

  const exportState = {
    villageName, homes, oltPON, odnVal, onuPerHome, onuBoxPerHome, pipeNotes, sub,
    wallVals, groundVals, cab600qtys, poleSels, splSels,
    fiberVals, bjSels, termSels, civilVals, lmSels,
    tbQty, spliceHouseQty, spliceDrop, breakSewer,
    survey, igis, testReport, accQty, mgmtQty,
  };

  // Summary cell component (inline for access to state)
  const SCell = ({ label, value, highlight, sub: subNote }) => (
    <div style={{
      background: highlight ? C.white : "rgba(255,255,255,0.18)",
      borderRadius: 10, padding: "9px 12px", flex: 1, minWidth: 100,
      border: `1px solid ${highlight ? C.accent : "rgba(255,255,255,0.35)"}`,
    }}>
      <div style={{ fontSize: 10, color: highlight ? C.textLight : "rgba(255,255,255,0.85)", fontFamily: FONT, marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "monospace", fontSize: highlight ? 18 : 15, fontWeight: 700, color: highlight ? C.primary : C.white }}>
        ฿{fmt(value)}
      </div>
      {subNote && <div style={{ fontSize: 10, color: highlight ? C.gray : "rgba(255,255,255,0.6)", marginTop: 1, fontFamily: FONT }}>{subNote}</div>}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Taviraj:wght@300;400;500;600;700&family=Sarabun:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:${FONT};background:${C.bg};color:${C.text}}
        input[type=number]:focus{border-color:${C.accent}!important;outline:none}
        input[type=number]{outline:none}
        button{font-family:${FONT}}
        @media(max-width:600px){.srow{flex-direction:column!important}}
      `}</style>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(90deg,${C.headerBg},${C.headerLight})`, color: C.white, padding: "11px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 10px rgba(46,125,50,0.25)" }}>
        <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>F</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: FONT }}>FTTH BOQ — Underground Village</div>
          <div style={{ fontSize: 10, color: "#c8f7c5", fontFamily: FONT }}>AIS Fibre · Price List V6.2</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => doExport(exportState)} style={{ background: C.white, border: "none", borderRadius: 8, color: C.primary, fontWeight: 700, fontSize: 13, padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 1px 6px rgba(0,0,0,0.15)", fontFamily: FONT }}>
            ⬇ Export Excel
          </button>
          <button onClick={() => setShowAdmin(true)} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 8, color: C.white, fontWeight: 600, fontSize: 12, padding: "7px 10px", cursor: "pointer", fontFamily: FONT }}>
            ⚙ ราคา
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "12px 12px 60px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* ── SUMMARY CARD ── */}
        <div style={{ background: C.summaryBg, borderRadius: 14, padding: "14px", boxShadow: "0 4px 16px rgba(46,125,50,0.3)" }}>

          {/* Village name + homes */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <input
              type="text" value={villageName} onChange={e => setVillageName(e.target.value)}
              placeholder="ชื่อหมู่บ้าน..."
              style={{ flex: 1, minWidth: 140, padding: "7px 10px", borderRadius: 8, border: "2px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.15)", color: C.white, fontSize: 14, fontWeight: 600, fontFamily: FONT, outline: "none" }}
            />
            <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 13, fontFamily: FONT }}>จำนวนหลัง</span>
            <input type="number" min="0" value={homes} onChange={e => setHomes(e.target.value)}
              style={{ width: 76, padding: "5px 8px", borderRadius: 8, border: "2px solid rgba(255,255,255,0.8)", fontSize: 20, fontWeight: 700, fontFamily: "monospace", textAlign: "center", color: C.primary, background: C.white, outline: "none" }} />
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: FONT }}>หลัง</span>

            {/* OLT + ODN */}
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
              {[["OLT (PON)", oltPON, setOltPON, `×7,500 = ฿${fmt(sub.oltCost)}`, 54],
                ["ODN (฿)", odnVal, setOdnVal, `฿${fmt(sub.odnCost)}`, 90]].map(([lbl, val, setter, note, w]) => (
                <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontFamily: FONT }}>{lbl}</span>
                  <input type="number" min="0" value={val} onChange={e => setter(e.target.value)}
                    style={{ width: w, padding: "4px 5px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.4)", background: "rgba(0,0,0,0.15)", color: C.white, fontFamily: "monospace", fontSize: 13, textAlign: "center", outline: "none" }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", fontFamily: "monospace" }}>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 1 */}
          <div className="srow" style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 7 }}>
            <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "9px 12px", flex: 1, minWidth: 90, border: "1px solid rgba(255,255,255,0.35)" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontFamily: FONT, marginBottom: 2 }}>จำนวนหลัง</div>
              <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: C.white }}>{homesN}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: FONT }}>หลัง</div>
            </div>
            <SCell label="Cost/Sub" value={sub.costPerSub} sub="บาท/หลัง" />
            <SCell label="Total Village Cost" value={sub.totalVillage} highlight sub="(OLT+ODN+SPT)+(LM+ONU+Box)×หลัง" />
            <SCell label="OLT+ODN" value={sub.oltOdn} />
            <SCell label="Main Fiber ถึง SPT2" value={sub.mainSPT} sub="ยกเว้น Lastmile" />
          </div>

          {/* Row 2 */}
          <div className="srow" style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 8 }}>
            <SCell label="LM/หลัง" value={sub.lmPerHome} sub="Lastmile ÷ หลัง" />
            {[["ติดตั้ง ONU/หลัง", onuPerHome, setOnuPerHome], ["ONU Box/หลัง", onuBoxPerHome, setOnuBoxPerHome]].map(([lbl, val, setter]) => (
              <div key={lbl} style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "9px 12px", flex: 1, border: "1px solid rgba(255,255,255,0.35)", minWidth: 100 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontFamily: FONT, marginBottom: 3 }}>{lbl}</div>
                <input type="number" value={val} onChange={e => setter(e.target.value)}
                  style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.6)", color: C.white, fontFamily: "monospace", fontSize: 15, fontWeight: 700, width: "100%", outline: "none" }} />
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: FONT, marginTop: 2 }}>บาท/หลัง</div>
              </div>
            ))}
            <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: 10, padding: "9px 12px", flex: 1, border: "1px solid rgba(255,255,255,0.15)", minWidth: 100 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: FONT, marginBottom: 3 }}>ค่าเดินท่อ (บันทึก)</div>
              <input type="number" value={pipeNotes} onChange={e => setPipeNotes(e.target.value)}
                style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", fontFamily: "monospace", fontSize: 15, fontWeight: 700, width: "100%", outline: "none" }} />
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: FONT, marginTop: 2 }}>ไม่นำมาคำนวน</div>
            </div>
          </div>

          {/* Mini breakdown */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 7, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[["Cabinet",sub.s1],["Fiber",sub.s2],["ODP",sub.s3],["Term",sub.s4],["Civil",sub.s5],["LastMile",sub.s6],["Mgmt",sub.s7]].map(([l,a])=>(
              <span key={l} style={{ fontSize: 11, fontFamily: "monospace", color: a > 0 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.3)" }}>
                <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: FONT }}>{l}: </span>{a > 0 ? `฿${fmt(a)}` : "—"}
              </span>
            ))}
          </div>
        </div>

        {/* ── SECTION 1 ── */}
        <Section num="1" title="Cabinet & อุปกรณ์หัว" total={sub.s1} defaultOpen={true}>
          <SubLabel>Wall Mount ODF (เลือกได้หลายแบบ)</SubLabel>
          <CheckGroup items={[
            { key: "ODF 32F Wall", label: "ODF 32F Outdoor Wall Mount (Max 5 Slot)" },
            { key: "ODF 72F Wall", label: "ODF 72F Outdoor Wall Mount (Max 10 Slot)" },
            { key: "ODF 144F Wall", label: "ODF 144F Outdoor Wall Mount (Max 20 Slot)" },
            { key: "ODF 288F Wall", label: "ODF 288F Outdoor Wall Mount (Max 40 Slot)" },
          ]} values={wallVals} setValues={setWallVals} />

          <SubLabel>On Ground ODF</SubLabel>
          <CheckGroup items={[{ key: "ODF 72F Ground", label: "ODF 72F Outdoor On Ground (Max 10 Slot)" }]}
            values={groundVals} setValues={setGroundVals} />
          {groundVals["ODF 72F Ground"] !== undefined && nv(groundVals["ODF 72F Ground"]) > 0 &&
            <AutoNote>CONC BASE รวมอัตโนมัติ {nv(groundVals["ODF 72F Ground"])} ชุด = ฿{fmt(nv(groundVals["ODF 72F Ground"]) * P["CONC BASE 72F"])}</AutoNote>}

          <SubLabel>ODF 600F Outdoor Cabinet for ISP</SubLabel>
          {[
            { key: "ODF 600F Cabinet", label: "ODF 600F Outdoor Cabinet for ISP", unit: "Rack" },
            { key: "ODF 120F 4U Rack", label: "ODF 120F 4U Rack Mount (เพิ่มเติม)", unit: "EA" },
            { key: "ODF 24F 1U Rack", label: "ODF 24F 1U Rack Mount (เพิ่มเติม)", unit: "EA" },
          ].map(({ key, label, unit }) => {
            const q = cab600qtys[key]; const tot = nv(q) * P[key];
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7, border: `1px solid ${C.border}`, background: "#fafcfa" }}>
                <span style={{ fontSize: 13, flex: 1, fontFamily: FONT }}>{label}</span>
                <Stepper value={q} onChange={v => setCab600qtys(p => ({ ...p, [key]: v }))} />
                <span style={{ fontSize: 11, color: C.gray, width: 28 }}>{unit}</span>
                {tot > 0 ? <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.primary, minWidth: 64, textAlign: "right" }}>฿{fmt(tot)}</span> : <span style={{ minWidth: 64 }} />}
              </div>
            );
          })}
          {sub.c6q > 0 && <AutoNote>Install + CONC BASE 600F รวมอัตโนมัติ {sub.c6q} ชุด = ฿{fmt(sub.c6q * (P["Install ODF 600F"] + P["CONC BASE 600F"]))}</AutoNote>}

          <SubLabel>Pole Mount Closure (+ RISER อัตโนมัติ)</SubLabel>
          <CheckGroup items={[
            { key: "Pole 1:8 L1", label: "Pole Mount 1:8 Level 1" },
            { key: "Pole 1:8 L2", label: "Pole Mount 1:8 Level 2" },
            { key: "Pole 1:16 L2", label: "Pole Mount 1:16 Level 2" },
          ]} values={poleSels} setValues={setPoleSels} />
          {sub.totalPoles > 0 && <AutoNote>RISER POLE {sub.totalPoles} ชุด = ฿{fmt(sub.totalPoles * P["RISER POLE"])}</AutoNote>}

          <SubLabel>Splitter / Panel ใน Cabinet</SubLabel>
          <CheckGroup items={[
            { key: "Splitter 1:4", label: "Splitter Modular 1:4" },
            { key: "Splitter 1:8", label: "Splitter Modular 1:8" },
            { key: "Splitter 1:16", label: "Splitter Modular 1:16" },
            { key: "Panel 8S", label: "Panel 8S with Adapter" },
          ]} values={splSels} setValues={setSplSels} />
        </Section>

        <Section num="2" title="Optical Fiber Cable" total={sub.s2} defaultOpen={true}>
          <SubLabel>Aerial ADSS</SubLabel>
          <CheckGroup items={[{ key:"ADSS 24C",label:"ADSS 24C"},{key:"ADSS 48C",label:"ADSS 48C"},{key:"ADSS 120C",label:"ADSS 120C"},{key:"ADSS-M 12C",label:"ADSS-M 12C"}]} values={fiberVals} setValues={setFiberVals} />
          <SubLabel>ADSS Install in Duct (FR-AD)</SubLabel>
          <CheckGroup items={[{key:"ADSS-D 12C",label:"ADSS-D 12C"},{key:"ADSS-D 24C",label:"ADSS-D 24C"},{key:"ADSS-D 48C",label:"ADSS-D 48C"},{key:"ADSS-D 120C",label:"ADSS-D 120C"}]} values={fiberVals} setValues={setFiberVals} />
          <SubLabel>Underground Duct Cable (SM-D)</SubLabel>
          <CheckGroup items={[{key:"Duct 12C",label:"SM-D Duct 12C"},{key:"Duct 24C",label:"SM-D Duct 24C"},{key:"Duct 48C",label:"SM-D Duct 48C"},{key:"Duct 120C",label:"SM-D Duct 120C"}]} values={fiberVals} setValues={setFiberVals} />
        </Section>

        <Section num="3" title="ODP ในบ่อพัก (Duct BJ + Splice)" total={sub.s3}>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 2, fontFamily: FONT }}>เลือก Core size — Duct BJ + Fusion Splice มาพร้อมกัน</div>
          <BjSpliceGroup bjSels={bjSels} setBjSels={setBjSels} />
        </Section>

        <Section num="4" title="Terminate Service" total={sub.s4}>
          <CheckGroup items={[
            {key:"Term 1C",label:"Terminate 1C"},{key:"Term 2C",label:"Terminate 2C"},{key:"Term 3C",label:"Terminate 3C"},
            {key:"Term 4C",label:"Terminate 4C"},{key:"Term 6C",label:"Terminate 6C"},{key:"Term 12C",label:"Terminate 12C"},
            {key:"Term 24C",label:"Terminate 24C"},{key:"Term 48C",label:"Terminate 48C"},{key:"Term 120C",label:"Terminate 120C"},
          ]} values={termSels} setValues={setTermSels} />
        </Section>

        <Section num="5" title="Civil Work — ท่อ / ถนน / Pull Box" total={sub.s5}>
          <SubLabel>รายการที่ใช้บ่อย</SubLabel>
          <QtyRow label='I.M.C. Conduit Ø 1"' unit="M" priceKey='IMC 1"' {...sc('IMC 1"')} />
          <QtyRow label='uPVC Conduit Ø 1"' unit="M" priceKey='uPVC 1"' {...sc('uPVC 1"')} />
          <QtyRow label='HDPE Conduit Ø 1"' unit="M" priceKey='HDPE 1"' {...sc('HDPE 1"')} />
          <QtyRow label="Open Cut Road Concrete & Repair (กรีดถนน)" unit="M" priceKey="Road Cut" {...sc("Road Cut")} />
          <QtyRow label='Pull Box 4"×4"×4" Galvanized' unit="EA" priceKey="PB 4x4 Galv" {...sc("PB 4x4 Galv")} />
          <QtyRow label='Pull Box 6"×6"×4" Galvanized' unit="EA" priceKey="PB 6x6 Galv" {...sc("PB 6x6 Galv")} />
          <QtyRow label='Pull Box 4"×4"×4" Plastic' unit="EA" priceKey="PB 4x4 Plastic" {...sc("PB 4x4 Plastic")} />
          <Collapsible label="รายการเพิ่มเติม">
            <QtyRow label="A8 Concrete Pole" unit="EA" priceKey="A8 Pole" {...sc("A8 Pole")} />
            {[['Flex RT 1/2"','m'],['Flex RT 3/4"','m'],['Flex RT 1"','m'],['Flex 1/2"','m'],['Flex 3/4"','m'],['Flex 1"','m']].map(([k,u])=><QtyRow key={k} label={k} unit={u} priceKey={k} {...sc(k)} />)}
            {[['IMC 1/2"','M'],['IMC 3/4"','M'],['uPVC 1/2"','M'],['uPVC 3/4"','M'],['PVC 1/2"','M'],['PVC 3/4"','M'],['PVC 1"','M'],['HDPE 1/2"','M'],['HDPE 3/4"','M'],['HDPE 2"','M']].map(([k,u])=><QtyRow key={k} label={k} unit={u} priceKey={k} {...sc(k)} />)}
            {[["PB 10x10 Galv",'PB 10"×10"×6" Galv',"EA"],["PB 12x12 Galv",'PB 12"×12"×6" Galv',"EA"],["PB 6x6 Plastic",'PB 6"×6"×4" Plastic',"EA"],["PB 10x10 Plastic",'PB 10"×10"×6" Plastic',"EA"],["PB 12x12 Plastic",'PB 12"×12"×6" Plastic',"EA"]].map(([k,l,u])=><QtyRow key={k} label={l} unit={u} priceKey={k} {...sc(k)} />)}
            <QtyRow label="BREAK THROUGH PB." unit="EA" priceKey="Break PB" {...sc("Break PB")} />
            <QtyRow label="HH-01 CONC (Handhole)" unit="EA" priceKey="HH-01 CONC" {...sc("HH-01 CONC")} />
          </Collapsible>
        </Section>

        <Section num="6" title="Last Mile Fiber" total={sub.s6}>
          <SubLabel>Drop Wire ที่ใช้บ่อย</SubLabel>
          <CheckGroup items={[
            {key:"Flat 1C",label:"Flat Type 1C"},{key:"Flat 2C",label:"Flat Type 2C"},
            {key:"Armoured 1C",label:"Armoured Round 1C"},{key:"Armoured 2C",label:"Armoured Round 2C"},
          ]} values={lmSels} setValues={setLmSels} />
          <Collapsible label="Drop Wire ประเภทอื่น">
            <CheckGroup items={[{key:"Round 1C",label:"Round Type 1C"},{key:"Round 2C",label:"Round Type 2C"},{key:"Duct Flat 1C",label:"Duct Flat 1C"},{key:"Duct Flat 2C",label:"Duct Flat 2C"}]} values={lmSels} setValues={setLmSels} />
          </Collapsible>
          <SubLabel>ค่าติดตั้ง per หลัง (auto × จำนวนหลัง)</SubLabel>
          <PerHomeRow label="Terminal Box Outlet 1C (SC/APC + Pigtail)" priceKey="TB Outlet 1C" homesN={homesN} qtyOverride={tbQty} setQtyOverride={setTbQty} />
          <PerHomeRow label="Fusion Splice Terminate @House (SC/APC Pigtail)" priceKey="Splice@House" homesN={homesN} qtyOverride={spliceHouseQty} setQtyOverride={setSpliceHouseQty} />
          <SubLabel>รายการพิเศษ (บางหมู่บ้าน)</SubLabel>
          <QtyRow label="Splice Core Fiber Drop Wire" unit="Core" priceKey="Splice Drop Wire" value={spliceDrop} onChange={setSpliceDrop} />
          <QtyRow label="Break Sewer to Post Box" unit="Set" priceKey="Break Sewer" value={breakSewer} onChange={setBreakSewer} />
        </Section>

        <Section num="7" title="Management Fee" total={sub.s7}>
          <SubLabel>ค่าบริหารโครงการ</SubLabel>
          <QtyRow label="Survey & Drawings" unit="L.S." priceKey="Survey" value={survey} onChange={setSurvey} />
          <QtyRow label="IGIS" unit="L.S." priceKey="IGIS" value={igis} onChange={setIgis} />
          <QtyRow label="Test & Document Report" unit="L.S." priceKey="Test & Report" value={testReport} onChange={setTestReport} />
          <SubLabel>ค่าดำเนินการ per หลัง (auto × จำนวนหลัง)</SubLabel>
          <PerHomeRow label="Accessories" priceKey="Accessories Fee" homesN={homesN} qtyOverride={accQty} setQtyOverride={setAccQty} />
          <PerHomeRow label="Management" priceKey="Management Fee" homesN={homesN} qtyOverride={mgmtQty} setQtyOverride={setMgmtQty} />
        </Section>

      </div>
      {showAdmin && <AdminModal prices={prices} setPrices={setPrices} onClose={() => setShowAdmin(false)} />}
    </>
  );
}
