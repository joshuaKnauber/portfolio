import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/three';

import { Text, MeshWobbleMaterial } from '@react-three/drei';

import { useTexture } from '@react-three/drei'

import TitleFont from '../fonts/ClarityCity-Bold.woff';
import SubtitleFont from '../fonts/ClarityCity-RegularItalic.woff';


const AnimatedText = animated(Text);


export default function Plane({x=0, y=0, z=0, rot=0, opacity=1, data=null}) {

  const [showText, setShowText] = useState(false)
  const [hoveringPlane, setHoveringPlane] = useState(false)
  

  const img = useTexture(data.image)


  const { textPos, tagPos, clickPos, textOpac, tagOpac } = useSpring({
    textPos: showText ? [-1.7, -0.4, 0.3] : [1.5, -0.4, 0.3],
    tagPos: showText ? [-1.7, -0.6, 0.3] : [2.5, -0.6, 0.3],
    clickPos: showText ? [-1.7, -0.8, 0.3] : [3, -0.8, 0.3],
    textOpac: showText ? 1 : 0,
    tagOpac: showText ? 0.5 : 0,
    delay: 300
  })

  const { planeScale } = useSpring({
    planeScale: hoveringPlane ? [1.1, 1.1, 1.1] : [1, 1, 1],
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
      <animated.mesh scale={planeScale}
        onPointerOver={() => setHoveringPlane(true)} onPointerOut={() => setHoveringPlane(false)}
        onClick={() => window.open(data.link, "_blank")}>
          
        <animated.planeBufferGeometry args={[3.5, 2]} attach="geometry" />

        <MeshWobbleMaterial attach="material"
          factor={Math.min(1-opacity, 0.2)} speed={3}
          transparent={true}
          map={img}
          emissiveMap={img}
          emissiveIntensity={1}
        />
      </animated.mesh>

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
        font={SubtitleFont}
        anchorX="left"
        // color="#FF630B"
        fontSize={0.11} >{data.tags.map(tag => `[${tag}] `)}</AnimatedText>
      <AnimatedText
        position={clickPos}
        fillOpacity={textOpac}
        strokeOpacity={0}
        strokeColor="white"
        font={SubtitleFont}
        anchorX="left"
        color="#4719FC"
        fontSize={0.08} >Click for details</AnimatedText>

    </group>
  )
}