import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated, RoundedBox, Box } from '@react-spring/three';
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

import Mockup from '../assets/model/model.gltf';
import Test from '../assets/model/model_test.gltf';
import Holo from '../assets/model/holo.gltf';



export default function Rocket() {
  const { scene } = useLoader(GLTFLoader, Holo)  

  return (
    <>
      {/* <mesh position={[0,5,0]}>
        <boxGeometry args={[1, 10, 1]} />
        <meshStandardMaterial color={"orange"} />
      </mesh> */}
      <primitive object={ scene } />
    </>
  );
}