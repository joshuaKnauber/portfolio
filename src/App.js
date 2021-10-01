import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { OrbitControls, CameraShake, Line, Text, MeshWobbleMaterial, MeshDistortMaterial, Sky } from '@react-three/drei';
import { EffectComposer, DepthOfField, Noise, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"

import { useGLTF, useTexture } from '@react-three/drei'

import StageOne from './models/rocket.gltf';

import StageOneColor from './models/stage-one-color.png';
import StageOneMetalness from './models/stage-one-metalness.png';
import StageOneRoughness from './models/stage-one-roughness.png';
import StageOneAO from './models/stage-one-ao.png';
import StageOneNormal from './models/stage-one-normal.png';

import Emit from './models/emit.png';

import './App.css';


const ORBIT = false


function Plane({x=0, y=0, z=0, rot=0}) {
  const emit = useTexture(Emit)
  return (
    <group>
      <mesh position={[x, y, z]} rotation={[0, rot, 0]}>
        <planeBufferGeometry args={[4, 2.5]} attach="geometry" />
        <meshStandardMaterial attach="material"
          factor={0.01} speed={5}
          side={THREE.DoubleSide}
          transparent={true}
          map={emit}
          emissiveMap={emit}
          emissive={"white"}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  )
}


function Rocket() {
  const { nodes } = useGLTF(StageOne)
  const color = useTexture(StageOneColor)
  const metalness = useTexture(StageOneMetalness)
  const roughness = useTexture(StageOneRoughness)
  const ao = useTexture(StageOneAO)
  const normal = useTexture(StageOneNormal)
  return (
    <mesh geometry={nodes.stage.geometry} rotation={[0, 1, 0]}>
      <meshStandardMaterial
        map={color}
        metalnessMap={metalness} 
        roughnessMap={roughness} 
        normalMap={normal} 
        aoMap={ao}
        map-flipY={false} />
    </mesh>
  )
}


function Geometry() {
  const [yPos, setYPos] = useState(0)
  const [rocketRot, setRocketRot] = useState(0)
  const [planeRot, setPlaneRot] = useState(0)

  const { yPosAnimated, rocketRotAnimated, planeRotAnimated } = useSpring({
    yPosAnimated: [0, yPos-50, 0],
    rocketRotAnimated: [0, rocketRot, 0],
    planeRotAnimated: [0, planeRot, 0],
  })

  const onScroll = (evt) => {
    if (ORBIT) return
    const maxPos = 48.5
    const minRocketRot = -12
    const minPlaneRot = -50 // this is 100% wrong
    setYPos(yPos => Math.min(maxPos, Math.max(yPos + evt.deltaY*0.002, 0)))
    setRocketRot(rocketRot => Math.max(minRocketRot, Math.min(rocketRot - evt.deltaY*0.0005, 0)))
    setPlaneRot(planeRot => Math.max(minPlaneRot, Math.min(planeRot - evt.deltaY*0.002, 0)))
  }

  // useEffect(() => {console.log(rocketRot)},[rocketRot])

  useEffect(() => {
    window.addEventListener("wheel", onScroll)

    return () => {
      window.removeEventListener("wheel", onScroll)
    }
  }, [])
  
  return (
    <group>

      <animated.group position={yPosAnimated} rotation={rocketRotAnimated}>
        <Suspense fallback={null}>
          <Rocket />
        </Suspense>
      </animated.group>

      <animated.group position={yPosAnimated} rotation={planeRotAnimated}>
      <Suspense fallback={null}>
          <Plane x={0} y={37.5} z={2.5} rot={0}/>
        </Suspense>
      </animated.group>
      

    </group>
  )
}


function Scene() {

  return (
    <>
      <ambientLight intensity={0.7}/>
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} />
      <Geometry />
    </>
  )
}


export default function App() {

  const config = {
    maxYaw: 0.008, // Max amount camera can yaw in either direction
    maxPitch: 0.008, // Max amount camera can pitch in either direction
    maxRoll: 0.008, // Max amount camera can roll in either direction
    yawFrequency: 0.5, // Frequency of the the yaw rotation
    pitchFrequency: 0.5, // Frequency of the pitch rotation
    rollFrequency: 0.5, // Frequency of the roll rotation
    intensity: 1, // initial intensity of the shake
    decay: false, // should the intensity decay over time
  }

  return (
    <div className="App">
      <Canvas colorManagement shadowMap camera={{position:[0, 0, 5]}}>
        {ORBIT && <OrbitControls/>}
        <Scene/>
        {/* <CameraShake {...config} /> */}
        <EffectComposer>
          {/* <DepthOfField focusDistance={0} focalLength={0.03} bokehScale={2} height={480} /> */}
          {/* <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.5} height={500} opacity={1.5} /> */}
          {/* <ChromaticAberration offset={[0.0005,0.0]}/> */}
          {/* <Vignette eskil={false} offset={0.2} darkness={0.8} /> */}
        </EffectComposer>
      </Canvas>
    </div>
  );
}