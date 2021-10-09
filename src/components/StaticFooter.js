import React, { useState } from "react";

import { useSpring, animated } from 'react-spring';
import { FaEnvelope, FaTwitter, FaArtstation, FaLinkedin } from 'react-icons/fa';


export default function StaticFooter({width}) {

  const [showCopied, setShowCopied] = useState(false)

  const { textOpacity } = useSpring({
    textOpacity: showCopied ? 1 : 0,
  })

  return (
    <div className="staticFooterContainer">
      <animated.p className="footerEmail" style={{opacity:textOpacity}}>Copied <span>joshua.knauber@gmail.com</span></animated.p>
      <div className="iconContainer" onClick={() => {
        navigator.clipboard.writeText("joshua.knauber@gmail.com")
        setShowCopied(true)
        setTimeout(() => {
          setShowCopied(false)
        }, 4000);
      }}>
        <FaEnvelope size={20} />
      </div>
      <div style={{width:width, display:"flex", overflow:"hidden"}}>
        <div className="iconContainer" onClick={() => window.open("https://twitter.com/joshuaKnauber", '_blank').focus()}>
          <FaTwitter size={20} />
        </div>
        <div className="iconContainer" onClick={() => window.open("https://joshuaknauber.artstation.com/", '_blank').focus()}>
          <FaArtstation size={20} />
        </div>
        <div className="iconContainer" onClick={() => window.open("https://www.linkedin.com/in/joshua-knauber-410b31221/", '_blank').focus()}>
          <FaLinkedin size={20} />
        </div>
      </div>
    </div>
  );
}