import React, {useRef, useState} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Line } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing"
import './Tesla.css';


function Scene() {
  
  const box = useRef()
  const line = useRef()

  let [points, setPoints] = useState([[0,0,0]])

  useFrame(() => {
    // box.current.rotation.x += 0.01
    // box.current.rotation.y += 0.01
    // box.current.rotation.z += 0.01
    const p = points[points.length-1]
    let newPoints = [...points, [p[0]+(Math.random()-0.5), p[1]+(Math.random()-0.5), p[1]+(Math.random()-0.5)]]
    if (newPoints.length > 100) {
      newPoints = newPoints.splice(1)
    }
    setPoints(newPoints)
  })

  return (
    <>
      <ambientLight intensity={0.4}/>
      <spotLight position={[10, 15, 10]} angle={0.3}/>
      {/* <Box position={[0, 0, 0]} ref={box}>
        <meshStandardMaterial attach="material" color="red" />
      </Box> */}
      <Line points={points} color="#D5F0ED">
      </Line>
    </>
  )
}


export default function Configurator() {
  return (
    <Canvas shadows colorManagement camera={{fov: 75, position: [0, 1, 5]}}>
      <OrbitControls />
      <Scene/>
      <EffectComposer>
        {/* <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} /> */}
        <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} height={300} opacity={3} />
        {/* <Noise opacity={0.025} /> */}
        {/* <ChromaticAberration offset={[0.001,0.001]}/> */}
        {/* <Vignette eskil={false} offset={0.25} darkness={0.75} /> */}
      </EffectComposer>
    </Canvas>
  );
}