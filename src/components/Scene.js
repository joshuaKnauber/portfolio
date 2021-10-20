import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useSpring, animated } from '@react-spring/three';

import Statue from './Statue';
import Plane from './Plane';


import InteractiveRecommendationsImg from '../assets/planes/interactiveRecommendations.png';
import StreamingAppImg from '../assets/planes/streamingApp.png';
import PortfolioImg from '../assets/planes/portfolio.png';
import ShelterSitemapImg from '../assets/planes/shelterSitemap.png';
import OtherImg from '../assets/planes/other.png';


export default function Scene({ setShowHeader, setShowFooter, setScrollProgress }) {

  const START_Y_STATUE = -15 // amount the statue is translated on y at the start
  const END_Y_STATUE = -1.5 // final y position of the statue
  const START_Y_PLANE = 0 // amount the planes are translated on y at the start
  const STATUE_ROTATIONS = 180 // amount of degrees the object should rotate

  const PLANE_VERT_DIST = -4 // vertical distance between the planes
  const PLANE_HORIZ_DIST = 3.5 // horizontal distance between the planes and the center

  const PLANE_SCROLL_DEGREES = 9 // should add up to 90. the lower the more scrolls are needed to get to the next plane
  const MOBILE_SCROLL_SPEED = 0.25 // scroll speed factor on mobile. higher is faster


  const planes = [
    // null,
    null,
    {
      title: "Interactive Recommendations",
      tags: ["React", "University Project", "Interactive Data Viz"],
      link: "https://beryl-chemistry-021.notion.site/Interactive-Recommendations-15af3dbdef224d978478d042c68ba5a4",
      image: InteractiveRecommendationsImg,
    },
    {
      title: "Streaming App",
      tags: ["UI/UX", "React Native", "University Project"],
      link: "https://beryl-chemistry-021.notion.site/Music-App-de41e45b6f294dbdbba316c098dc29cf",
      image: StreamingAppImg,
    },
    {
      title: "Portfolio Website",
      tags: ["UI/UX", "React", "Three.js"],
      link: "https://beryl-chemistry-021.notion.site/Portfolio-Website-f0ea1ccd06654429a5435408400ad857",
      image: PortfolioImg,
    },
    {
      title: "Animal Shelter Sitemap",
      tags: ["UX Research", "User Testing", "University Project"],
      link: "https://beryl-chemistry-021.notion.site/Animal-Shelter-Sitemap-29627b241e4d41a5b3823cd8755a1b78",
      image: ShelterSitemapImg,
    },
    {
      title: "Other Projects",
      tags: ["UI/UX", "Freelancing", "Open Source", "..."],
      link: "https://beryl-chemistry-021.notion.site/Other-Projects-e85abdbaacd64db88f4fe19ded20eb5b",
      image: OtherImg,
    },
  ]


  const [yPosRocket, setYPosRocket] = useState(START_Y_STATUE)
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
    // move and control other elements when rotating planes

    const rotations = rotPlane / 90
    const percentageComplete = rotations / planes.length

    // set scroll progress indicator
    setScrollProgress(percentageComplete*-1*100)

    // show or hide header
    if (percentageComplete < -0.05) {
      setShowHeader(false)
    } else {
      setShowHeader(true)
    }

    // show or hide footer
    if (percentageComplete < -0.90) {
      setShowFooter(true)
    } else {
      setShowFooter(false)
    }

    // move plane to correct position
    const newYPos = START_Y_PLANE + PLANE_VERT_DIST * rotations
    setYPosPlane(newYPos)

    // move statue to correct position
    const newRocketPos = START_Y_STATUE + (START_Y_STATUE-END_Y_STATUE)*percentageComplete
    setYPosRocket(newRocketPos)

    // rotate statue
    setRotRocket(_ => {
      const newRocketRot = STATUE_ROTATIONS + STATUE_ROTATIONS * percentageComplete
      return newRocketRot
    })
  }, [rotPlane])


  const rotateElements = (scrollAmount) => {
    // called when scrolled on desktop or mobile with amount to scroll

    setRotPlane(rot => {
      // rotate the planes by some amount while snapping to 90° rotations if close
      let newRot = rot - scrollAmount

      // if close to multiple of 90 and scrolling in right direction
      const nextMultiple = 90*Math.round(newRot/90)
      if (scrollAmount !== 0 && nextMultiple-rot !== 0) {
        const toScrollDirection = (nextMultiple - rot) / Math.abs(nextMultiple - rot)
        const scrollDirection = scrollAmount / Math.abs(scrollAmount) * -1
        const snapDistance = Math.abs(Math.abs(nextMultiple) - Math.abs(rot))

        // if scrolled far enough
        if (Math.abs(scrollAmount) > PLANE_SCROLL_DEGREES/2 && toScrollDirection === scrollDirection && snapDistance <= PLANE_SCROLL_DEGREES) {
          newRot = nextMultiple
        }
      }

      // limit rotation to min and max
      return Math.max(-planes.length*90, Math.min(0, newRot))
    })
  }


  // SCROLL ON DESKTOP
  const onScroll = (evt) => {
    // limit scroll amount to e.g. 18 to add up to 90°
    if (evt.deltaY) {
      const scrollAmount = Math.min(PLANE_SCROLL_DEGREES, Math.abs(evt.deltaY)) * evt.deltaY/Math.abs(evt.deltaY)
      rotateElements(scrollAmount)
    }
  }

  // SCROLL ON MOBILE
  let pointerStartY = useRef(NaN)
  const onPointerDown = (evt) => pointerStartY = evt.pageY
  const onPointerUp = () => pointerStartY = NaN

  const onPointerMove = (evt) => {
    // check if moving finger and scroll based on the move amount
    if (!isNaN(pointerStartY) && (pointerStartY - evt.pageY !== 0)) {
      rotateElements((pointerStartY - evt.pageY) * MOBILE_SCROLL_SPEED)
      pointerStartY = evt.pageY
    }
  }


  useEffect(() => {
    // add event listeners for scrolling on mount
    document.body.addEventListener("wheel", onScroll)
    document.body.addEventListener("pointerdown", onPointerDown)
    document.body.addEventListener("pointerup", onPointerUp)
    document.body.addEventListener("pointermove", onPointerMove)
    
    return () => {
      // remove event listeners on onmount
      document.body.removeEventListener("wheel", onScroll)
      document.body.removeEventListener("pointerdown", onPointerDown)
      document.body.removeEventListener("pointerup", onPointerUp)
      document.body.removeEventListener("pointermove", onPointerMove)
    }
  }, [])


  return (
    <>
      <ambientLight intensity={1}/>

      <animated.group position={yPosRocketAnimated} rotation={rotRocketAnimated}>
        <Statue />
      </animated.group>

      <Suspense fallback={null}>
        <animated.group position={yPosPlaneAnimated} rotation={rotPlaneAnimated}>
          {planes.map((data, index) => {
            if (data === null) return null

            const isX = 1 - Number(index % 2 === 0)
            const factorX = (Number((index+1) % 4 === 0) * 2 - 1) * isX * -1
            const factorZ = (Number(index % 4 === 0) * 2 - 1) * (1-isX)

            const rotations = rotPlane*-1 / 90
            const distance = Math.min(1, Math.abs(rotations - index))
            const opacity = mapRange(1 - distance, 0, 1, 0, 1) // using map range in case opacity should stay on longer in the future

            return <Plane key={JSON.stringify(data)}
              x={PLANE_HORIZ_DIST * factorX}
              y={PLANE_VERT_DIST * index}
              z={PLANE_HORIZ_DIST * factorZ}
              rot={Math.PI/2 * index}
              opacity={opacity}
              data={data}
            />
          })}
        </animated.group>
      </Suspense>
    </>
  )
}