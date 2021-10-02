import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { OrbitControls, CameraShake, Line, Text, MeshWobbleMaterial, MeshDistortMaterial, Sky, Effects } from '@react-three/drei';
import { EffectComposer, DepthOfField, Noise, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"

import './App.css';

import Loading from './components/LoadingScreen';
import Scene from './components/Scene';
import ResizeController from './components/ResizeController';


const ORBIT = false


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
      <Suspense fallback={<Loading/>}>

        <Canvas colorManagement camera={{position:[0, 0, 0]}}>
          {ORBIT && <OrbitControls/>}
          {/* <CameraShake {...shakeConfig} /> */}
          <ResizeController />

          <Scene />

          <EffectComposer>
            {/* <DepthOfField focusDistance={0} focalLength={0.03} bokehScale={2} height={480} /> */}
            {/* <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.5} height={500} opacity={1.5} /> */}
            {/* <ChromaticAberration offset={[0.0005,0.0]}/> */}
            {/* <Vignette eskil={false} offset={0.2} darkness={0.8} /> */}
          </EffectComposer>
          
        </Canvas>

      </Suspense>
    </div>
  );
}
