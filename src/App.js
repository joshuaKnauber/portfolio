import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useSpring, animated } from '@react-spring/three';

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, DepthOfField, Noise, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import RocketGLTF from './models/rocket.gltf';

import './App.css';


function Plane({x=0, y=0, z=0, rot=0}) {
  return (
    <mesh position={[x, y, z]} rotation={[0, rot, 0]}>
      <planeBufferGeometry args={[4, 2.5]} attach="geometry" />
      <animated.meshPhongMaterial color={"red"} attach="material"  side={THREE.DoubleSide} />
    </mesh>
  )
}


function Rocket() {
  const { nodes } = useLoader(GLTFLoader, RocketGLTF)
  return (
    <mesh geometry={nodes["stage"].geometry}>
      <meshPhongMaterial attach="material" color="white" />
    </mesh>
  )

  return (
    <mesh>
      <boxBufferGeometry args={[1, 10, 1]} attach="geometry" />
      <animated.meshPhongMaterial color={"blue"} attach="material" />
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
    setYPos(yPos => Math.max(yPos + evt.deltaY*0.002, 0))
    setRocketRot(rocketRot => Math.min(rocketRot - evt.deltaY*0.001, 0))
    setPlaneRot(planeRot => Math.min(planeRot - evt.deltaY*0.002, 0))
  }

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
        <Plane x={0} y={37.5} z={2.5} rot={0}/>
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

  return (
    <div className="App">
      <Canvas colorManagement shadowMap camera={{position:[0, 0, 5]}}>
        {/* <OrbitControls/> */}
        <Scene/>
        <EffectComposer>
          {/* <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} /> */}
          {/* <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.4} height={400} opacity={2} /> */}
          {/* <ChromaticAberration offset={[0.001,0.0]}/> */}
          {/* <Vignette eskil={false} offset={0.25} darkness={0.75} /> */}
        </EffectComposer>
      </Canvas>
    </div>
  );
}