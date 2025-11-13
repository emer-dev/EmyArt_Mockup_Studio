import React, { forwardRef, useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Shirt({ url, color, design }){
  const { scene } = useGLTF(url)
  useEffect(()=>{
    scene.traverse((child)=>{
      if(child.isMesh){
        child.castShadow = true
        child.receiveShadow = true
        child.material = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), metalness:0.05, roughness:0.6 })
        if(design){
          // apply texture as map (basic approach; for precise placement use Decal)
          const loader = new THREE.TextureLoader()
          loader.load(design, (tex)=>{
            tex.encoding = THREE.sRGBEncoding
            tex.flipY = false
            child.material.map = tex
            child.material.needsUpdate = true
          })
        }
      }
    })
  }, [scene, color, design])
  return <primitive object={scene} dispose={null} />
}

function Scene({ modelPath, color, design }){
  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight position={[5,10,5]} angle={0.3} penumbra={0.6} intensity={1} castShadow />
      <Suspense fallback={null}>
        <Shirt url={`/${modelPath}`} color={color} design={design} />
      </Suspense>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.02,0]} receiveShadow>
        <planeGeometry args={[10,10]} />
        <meshStandardMaterial opacity={0.0} transparent />
      </mesh>
      <OrbitControls />
    </>
  )
}

const Viewer = forwardRef(({ modelPath, color, design }, ref)=>{
  const canvasRef = useRef()
  useEffect(()=>{}, [modelPath])
  React.useImperativeHandle(ref, ()=>({ exportPNG: async (width=2000, height=2000) => {
    const gl = canvasRef.current && canvasRef.current.gl
    if(!gl) return null
    const old = gl.getSize()
    gl.setSize(width, height)
    gl.render()
    const dataURL = gl.domElement.toDataURL('image/png')
    gl.setSize(old.width, old.height)
    return dataURL
  }}))
  return (
    <div style={{width:'100%', height:'720px'}}>
      <Canvas shadows dpr={[1,2]} camera={{position:[0,1.2,2.5], fov:35}} ref={canvasRef}>
        <Scene modelPath={modelPath} color={color} design={design} />
      </Canvas>
    </div>
  )
})

export default Viewer
