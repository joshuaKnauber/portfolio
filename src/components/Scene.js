import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useSpring, animated } from '@react-spring/three';

import { Line, Text, MeshWobbleMaterial } from '@react-three/drei';

import Rocket from './Rocket';
import Plane from './Plane';


const ORBIT_CONTROLS = false


export default function Scene() {
  const [yPosRocket, setYPosRocket] = useState(0)
  const [yPosPlane, setYPosPlane] = useState(0)

  const [rotRocket, setRotRocket] = useState(0)
  const [rotPlane, setRotPlane] = useState(0)


  const planes = [
    null,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
  ]


  const START_Y_ROCKET = -50 // amount the rocket is translated on y at the start
  const START_Y_PLANE = 0 // amount the planes are translated on y at the start

  const PLANE_VERT_DIST = -3 // vertical distance between the planes
  const PLANE_HORIZ_DIST = 3 // horizontal distance between the planes and the center


  const degrees_to_radians = (degrees) => {return degrees * (Math.PI/180)}


  const { yPosRocketAnimated, yPosPlaneAnimated, rotRocketAnimated, rotPlaneAnimated } = useSpring({
    yPosRocketAnimated: [0, yPosRocket + START_Y_ROCKET, 0],
    yPosPlaneAnimated: [0, yPosPlane + START_Y_PLANE, 0],
    rotRocketAnimated: [0, degrees_to_radians(rotRocket), 0],
    rotPlaneAnimated: [0, degrees_to_radians(rotPlane), 0],
  })


  useEffect(() => {
    // move plane to correct position
    const rotations = rotPlane / 90
    const newYPos = START_Y_PLANE + PLANE_VERT_DIST * rotations
    setYPosPlane(newYPos)

    // move rocket to correct position
  }, [rotPlane])


  const rotateElements = (scrollAmount) => {
    if (ORBIT_CONTROLS) return

    const ROCKET_ROT_SPEED = 0.1
    setRotRocket(rot => {
      const newRot = rot - scrollAmount*ROCKET_ROT_SPEED
      return Math.min(0, newRot)
    })

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

      return Math.min(0, newRot)
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
      rotateElements(pointerStartY - evt.pageY)
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

      <animated.group position={yPosRocketAnimated} rotation={rotRocketAnimated}>
        <Rocket />
      </animated.group>

      <Suspense fallback={null}>
        <animated.group position={yPosPlaneAnimated} rotation={rotPlaneAnimated}>
          {planes.map((data, index) => {
            if (data === null) return <></>

            const isX = 1 - Number(index % 2 === 0)
            const factorX = (Number((index+1) % 4 === 0) * 2 - 1) * isX * -1
            const factorZ = (Number(index % 4 === 0) * 2 - 1) * (1-isX)

            return <Plane key={index}
                      x={PLANE_HORIZ_DIST * factorX}
                      y={PLANE_VERT_DIST * index}
                      z={PLANE_HORIZ_DIST * factorZ}
                      rot={Math.PI/2 * index}
                    />
          })}
        </animated.group>
      </Suspense>
    </>
  )
}