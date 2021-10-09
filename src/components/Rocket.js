import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

import { useGLTF, useTexture } from '@react-three/drei'

// import StageOne from '../assets/rocket/rocket.gltf';
// import Cubes from '../assets/rocket/test.gltf';
import Cubes from '../assets/rocket/testMaps.gltf';

import emission from '../assets/rocket/emit.jpg';
import diffuse from '../assets/rocket/diffuse.jpg';



export default function Rocket() {
  // const { nodes } = useGLTF(Cubes)
  const { scene } = useLoader(GLTFLoader, Cubes)

  // const { nodes } = useLoader(GLTFLoader, Cubes)
  const color = useTexture(diffuse)
  const emit = useTexture(emission)

  

  return (
    <primitive object={ scene } ma />
  );

  // return (
  //   <mesh geometry={nodes.Cube.geometry}>
  //     {/* <meshStandardMaterial 
  //       map={color}
  //       metalnessMap={metalness} 
  //       roughnessMap={roughness} 
  //       normalMap={normal} 
  //       aoMap={ao}
  //       map-flipY={false} /> */}
  //       {/* <meshPhongMaterial color="red"/> */}
  //   </mesh>
  // );
}