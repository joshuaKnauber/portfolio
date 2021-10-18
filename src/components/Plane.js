import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { Line, Text, MeshWobbleMaterial, Html } from '@react-three/drei';

import { useGLTF, useTexture } from '@react-three/drei'

import Emit from '../assets/planes/emit.png';
import TitleFont from '../fonts/ClarityCity-Bold.woff';
import SubTitleFont from '../fonts/ClarityCity-RegularItalic.woff';


const AnimatedText = animated(Text);
const AnimatedWobbleMaterial = animated(MeshWobbleMaterial);


export default function Plane({x=0, y=0, z=0, rot=0, opacity=1, data=null}) {
  const img = useTexture(data.image)

  const [showText, setShowText] = useState(false)

  const [hoveringPlane, setHoveringPlane] = useState(false)

  const { textPos, tagPos, textOpac, tagOpac } = useSpring({
    textPos: showText ? [-1.7, -0.4, 0.3] : [1.5, -0.4, 0.3],
    tagPos: showText ? [-1.7, -0.65, 0.3] : [2.5, -0.65, 0.3],
    textOpac: showText ? 1 : 0,
    tagOpac: showText ? 0.5 : 0,
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
      <mesh
        onPointerOver={() => setHoveringPlane(true)} onPointerOut={() => setHoveringPlane(false)}
        onClick={() => window.open(data.link, "_blank")}>
        <animated.planeBufferGeometry args={[3.5, 2]} attach="geometry" />
        <AnimatedWobbleMaterial attach="material"
          factor={Math.min(1-opacity, 0.2)} speed={3}
          // side={THREE.DoubleSide}
          transparent={true}
          map={img}
          color={planeColor}
        />
      </mesh>
      <AnimatedText
        position={textPos}
        fillOpacity={textOpac}
        strokeOpacity={0}
        font={TitleFont}
        anchorX="left"
        fontSize={0.25} >{data.title}</AnimatedText>
      <AnimatedText
        position={tagPos}
        fillOpacity={tagOpac}
        strokeOpacity={0}
        strokeColor="white"
        font={SubTitleFont}
        anchorX="left"
        fontSize={0.11} >{data.tags.map(tag => `[${tag}] `)}</AnimatedText>
    </group>
  )
}