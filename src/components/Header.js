import React, { useEffect, useState } from "react";
import { Textfit } from 'react-textfit';
import { useSpring, animated } from 'react-spring';

import Console from './Console';
import "./Header.css";
import Arrows from '../assets/img/arrows.svg';



export default function Header() {

  const { arrowOpac } = useSpring({
    loop: { reverse: true },
    from: { arrowOpac: 0.5 },
    to: { arrowOpac: 1 },
    config: { duration: 1500 }
  });

  return (
    <div className="headerContent">
      {/* <Console/> */}
      <div className="textHeader">
        <Textfit mode="single" min={18} max={150} className="titleBig">Hey! I'm Joshua</Textfit>
        <p className="headerBodyText">I design unique & usable solutions for hard problems</p>
        <p className="headerBodyText">Currently I'm studying <a href="https://code.berlin/en/" target="_blank">Interaction Design at CODE University in Berlin</a></p>
        <animated.div style={{opacity:arrowOpac}} className="scrollIndicatorContainer"><img src={Arrows}/></animated.div>
      </div>
    </div>
  );
}