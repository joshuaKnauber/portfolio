import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

import { useGLTF, useTexture } from '@react-three/drei'

// import StageOne from '../assets/rocket/rocket.gltf';
import StageOne from '../assets/rocket/test.gltf';

import StageOneColor from '../assets/rocket/stage-one-color.png';
import StageOneMetalness from '../assets/rocket/stage-one-metalness.png';
import StageOneRoughness from '../assets/rocket/stage-one-roughness.png';
import StageOneAO from '../assets/rocket/stage-one-ao.png';
import StageOneNormal from '../assets/rocket/stage-one-normal.png';



export default function Rocket() {
  // const { nodes } = useGLTF(StageOne)
  // const color = useTexture(StageOneColor)

  const { scene } = useLoader(GLTFLoader, StageOne)

  return (
    <primitive object={ scene } />
  )

  // return (
  //   <mesh geometry={nodes.Cube.geometry} rotation={[0, 1, 0]}>
  //     {/* <meshStandardMaterial 
  //       map={color}
  //       metalnessMap={metalness} 
  //       roughnessMap={roughness} 
  //       normalMap={normal} 
  //       aoMap={ao}
  //       map-flipY={false} /> */}
  //       <meshPhongMaterial color="red"/>
  //   </mesh>
  // )
}