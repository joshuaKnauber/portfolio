import React, { useRef, useState, Suspense, useEffect } from 'react';

import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Box, Line } from '@react-three/drei';
import { EffectComposer, DepthOfField, Noise, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import './Tesla.css';
import gltfModel from './cybertruck.gltf';


function Model() {
  const result = useLoader(GLTFLoader, gltfModel)
  return <primitive object={result.scene} />
}


function Scene() {
  
  const box = useRef()

  useFrame(() => {
    // box.current.rotation.x += 0.01
    // box.current.rotation.y += 0.01
    // box.current.rotation.z += 0.01
  })

  return (
    <>
      <ambientLight intensity={0.7}/>
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
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
        {/* <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.4} height={400} opacity={2} /> */}
        <ChromaticAberration offset={[0.001,0.0]}/>
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}