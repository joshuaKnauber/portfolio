import React, { useEffect, useState, useRef } from "react";
import Typist from 'react-typist';
import { useSpring, animated } from 'react-spring';

import "./Console.css";


export default function Console() {

  const [showLineTwo, setShowLineTwo] = useState(false)

  const [clearFirstLines, setClearFirstLines] = useState(false)

  const [copiedEmail, setCopiedEmail] = useState(false)

  const messages = [
    [["", "typed"]],
    [["Hi! I'm Joshua", "typed"]],
    [["I love", "typed"], ["solving hard problems", "highlighted"], ["with", "typed"], ["unique & usable solutions", "highlighted"]],
    [[" ", "typed"]],
    [["-> I'm currently studying", "typed"], ["Interaction Design at CODE University", "https://www.code.berlin/en/study/interaction-design/"], ["in Berlin", "typed"]],
    [["-> I work on", "typed"], ["UI, UX, frontend programming","special"], ["and some", "typed"], ["3D art","special"]],
    [["-> I'm interested in (working on) all topics from music to space to everything that impacts our future 🚀", "typed"]],
    [["  ", "typed"]],
    [["▼ Scroll down ▼", "highlighted"], ["to see some of my projects", "typed"]],
    [["[E-Mail]", "link"], ["Twitter", "https://twitter.com/joshuaKnauber"], ["Artstation", "https://joshuaknauber.artstation.com/"], ["LinkedIn", "https://www.linkedin.com/in/joshua-knauber-410b31221/"]],
  ]
  const [messageIndex, setMessageIndex] = useState(0);

  const consoleContent = useRef();

  useEffect(() => {
    if (!clearFirstLines) return

    let timeout;
    if (messageIndex < messages.length - 1) {
      timeout = setTimeout(() => setMessageIndex(messageIndex + 1), 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [clearFirstLines, messageIndex]);

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
            <div className="windowCircle"></div>
            <div className="windowCircle"></div>
            <div className="windowCircle"></div>
        </div>
        <div className="consoleContent" ref={consoleContent}>

            {true && <>
              <div className="consoleLine">
                <span>\\joshua{'>'}&nbsp;</span>
                <Typist startDelay={400} onTypingDone={()=>setShowLineTwo(true)}
                  avgTypingDelay={50} stdTypingDelay={12}
                  cursor={{blink:true, hideWhenDone:true, hideWhenDoneDelay:0}}>
                  <span className="typed">cd portfolio</span>
                </Typist>
              </div>
              {showLineTwo && <div className="consoleLine">
                  <span>\\joshua\portfolio{'>'}&nbsp;</span>
                  <Typist startDelay={300} onTypingDone={()=>setTimeout(() => setClearFirstLines(true), 500)}
                    avgTypingDelay={50} stdTypingDelay={12}
                    cursor={{blink:true, hideWhenDone:true, hideWhenDoneDelay:0}}>
                    <span className="typed">python3 init.py</span>
                  </Typist>
              </div>}
            </>}

            {clearFirstLines && <>
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
            </>}

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