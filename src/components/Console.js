import React, { useEffect, useState, useRef } from "react";
import Typist from 'react-typist';
import { useSpring, animated } from 'react-spring';

import "./Console.css";


export default function Console() {

  const [copiedEmail, setCopiedEmail] = useState(false)

  const messages = [
    [["Hi! I'm Joshua", "typed"]],
    [["I love", "typed"], ["solving hard problems", "highlighted"], ["with", "typed"], ["unique & usable solutions", "highlighted"]],
    [[" ", "typed"]],
    [["-> I'm currently studying", "typed"], ["Interaction Design at CODE University", "https://www.code.berlin/en/study/interaction-design/"], ["in Berlin", "typed"]],
    [["-> I work on", "typed"], ["UI, UX, frontend programming","special"], ["and some", "typed"], ["3D art","special"]],
    [["-> I'm passionate about (working on) all topics from music to space to everything that impacts our future 🚀", "typed"]],
    [["  ", "typed"]],
    [["▼ Scroll down ▼", "highlighted"], ["to see some of my projects", "typed"]],
    [["[E-Mail]", "link"], ["Twitter", "https://twitter.com/joshuaKnauber"], ["Artstation", "https://joshuaknauber.artstation.com/"], ["LinkedIn", "https://www.linkedin.com/in/joshua-knauber-410b31221/"]],
  ]
  const [messageIndex, setMessageIndex] = useState(0);

  const consoleContent = useRef();

  useEffect(() => {
    let timeout;
    if (messageIndex < messages.length - 1) {
      timeout = setTimeout(() => setMessageIndex(messageIndex + 1), 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [messageIndex]);

  useEffect(() => {
    let interval = setInterval(() => {
      consoleContent.current.scrollTo(0, consoleContent.current.scrollHeight)
    }, 100);

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="console">
        <div className="consoleHeader">
            <div className="windowCircle square"></div>
            <div className="windowCircle circle"></div>
            <div className="windowCircle tria"></div>
        </div>
        <div className="consoleContent" ref={consoleContent}>
            {messages.filter((_, index) => {return index <= messageIndex}).map(msg =>
              <div className="consoleLine" key={JSON.stringify(msg)}>
                <span>{'>>>'}&nbsp;&nbsp;</span>
                <Typist startDelay={0} avgTypingDelay={1} stdTypingDelay={1}
                  cursor={{show: false}}>
                  {msg.map(text => {
                    if (text[1].includes("http")) {
                      return <a className={text[1]} key={text[1]} href={text[1]} target="_blank">[{text[0]}]&nbsp;</a>
                    }
                    return <span className={text[1]} key={text[0]} onClick={() => {
                      if (text[0] === "[E-Mail]") {
                        navigator.clipboard.writeText("joshua.knauber@gmail.com")
                        setCopiedEmail(true)
                      }
                    }}>{text[0]} </span>
                  })}
                </Typist>
              </div>)}

            {copiedEmail && <div className="consoleLine">
              <span>{'>>>'}&nbsp;&nbsp;</span>
              <Typist startDelay={0} avgTypingDelay={2} stdTypingDelay={2}
                cursor={{show: false}}>
                {<span className={"typed"}>Copied E-Mail (<span className="link"
                  style={{userSelect: "all"}}>joshua.knauber@gmail.com</span>)</span>}
              </Typist>
            </div>}

        </div>
    </div>
  );
}