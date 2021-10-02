import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { OrbitControls, CameraShake, Line, Text, MeshWobbleMaterial, MeshDistortMaterial, Sky } from '@react-three/drei';
import { EffectComposer, DepthOfField, Noise, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"

import Geometry from './Geometry';


export default function Scene() {
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