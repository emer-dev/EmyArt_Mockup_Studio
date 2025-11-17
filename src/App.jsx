import React, { useRef, useState } from 'react'
import Viewer from './components/Viewer'
import Controls from './components/Controls'
import DecalEditor from './components/DecalEditor'

export default function App() {
  const [color, setColor] = useState('#ffffff')
  const [model, setModel] = useState('models/adult_shirt.glb')
  const [design, setDesign] = useState(null)
  const [decalParams, setDecalParams] = useState({
    position: [0, 0.9, 0.05],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5]
  })

  const viewerRef = useRef()

  return (
    <div className="app-root">
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.svg" alt="logo" style={{ width: 32, height: 32 }} />
          <div>Emy’Art Mockup Studio</div>
        </div>
      </header>

      <div className="content">
        <div className="viewer-panel">
          <Viewer
            ref={viewerRef}
            modelPath={model}
            color={color}
            design={design}
            decalParams={decalParams}
          />
        </div>

        <div className="side-panel">
          <Controls
            color={color}
            setColor={setColor}
            model={model}
            setModel={setModel}
            onUploadDesign={(file) => {
              const url = URL.createObjectURL(file)
              setDesign(url)
            }}
            onExportPNG={async () => {
              const dataURL = await viewerRef.current.exportPNG(2000, 2000)
              const a = document.createElement('a')
              a.href = dataURL
              a.download = 'mockup.png'
              a.click()
            }}
          />

          <DecalEditor decalParams={decalParams} setDecalParams={setDecalParams} />

          <div style={{ marginTop: 12, fontSize: 11, color: '#aaa' }}>
            © 2025 Emy’Art Mockup Studio – Creado por Emerlys Medina
          </div>
        </div>
      </div>
    </div>
  )
}
