import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';

import { useGLTF, useTexture } from '@react-three/drei'

import StageOne from '../assets/rocket/rocket.gltf';

import StageOneColor from '../assets/rocket/stage-one-color.png';
import StageOneMetalness from '../assets/rocket/stage-one-metalness.png';
import StageOneRoughness from '../assets/rocket/stage-one-roughness.png';
import StageOneAO from '../assets/rocket/stage-one-ao.png';
import StageOneNormal from '../assets/rocket/stage-one-normal.png';



export default function Rocket() {
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