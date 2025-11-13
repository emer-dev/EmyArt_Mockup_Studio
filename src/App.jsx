import React, { useRef, useState, useEffect } from 'react'
import Viewer from './components/Viewer'
import Controls from './components/Controls'
import DecalEditor from './components/DecalEditor'

export default function App(){
  const [color, setColor] = useState('#ffffff')
  const [model, setModel] = useState('models/adult_shirt.glb')
  const [design, setDesign] = useState(null)
  const [decalParams, setDecalParams] = useState({ position:[0,0.9,0.05], rotation:[0,0,0], scale:[0.5,0.5,0.5] })
  const viewerRef = useRef()

  const [licenseInput, setLicenseInput] = useState(localStorage.getItem('emyart_license') || '')
  const [validated, setValidated] = useState(false)
  const [validInfo, setValidInfo] = useState(null)
  const [checking, setChecking] = useState(false)

  useEffect(()=>{
    const stored = localStorage.getItem('emyart_license')
    if(stored) validateLicense(stored)
    // eslint-disable-next-line
  },[])

  async function validateLicense(key){
    setChecking(true)
    try {
      const res = await fetch('/api/validate-license', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ license: key })
      })
      const j = await res.json()
      setChecking(false)
      if(j.valid){
        localStorage.setItem('emyart_license', key)
        setValidated(true)
        setValidInfo(j.entry || null)
      } else {
        setValidated(false)
        setValidInfo(j.entry || null)
      }
    } catch(e){
      setChecking(false)
      alert('Error validando licencia. ¿El servidor está corriendo?')
    }
  }

  function handleLogout(){
    localStorage.removeItem('emyart_license')
    setLicenseInput('')
    setValidated(false)
    setValidInfo(null)
  }

  if(!validated){
    return (
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#1e1e1e'}}>
        <div style={{width:460, padding:26, background:'#111', borderRadius:12, boxShadow:'0 8px 30px rgba(0,0,0,0.5)', color:'#fff'}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <img src="/logo.svg" alt="logo" style={{width:56,height:56}} />
            <div>
              <h1 style={{margin:0, fontSize:20}}>Emy’Art Mockup Studio</h1>
              <div style={{fontSize:13, color:'#f8c8de'}}>by Emerlys Medina</div>
            </div>
          </div>
          <p style={{color:'#ddd', marginTop:14}}>Introduce tu código de licencia para activar la aplicación.</p>
          <input
            value={licenseInput}
            onChange={(e)=>setLicenseInput(e.target.value)}
            placeholder="Código de licencia"
            style={{width:'100%', padding:10, marginTop:8, borderRadius:6, border:'1px solid #333', background:'#0f0f0f', color:'#fff'}}
          />
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button onClick={()=>validateLicense(licenseInput)} style={{flex:1, padding:10, background:'#f8c8de', color:'#111', borderRadius:6}}>Validar licencia</button>
            <button onClick={()=>{ setLicenseInput(''); localStorage.removeItem('emyart_license'); }} style={{padding:10, borderRadius:6, background:'#333', color:'#fff'}}>Limpiar</button>
          </div>
          <div style={{marginTop:12, fontSize:13, color:'#bbb'}}>
            {checking && <div>Validando...</div>}
            {!checking && licenseInput && !validated && <div style={{color:'#ff7aa2'}}>Licencia inválida o revocada.</div>}
            <div style={{marginTop:8}}>Si aún no tienes licencia, contacta a la administradora.</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-root">
      <header className="topbar">
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <img src="/logo.svg" alt="logo" style={{width:32,height:32}} />
          <div>Emy’Art Mockup Studio</div>
        </div>
      </header>
      <div className="content">
        <div className="viewer-panel">
          <Viewer ref={viewerRef} modelPath={model} color={color} design={design} decalParams={decalParams} />
        </div>
        <div className="side-panel">
          <Controls
            color={color}
            setColor={setColor}
            model={model}
            setModel={setModel}
            onUploadDesign={(file)=>{ const url = URL.createObjectURL(file); setDesign(url) }}
            onExportPNG={async ()=>{ const dataURL = await viewerRef.current.exportPNG(2000,2000); const a = document.createElement('a'); a.href = dataURL; a.download='mockup.png'; a.click(); }}
          />
          <DecalEditor decalParams={decalParams} setDecalParams={setDecalParams} />
          <div style={{marginTop:12, color:'#ddd'}}>
            <div style={{fontSize:13}}>Usuario: {validInfo?.owner || 'Propietaria'}</div>
            <button onClick={handleLogout} style={{marginTop:8, padding:8, background:'#222', color:'#fff', borderRadius:6}}>Cerrar sesión</button>
            <div style={{marginTop:12, fontSize:11, color:'#aaa'}}>© 2025 Emy’Art Mockup Studio – Creado por Emerlys Medina</div>
          </div>
        </div>
      </div>
    </div>
  )
}
