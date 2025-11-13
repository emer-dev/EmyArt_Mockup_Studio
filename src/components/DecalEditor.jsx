import React, { useState, useEffect } from 'react'

export default function DecalEditor({ decalParams, setDecalParams }){
  const [local, setLocal] = useState(decalParams)
  useEffect(()=> setLocal(decalParams), [decalParams])
  function updatePath(key, idx, value){
    const np = {...local}
    np[key] = [...(np[key]||[])]
    np[key][idx] = parseFloat(value)
    setLocal(np)
    setDecalParams(np)
  }
  return (
    <div className="decal-editor" style={{color:'#fff'}}>
      <h3 style={{marginTop:0}}>Decal Editor</h3>
      <div>
        <label style={{fontSize:13}}>Pos Y</label>
        <input type="range" min="0" max="1.6" step="0.01" value={local.position[1] || 0.9} onChange={(e)=>updatePath('position',1,e.target.value)} />
      </div>
      <div style={{marginTop:8}}>
        <label style={{fontSize:13}}>Escala</label>
        <input type="range" min="0.05" max="1.5" step="0.01" value={local.scale[0] || 0.5} onChange={(e)=>updatePath('scale',0,e.target.value)} />
      </div>
      <div style={{marginTop:8}}>
        <button onClick={()=>{ setDecalParams({ position:[0,0.9,0.05], rotation:[0,0,0], scale:[0.5,0.5,0.5] }) }} style={{padding:8, borderRadius:6}}>Center Chest</button>
      </div>
    </div>
  )
}
