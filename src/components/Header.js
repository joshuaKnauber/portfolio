import React from "react";
import ScaleText from "react-scale-text";
import { useSpring, animated } from 'react-spring';

import "./Header.css";

import Arrow from '../assets/img/arrow.svg';



export default function Header() {

  const { arrowOpac } = useSpring({
    loop: { reverse: true },
    from: { arrowOpac: .1 },
    to: { arrowOpac: .5 },
    config: { duration: 2000 }
  });

  return (
    <div className="headerContent">
      <div className="textHeader">

        <ScaleText widthOnly={true} minFontSize={18} maxFontSize={150} className=""><p className="titleBig">Hey! I'm Joshua</p></ScaleText>

        <p className="headerBodyText">I love designing unique & usable solutions for hard problems</p>
        <p className="headerBodyText">I'm studying <a href="https://code.berlin/en/" target="_blank">Interaction Design at CODE University Berlin</a></p>

        <p className="headerScrollInfo">Scroll to see some of my projects</p>
        <animated.div style={{opacity:arrowOpac}} className="scrollIndicatorContainer"><img src={Arrow}/></animated.div>

      </div>
    </div>
  );
}