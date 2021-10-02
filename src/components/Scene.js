import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useSpring, animated } from '@react-spring/three';

import { Line, Text, MeshWobbleMaterial } from '@react-three/drei';

import Rocket from './Rocket';
import Plane from './Plane';


const ORBIT = false


export default function Scene() {
  const [yPosRocket, setYPosRocket] = useState(0)
  const [yPosPlane, setYPosPlane] = useState(0)

  const [rotRocket, setRotRocket] = useState(0)
  const [rotPlane, setRotPlane] = useState(0)


  const START_Y_ROCKET = -50 // amount the rocket is translated on y at the start
  const START_Y_PLANE = 0 // amount the planes are translated on y at the start

  const degrees_to_radians = (degrees) => {return degrees * (Math.PI/180)}
  const restrict_to_increments = (number, increment) => {return number - number%increment}

  const { yPosRocketAnimated, yPosPlaneAnimated, rotRocketAnimated, rotPlaneAnimated } = useSpring({
    yPosRocketAnimated: [0, yPosRocket + START_Y_ROCKET, 0],
    yPosPlaneAnimated: [0, yPosPlane + START_Y_PLANE, 0],
    rotRocketAnimated: [0, degrees_to_radians(rotRocket), 0],
    rotPlaneAnimated: [0, degrees_to_radians(rotPlane), 0],
  })


  const moveElements = (scrollAmount, moveAmount) => {
    if (ORBIT) return

    // setYPosRocket(pos => pos + 0.001)
    // setYPosPlane(pos => pos + 0.001)

    setRotRocket(rot => rot - scrollAmount)
    setRotPlane(rot => {
      let newRot = rot - scrollAmount

      // if close to multiple of 90 and scrolling in right direction
      const nextMultiple = 90*Math.round(newRot/90)
      if (scrollAmount !== 0 && nextMultiple-rot !== 0) {
        const toScrollDirection = (nextMultiple - rot) / Math.abs(nextMultiple - rot)
        const scrollDirection = scrollAmount / Math.abs(scrollAmount) * -1
        const snapDistance = Math.abs(Math.abs(nextMultiple) - Math.abs(rot))
        console.log(snapDistance)
        if (Math.abs(scrollAmount) > 9 && toScrollDirection === scrollDirection && snapDistance <= 18) {
          newRot = nextMultiple
          console.log("snap")
        }
      }

      return newRot
    })
  }


  // scroll desktop
  const onScroll = (evt) => {
    const MAX_SCROLL_DELTA = 18
    const scrollAmount = Math.min(MAX_SCROLL_DELTA, Math.abs(evt.deltaY)) * evt.deltaY/Math.abs(evt.deltaY)

    const moveAmount = 0

    moveElements(scrollAmount, moveAmount)
  }

  // scroll mobile
  let pointerStartY = useRef(NaN)
  const onPointerDown = (evt) => pointerStartY = evt.pageY
  const onPointerUp = () => pointerStartY = NaN
  const onPointerMove = (evt) => {
    if (!isNaN(pointerStartY)) {
      moveElements(pointerStartY - evt.pageY)
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


  const V_DIST = -3
  const H_DIST = 3

  return (
    <>
      <ambientLight intensity={0.7}/>
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} />

      <animated.group position={yPosRocketAnimated} rotation={rotRocketAnimated}>
        <Rocket />
      </animated.group>

      <Suspense fallback={null}>
        <animated.group position={yPosPlaneAnimated} rotation={rotPlaneAnimated}>
            <Plane x={0} y={0} z={H_DIST} rot={0}/>
            <Plane x={H_DIST} y={V_DIST*1} z={0} rot={Math.PI/2}/>
        </animated.group>
      </Suspense>
    </>
  )
}