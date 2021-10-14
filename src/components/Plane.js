import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { Line, Text, MeshWobbleMaterial, Html } from '@react-three/drei';

import { useGLTF, useTexture } from '@react-three/drei'

import Emit from '../assets/planes/emit.png';
import TitleFont from '../fonts/ClarityCity-SemiBold.woff';


const AnimatedText = animated(Text);
const AnimatedWobbleMaterial = animated(MeshWobbleMaterial);


export default function Plane({x=0, y=0, z=0, rot=0, opacity=1}) {
  const emit = useTexture(Emit)

  const [showText, setShowText] = useState(false)

  const [hoveringPlane, setHoveringPlane] = useState(false)

  const { textPos, textOpac } = useSpring({
    textPos: showText ? [0, 0, 0.3] : [1.5, 0, 0.3],
    textOpac: showText ? 1 : 0,
    delay: 300
  })

  const { planeColor } = useSpring({
    planeColor: hoveringPlane ? "rgb(180, 180, 180)" : "white",
  })

  useEffect(() => {
    if (opacity > 0.7) {
      setShowText(true)
    } else {
      setShowText(false)
    }
  }, [opacity])
  useEffect(() => {
    if (hoveringPlane) {
      document.body.classList.add("pointing")
    } else {
      document.body.classList.remove("pointing")
    }
  }, [hoveringPlane])

  return (
    <group position={[x, y, z]} rotation={[0, rot, 0]}>
      <mesh onPointerOver={() => setHoveringPlane(true)} onPointerOut={() => setHoveringPlane(false)}>
        <animated.planeBufferGeometry args={[3.5, 2]} attach="geometry" />
        <AnimatedWobbleMaterial attach="material"
          factor={Math.min(1-opacity, 0.2)} speed={3}
          // side={THREE.DoubleSide}
          transparent={true}
          map={emit}
          color={planeColor}
        />
      </mesh>
      <AnimatedText
        position={textPos}
        fillOpacity={textOpac}
        strokeOpacity={0}
        font={TitleFont}
        fontSize={0.8} >test</AnimatedText>
    </group>
  )
}