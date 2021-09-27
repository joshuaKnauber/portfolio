import React, {useRef} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing"
import './Tesla.css';


function Scene() {
  
  const box = useRef()

  useFrame(() => {
    box.current.rotation.y += 0.005
  })

  return (
    <>
      <ambientLight intensity={0.4}/>
      <spotLight position={[10, 15, 10]} angle={0.3}/>
      <Box position={[0, 0, 0]} ref={box}>
        <meshStandardMaterial attach="material" color="red" />
      </Box>
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
        <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} height={300} opacity={3} />
        <Noise opacity={0.025} />
        {/* <ChromaticAberration offset={[0.001,0.001]}/> */}
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
      <color attach="background" color={"#1C1C1C"}/>
    </Canvas>
  );
}
