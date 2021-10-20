import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import StatueModel from '../assets/model/statue.gltf';


export default function Statue() {
  const { scene } = useLoader(GLTFLoader, StatueModel)  

  return (
    <>
      <primitive object={ scene } />
    </>
  );
}