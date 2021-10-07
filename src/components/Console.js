import React, { useEffect, useState, useRef } from "react";
import Typist from 'react-typist';
import { useSpring, animated } from 'react-spring';

import "./Console.css";


export default function Console() {

  const [showLineTwo, setShowLineTwo] = useState(false)

  const [clearFirstLines, setClearFirstLines] = useState(false)

  const [copiedEmail, setCopiedEmail] = useState(false)

  const messages = [
    [["Hi! I'm Joshua", "typed"]],
    [["I love designing", "typed"], ["unique but usable solutions", "highlighted"], ["that help people", "typed"]],
    [["", "typed"]],
    [["I'm currently studying", "typed"], ["Interaction Design at CODE University", "https://www.code.berlin/en/study/interaction-design/"], ["in Berlin", "typed"]],
    [["I work on UI, UX, frontend programming and also do some 3D art", "typed"]],
    [[" ", "typed"]],
    [["  ", "typed"]],
    [["▼ Scroll down ▼", "highlighted"], ["to see some of my projects and some of the things I like", "typed"]],
    [["[E-Mail]", "link"], ["Twitter", "https://twitter.com/joshuaKnauber"], ["Artstation", "https://joshuaknauber.artstation.com/"]],
  ]
  const [messageIndex, setMessageIndex] = useState(0);

  const consoleContent = useRef();

  useEffect(() => {
    if (!clearFirstLines) return

    let timeout;
    if (messageIndex < messages.length - 1) {
      timeout = setTimeout(() => setMessageIndex(messageIndex + 1), 1000);
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

            {!clearFirstLines && <>
              <div className="consoleLine">
                <span>C:\Users\joshua{'>'}&nbsp;</span>
                <Typist startDelay={600} onTypingDone={()=>setShowLineTwo(true)}
                  cursor={{blink:true, hideWhenDone:true, hideWhenDoneDelay:0}}>
                  <span className="typed">cd Desktop</span>
                </Typist>
              </div>
              {showLineTwo && <div className="consoleLine">
                  <span>C:\Users\joshua\Desktop{'>'}&nbsp;</span>
                  <Typist startDelay={600} onTypingDone={()=>setTimeout(() => setClearFirstLines(true), 500)}
                    cursor={{blink:true, hideWhenDone:true, hideWhenDoneDelay:0}}>
                    <span className="typed">python3 init.py</span>
                  </Typist>
              </div>}
            </>}

            {clearFirstLines && <>
              {messages.filter((_, index) => {return index <= messageIndex}).map(msg =>
                <div className="consoleLine" key={JSON.stringify(msg)}>
                  <span>{'>>>'}&nbsp;&nbsp;</span>
                  <Typist startDelay={0} avgTypingDelay={2} stdTypingDelay={2}
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
                {<span className={"typed"}>Copied E-Mail (<span className="special">joshua.knauber@gmail.com</span>)</span>}
              </Typist>
            </div>}

        </div>
    </div>
  );
}