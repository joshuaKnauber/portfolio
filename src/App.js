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

  const moveElements = (yAmount) => {
    console.log(yAmount)
    if (ORBIT) return
    const maxPos = 48.5
    const minRocketRot = -12
    const minPlaneRot = -50 // this is 100% wrong
    setYPos(yPos => Math.min(maxPos, Math.max(yPos + yAmount*0.002, 0)))
    setRocketRot(rocketRot => Math.max(minRocketRot, Math.min(rocketRot - yAmount*0.0005, 0)))
    setPlaneRot(planeRot => Math.max(minPlaneRot, Math.min(planeRot - yAmount*0.002, 0)))
  } 
  // useEffect(() => {console.log(rocketRot)},[rocketRot])

  // scroll desktop
  const onScroll = (evt) => moveElements(evt.deltaY)

  // scroll mobile
  let pointerStartY = useRef(NaN)
  const onPointerDown = (evt) => pointerStartY = evt.pageY
  const onPointerUp = () => pointerStartY = NaN
  const onPointerMove = (evt) => {
    if (!isNaN(pointerStartY)) {
      moveElements(pointerStartY - evt.pageY)
      pointerStartY = evt.pageY
    }
  }

  useEffect(() => {
    document.body.addEventListener("wheel", onScroll)
    document.body.addEventListener("pointerdown", onPointerDown)
    document.body.addEventListener("pointerup", onPointerUp)
    document.body.addEventListener("pointermove", onPointerMove)

    return () => {
      document.body.removeEventListener("wheel", onScroll)
      document.body.removeEventListener("pointerdown", onPointerDown)
      document.body.removeEventListener("pointerup", onPointerUp)
      document.body.removeEventListener("pointermove", onPointerMove)
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
  const { camera } = useThree()

  const onResize = () => {
    if (window.innerWidth < 500) {
      camera.position.z = 8
    }
    else if (window.innerWidth < 700) {
      camera.position.z = 6
    }
    else if (window.innerWidth < 1000) {
      camera.position.z = 5
    }
    else if (window.innerWidth >= 1000) {
      camera.position.z = 5
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onResize)
    onResize()

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

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

  const shakeConfig = {
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
        <CameraShake {...shakeConfig} />
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