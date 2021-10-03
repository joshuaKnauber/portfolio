import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { Line, Text, MeshWobbleMaterial } from '@react-three/drei';

import { useGLTF, useTexture } from '@react-three/drei'

import Emit from '../assets/planes/emit.png';


export default function Plane({x=0, y=0, z=0, rot=0, opacity=1}) {
  const emit = useTexture(Emit)

  return (
    <mesh position={[x, y, z]} rotation={[0, rot, 0]}>
      <planeBufferGeometry args={[3.5, 2]} attach="geometry" />
      <meshStandardMaterial attach="material"
        factor={0.02} speed={3}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={opacity}
        map={emit}
      />
    </mesh>
  )
}