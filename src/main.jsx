import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const PASS = "FTTHBBODN"  // ← เปลี่ยนรหัสตรงนี้

function Gate() {
  const [ok, setOk] = React.useState(
    sessionStorage.getItem("ftth_auth") === PASS
  )
  const [inp, setInp] = React.useState("")
  const [err, setErr] = React.useState(false)

  const tryLogin = () => {
    if (inp === PASS) {
      sessionStorage.setItem("ftth_auth", PASS)
      setOk(true)
    } else {
      setErr(true)
      setInp("")
    }
  }

  if (ok) return <App />

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#d0f8ce", fontFamily: "'Taviraj','Sarabun',sans-serif"
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "40px 36px",
        boxShadow: "0 4px 24px rgba(46,125,50,0.15)",
        textAlign: "center", width: 320
      }}>
        <div style={{
          background: "#2e7d32", borderRadius: 10,
          width: 52, height: 52, margin: "0 auto 16px",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 22,
          fontWeight: 800, color: "#fff"
        }}>F</div>

        <div style={{ fontWeight: 700, fontSize: 19, color: "#1b5e20", marginBottom: 4 }}>
          FTTH BOQ Tool
        </div>
        <div style={{ fontSize: 13, color: "#388e3c", marginBottom: 28 }}>
          AIS Fibre · Underground Village
        </div>

        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={inp}
          onChange={e => { setInp(e.target.value); setErr(false) }}
          onKeyDown={e => e.key === "Enter" && tryLogin()}
          autoFocus
          style={{
            width: "100%", padding: "11px 14px",
            borderRadius: 8, fontSize: 15, textAlign: "center",
            border: `2px solid ${err ? "#e53935" : "#a5d6a7"}`,
            outline: "none", marginBottom: err ? 8 : 16,
            fontFamily: "'Taviraj','Sarabun',sans-serif"
          }}
        />
        {err && (
          <div style={{ color: "#e53935", fontSize: 12, marginBottom: 12 }}>
            รหัสผ่านไม่ถูกต้อง ลองใหม่อีกครั้ง
          </div>
        )}
        <button onClick={tryLogin} style={{
          width: "100%", padding: "11px",
          borderRadius: 8, border: "none",
          background: "#2e7d32", color: "#fff",
          fontWeight: 700, fontSize: 15, cursor: "pointer",
          fontFamily: "'Taviraj','Sarabun',sans-serif"
        }}>
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Gate />)