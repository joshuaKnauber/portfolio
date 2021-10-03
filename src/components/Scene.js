import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useSpring, animated } from '@react-spring/three';

import { Line, Text, MeshWobbleMaterial, Html } from '@react-three/drei';
import * as THREE from "three";

import Rocket from './Rocket';
import Plane from './Plane';

import HeaderFont from '../fonts/ClarityCity-SemiBold.woff';


const ORBIT_CONTROLS = false


export default function Scene() {

  const START_Y_ROCKET = -50 // amount the rocket is translated on y at the start
  const END_Y_ROCKET = -1 // final y position of the rocket
  const START_Y_PLANE = 0 // amount the planes are translated on y at the start

  const PLANE_VERT_DIST = -4 // vertical distance between the planes
  const PLANE_HORIZ_DIST = 3.5 // horizontal distance between the planes and the center

  const planes = [
    null,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
  ]


  const [yPosRocket, setYPosRocket] = useState(START_Y_ROCKET)
  const [yPosPlane, setYPosPlane] = useState(START_Y_PLANE)

  const [rotRocket, setRotRocket] = useState(0)
  const [rotPlane, setRotPlane] = useState(0)


  const degrees_to_radians = (degrees) => {return degrees * (Math.PI/180)}
  const mapRange = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;


  const { yPosRocketAnimated, yPosPlaneAnimated, rotRocketAnimated, rotPlaneAnimated } = useSpring({
    yPosRocketAnimated: [0, yPosRocket, 0],
    yPosPlaneAnimated: [0, yPosPlane, 0],
    rotRocketAnimated: [0, degrees_to_radians(rotRocket), 0],
    rotPlaneAnimated: [0, degrees_to_radians(rotPlane), 0]
  })


  useEffect(() => {
    // move plane to correct position
    const rotations = rotPlane / 90
    const newYPos = START_Y_PLANE + PLANE_VERT_DIST * rotations
    setYPosPlane(newYPos)

    // move rocket to correct position
    const percentageComplete = rotations / planes.length
    const newRocketPos = START_Y_ROCKET + (START_Y_ROCKET-END_Y_ROCKET)*percentageComplete
    setYPosRocket(newRocketPos)

    // rotate rocket
    const ROCKET_ROTATIONS = 6
    setRotRocket(rot => {
      const newRocketRot = ROCKET_ROTATIONS*90 * percentageComplete
      return newRocketRot
    })
  }, [rotPlane])


  const rotateElements = (scrollAmount) => {
    if (ORBIT_CONTROLS) return

    setRotPlane(rot => {
      let newRot = rot - scrollAmount

      // if close to multiple of 90 and scrolling in right direction
      const nextMultiple = 90*Math.round(newRot/90)
      if (scrollAmount !== 0 && nextMultiple-rot !== 0) {
        const toScrollDirection = (nextMultiple - rot) / Math.abs(nextMultiple - rot)
        const scrollDirection = scrollAmount / Math.abs(scrollAmount) * -1
        const snapDistance = Math.abs(Math.abs(nextMultiple) - Math.abs(rot))

        // if scrolled far enough
        if (Math.abs(scrollAmount) > 9 && toScrollDirection === scrollDirection && snapDistance <= 18) {
          newRot = nextMultiple
        }
      }

      return Math.max(-planes.length*90, Math.min(0, newRot))
    })
  }


  // SCROLL ON DESKTOP
  const onScroll = (evt) => {
    // limit scroll amount to 18 to add up to 90°
    const scrollAmount = Math.min(18, Math.abs(evt.deltaY)) * evt.deltaY/Math.abs(evt.deltaY)

    const moveAmount = 0

    rotateElements(scrollAmount, moveAmount)
  }


  // SCROLL ON MOBILE
  let pointerStartY = useRef(NaN)
  const onPointerDown = (evt) => pointerStartY = evt.pageY
  const onPointerUp = () => pointerStartY = NaN

  const onPointerMove = (evt) => {
    if (!isNaN(pointerStartY)) {
      const MOBILE_SCROLL_SPEED = 0.5
      rotateElements((pointerStartY - evt.pageY) * MOBILE_SCROLL_SPEED)
      pointerStartY = evt.pageY
    }
  }

  useEffect(() => {
    document.body.addEventListener("wheel", onScroll)
    document.body.addEventListener("pointerdown", onPointerDown)
    document.body.addEventListener("pointerup", onPointerUp)
    document.body.addEventListener("pointermove", onPointerMove)

    return () => {
      document.body.removeEventListener("wheel", onScroll)
      document.body.removeEventListener("pointerdown", onPointerDown)
      document.body.removeEventListener("pointerup", onPointerUp)
      document.body.removeEventListener("pointermove", onPointerMove)
    }
  }, [])

  return (
    <>
      <ambientLight intensity={0.7}/>
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} />

      {/* <group>
        <Text font={HeaderFont}  fontSize={2}>Welcome</Text>
      </group> */}

      <Html style={{background:"red", width:"50vw", left:"-25vw", top:"-50vh"}} >
        <p style={{fontSize:50, margin:0}}>test</p>
      </Html>

      <animated.group position={yPosRocketAnimated} rotation={rotRocketAnimated}>
        <Rocket />
      </animated.group>

      <Suspense fallback={null}>
        <animated.group position={yPosPlaneAnimated} rotation={rotPlaneAnimated}>
          {planes.map((data, index) => {
            if (data === null) return null

            const isX = 1 - Number(index % 2 === 0)
            const factorX = (Number((index+1) % 4 === 0) * 2 - 1) * isX * -1
            const factorZ = (Number(index % 4 === 0) * 2 - 1) * (1-isX)

            const rotations = rotPlane*-1 / 90
            const distance = Math.min(1.3, Math.abs(rotations - index))
            const opacity = mapRange(1.3 - distance, 0, 1.3, 0, 1)

            return <Plane key={JSON.stringify(data)}
              x={PLANE_HORIZ_DIST * factorX}
              y={PLANE_VERT_DIST * index}
              z={PLANE_HORIZ_DIST * factorZ}
              rot={Math.PI/2 * index}
              opacity={opacity}
            />
          })}
        </animated.group>
      </Suspense>
    </>
  )
}