import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from 'react-spring';

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { OrbitControls, CameraShake, useProgress, Html, MeshDistortMaterial, Sky, Effects } from '@react-three/drei';
import { DepthOfField, Noise, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import './App.css';

import Loading from './components/LoadingScreen';
import Scene from './components/Scene';
import Header from './components/Header';
import Footer from './components/Footer';
import StaticFooter from './components/StaticFooter';
import ResizeController from './components/ResizeController';
import UnrealBloom from './components/UnrealBloom';

extend({ EffectComposer, RenderPass, UnrealBloomPass });


const ORBIT_CONTROLS = false


const AnimatedCircularProgress = animated(CircularProgressbar);


export default function App() {

  const [showHeader, setShowHeader] = useState(true)
  const [showFooter, setShowFooter] = useState(false)

  const [scrollProgress, setScrollProgress] = useState(0)

  const { headerOpacity, headerClass, staticFooterOpacity, footerOpacity, footerTranslate, animatedScrollProgress } = useSpring({
    headerOpacity: showHeader ? 1 : 0,
    staticFooterOpacity: showHeader ? 0 : 1,
    footerOpacity: showFooter ? 1 : 0,
    footerTranslate: showFooter ? 0 : -100,
    animatedScrollProgress: scrollProgress
  })

  useEffect(() => {
    if (headerRef.current) {
      if (showHeader) {
        headerRef.current.className = "headerContainer"
      } else {
        headerRef.current.className = "headerContainer scaledDown"
      }
    }
  }, [showHeader])


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

  const headerRef = useRef()


  return (
    <div className="App">
      <Canvas colorManagement camera={{position:[0, 0, 0]}}>
        {ORBIT_CONTROLS && <OrbitControls/>}
        <ResizeController />

        <Suspense fallback={<Loading/>}>
          <UnrealBloom>
            <Scene setShowHeader={setShowHeader} setShowFooter={setShowFooter} setScrollProgress={setScrollProgress} />
          </UnrealBloom>
          <CameraShake {...shakeConfig} />
        </Suspense>

      </Canvas>

      <animated.div className="progressContainer" style={{opacity:staticFooterOpacity}}>
        <AnimatedCircularProgress value={animatedScrollProgress} strokeWidth={10} styles={buildStyles({
          pathTransitionDuration: 0.1,
          pathColor: `white`,
          trailColor: 'transparent',
          strokeLinecap: 'butt',
        })} />
      </animated.div>
      
      <animated.div style={{opacity:headerOpacity}} className={"headerContainer"} ref={headerRef}>
        <Header/>
      </animated.div>

      <animated.div style={{opacity:footerOpacity, bottom:footerTranslate}} className="footerContainer">
        <Footer/>
      </animated.div>

      <animated.div style={{opacity:staticFooterOpacity}}>
        <StaticFooter/>
      </animated.div>
    </div>
  );
}
