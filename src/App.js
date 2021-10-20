import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useSpring, animated } from 'react-spring';

import { Canvas } from '@react-three/fiber';
import { CameraShake } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './App.css';

import Loading from './components/LoadingScreen';
import Scene from './components/Scene';
import Header from './components/Header';
import Footer from './components/Footer';
import StaticFooter from './components/StaticFooter';
import ResizeController from './components/ResizeController';


const AnimatedCircularProgress = animated(CircularProgressbar);
const AnimatedStaticFooter = animated(StaticFooter);


export default function App() {

  const [loadingComplete, setLoadingComplete] = useState(false)

  const [showHeader, setShowHeader] = useState(true)
  const [showFooter, setShowFooter] = useState(false)

  const [scrollProgress, setScrollProgress] = useState(0)

  const { headerOpacity, staticFooterOpacity, footerOpacity, footerTranslate, animatedScrollProgress, animatedIconsWidth, loadingCoverOpacity } = useSpring({
    headerOpacity: showHeader ? 1 : 0,
    staticFooterOpacity: 1,
    footerOpacity: showFooter ? 1 : 0,
    footerTranslate: showFooter ? 0 : -100,
    animatedScrollProgress: scrollProgress,
    animatedIconsWidth: showFooter || showHeader ? "150px" : "0px",
    loadingCoverOpacity: loadingComplete ? 0 : 1,
  })

  useEffect(() => {
    if (headerRef.current) {
      if (showHeader) {
        headerRef.current.className = "headerContainer"
      } else {
        headerRef.current.className = "headerContainer scaledDown"
      }
    }
  }, [showHeader])


  useEffect(() => {
    setTimeout(() => {
      setLoadingComplete(true)
    }, 1000);
  }, [])


  const shakeConfig = {
    maxYaw: 0.008,
    maxPitch: 0.008,
    maxRoll: 0.008,
    yawFrequency: 0.5,
    pitchFrequency: 0.5,
    rollFrequency: 0.5,
    intensity: 1,
    decay: false,
  }

  const headerRef = useRef()

  return (
    <div className="App">
      <Canvas colorManagement camera={{position:[0, 0, 0]}} gl={{antialias:true, alpha:true}}>
        <ResizeController />

        <Suspense fallback={null} >
          <Scene setShowHeader={setShowHeader} setShowFooter={setShowFooter} setScrollProgress={setScrollProgress} />
          <CameraShake {...shakeConfig} />
        </Suspense>

        <EffectComposer>
          {/* <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.8} height={300} intensity={0.3} /> */}
          {/* <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.2} height={800} intensity={0.1} /> */}
          {/* <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.6} height={60} intensity={0.06} /> */}
          {/* <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.8} height={500} intensity={0.25} /> */}
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>

      </Canvas>

      <animated.div
        style={{position:"fixed", width:"100vw", height:"100vh",
          backgroundColor:"black", opacity:loadingCoverOpacity,
          pointerEvents: "none"}}></animated.div>

      <animated.div className="progressContainer" style={{opacity:staticFooterOpacity}}>
        <AnimatedCircularProgress value={animatedScrollProgress} strokeWidth={10} styles={buildStyles({
          pathTransitionDuration: 0.1,
          pathColor: `white`,
          trailColor: 'transparent',
          strokeLinecap: 'butt',
        })} />
      </animated.div>

      <p className="wipWarning">👷Site under construction!</p>
      
      <animated.div style={{opacity:headerOpacity}} className={"headerContainer"} ref={headerRef}>
        <Header/>
      </animated.div>

      <animated.div style={{opacity:footerOpacity, bottom:footerTranslate}} className="footerContainer">
        <Footer/>
      </animated.div>

      <animated.div style={{opacity:staticFooterOpacity}}>
        <AnimatedStaticFooter width={animatedIconsWidth}/>
      </animated.div>

      <animated.div className="loadingCover" style={{opacity:loadingCoverOpacity}}>
        <Loading/>
      </animated.div>
    </div>
  );
}
