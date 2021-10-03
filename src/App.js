import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from 'react-spring';

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { OrbitControls, CameraShake, useProgress, Html, MeshDistortMaterial, Sky, Effects } from '@react-three/drei';
import { EffectComposer, DepthOfField, Noise, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"

import './App.css';

import Loading from './components/LoadingScreen';
import Scene from './components/Scene';
import Header from './components/Header';
import Footer from './components/Footer';
import StaticFooter from './components/StaticFooter';
import ResizeController from './components/ResizeController';


const ORBIT_CONTROLS = false


export default function App() {

  const [showHeader, setShowHeader] = useState(true)
  const [showFooter, setShowFooter] = useState(false)

  const { headerOpacity, headerTranslate, footerOpacity, footerTranslate } = useSpring({
    headerOpacity: showHeader ? 1 : 0,
    headerTranslate: showHeader ? 0 : -100,
    footerOpacity: showFooter ? 1 : 0,
    footerTranslate: showFooter ? 0 : -100
  })


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
      <animated.div style={{opacity:headerOpacity, top:headerTranslate}} className="headerContainer">
        <Header/>
      </animated.div>

      <Canvas colorManagement camera={{position:[0, 0, 0]}}>
        {ORBIT_CONTROLS && <OrbitControls/>}
        <ResizeController />

        <Suspense fallback={null}>
          <Scene setShowHeader={setShowHeader} setShowFooter={setShowFooter} />
          <CameraShake {...shakeConfig} />
        </Suspense>

        <EffectComposer>
          {/* <DepthOfField focusDistance={0} focalLength={0.03} bokehScale={2} height={480} /> */}
          {/* <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.5} height={500} opacity={1.5} />
          <ChromaticAberration offset={[0.0005, 0.0]}/>
          <Vignette eskil={false} offset={0.4} darkness={0.7} /> */}
        </EffectComposer>
        
      </Canvas>

      <animated.div style={{opacity:footerOpacity, bottom:footerTranslate}} className="footerContainer">
        <Footer/>
      </animated.div>

      <StaticFooter/>
    </div>
  );
}
