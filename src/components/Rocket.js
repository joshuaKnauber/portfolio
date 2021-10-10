import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

import Cubes from '../assets/rocket/testMaps.gltf';
import Mockup from '../assets/model/model.gltf';



export default function Rocket() {
  const { scene } = useLoader(GLTFLoader, Mockup)  

  return (
    <primitive object={ scene } />
  );
}