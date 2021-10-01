import React, { useRef, useState, Suspense, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/three';

import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, DepthOfField, Noise, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"

import './App.css';


function Box() {
  const [active, setActive] = useState(false)
  const [yPos, setYPos] = useState(0)
  const [yRot, setYRot] = useState(0)

  const { color, pos, rot } = useSpring({
    color: active ? 'hotpink' : 'white',
    pos: [0, yPos-5, 0],
    rot: [0, yRot, 0]
  })

  const setPointing = (pointing) => {
    if (pointing) {
      document.body.classList.add("pointing")
    } else {
      document.body.classList.remove("pointing")
    }
  }

  const onScroll = (evt) => {
    setYPos(yPos => Math.max(yPos + evt.deltaY*0.001, 0))
    setYRot(yRot => Math.min(yRot - evt.deltaY*0.001, 0))
  }

  useEffect(() => {
    window.addEventListener("wheel", onScroll)

    return () => {
      window.removeEventListener("wheel", onScroll)
    }
  }, [])
  
  return (
    <animated.mesh 
      position={pos}
      rotation={rot}
      onClick={() => setActive(!active)}
      onPointerEnter={e => setPointing(true)}
      onPointerOut={e => setPointing(false)}
    >
      <boxBufferGeometry args={[1, 10, 1]} attach="geometry" />
      <animated.meshPhongMaterial color={color} attach="material" />
    </animated.mesh>
  )
}


function Scene() {

  return (
    <>
      <ambientLight intensity={0.7}/>
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} />
      <Box/>
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