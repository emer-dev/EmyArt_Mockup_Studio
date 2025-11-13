import React from 'react'

export default function Controls({ color, setColor, model, setModel, onUploadDesign, onExportPNG }){
  return (
    <div className="controls">
      <div>
        <label style={{fontSize:13}}>Subir diseño</label>
        <input type="file" accept="image/*" onChange={(e)=>{ if(e.target.files && e.target.files[0]) onUploadDesign(e.target.files[0]) }} />
      </div>
      <div style={{marginTop:10}}>
        <label style={{fontSize:13}}>Color prenda</label>
        <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} />
      </div>
      <div style={{marginTop:10}}>
        <label style={{fontSize:13}}>Modelo</label>
        <select value={model} onChange={(e)=>setModel(e.target.value)}>
          <option value="models/adult_shirt.glb">Adult Shirt (Flotante)</option>
          <option value="models/adult_folded.glb">Adult Shirt (Doblada)</option>
          <option value="models/kids_shirt.glb">Kids Shirt (Flotante)</option>
          <option value="models/kids_folded.glb">Kids Shirt (Doblada)</option>
          <option value="models/polo.glb">Polo</option>
        </select>
      </div>
      <div style={{marginTop:10}}>
        <button onClick={onExportPNG} style={{padding:10, background:'#f8c8de', borderRadius:6}}>Exportar PNG</button>
      </div>
    </div>
  )
}
