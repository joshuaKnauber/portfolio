import React, { useEffect, useState } from "react";
import { Textfit } from 'react-textfit';
import ScaleText from "react-scale-text";
import { useSpring, animated } from 'react-spring';

import Console from './Console';
import "./Header.css";
import Arrows from '../assets/img/arrows.svg';
import Arrow from '../assets/img/arrow.svg';



export default function Header() {

  const [showScrollWarning, setShowScrollWarning] = useState(false)

  const triggerScrollWarning = () => {
    setShowScrollWarning(true)
  }

  const { arrowOpac } = useSpring({
    loop: { reverse: true },
    from: { arrowOpac: 0.2 },
    to: { arrowOpac: 1 },
    config: { duration: 1500 }
  });

  const { scrollWarningOpac } = useSpring({
    scrollWarningOpac: showScrollWarning ? 1 : 0,
    config: { duration: 1000 },
    onResolve: () => {setShowScrollWarning(false)}
  });

  return (
    <div className="headerContent">
      {/* <Console/> */}
      <div className="textHeader">
        <ScaleText widthOnly={true} minFontSize={18} maxFontSize={150} className=""><p className="titleBig">Hey! I'm Joshua</p></ScaleText>
        <p className="headerBodyText">I design unique & usable solutions for hard problems</p>
        <p className="headerBodyText">Currently I'm studying <a href="https://code.berlin/en/" target="_blank">Interaction Design at CODE University in Berlin</a></p>
        <animated.div style={{opacity:arrowOpac}} className="scrollIndicatorContainer" onClick={triggerScrollWarning}><img src={Arrow}/></animated.div>
        <animated.p className="scrollWarning" style={{opacity:scrollWarningOpac}}>▼ scroll down ▼</animated.p>
      </div>
    </div>
  );
}