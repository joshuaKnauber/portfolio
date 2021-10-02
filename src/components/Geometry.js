import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { OrbitControls, CameraShake, Line, Text, MeshWobbleMaterial, MeshDistortMaterial, Sky } from '@react-three/drei';
import { EffectComposer, DepthOfField, Noise, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"

import Rocket from './Rocket';
import Plane from './Plane';


const ORBIT = false


export default function Geometry() {
  const [yPos, setYPos] = useState(0)
  const [rocketRot, setRocketRot] = useState(0)
  const [planeRot, setPlaneRot] = useState(0)

  const { yPosAnimated, rocketRotAnimated, planeRotAnimated } = useSpring({
    yPosAnimated: [0, yPos-50, 0],
    rocketRotAnimated: [0, rocketRot, 0],
    planeRotAnimated: [0, planeRot, 0],
  })

  const moveElements = (yAmount) => {
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
      <Rocket />
      </animated.group>

      <Suspense fallback={null}>
        <animated.group position={yPosAnimated} rotation={planeRotAnimated}>
            <Plane x={0} y={37.5} z={2.5} rot={0}/>
        </animated.group>
      </Suspense>
      
    </group>
  )
}