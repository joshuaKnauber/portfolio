import React, { useEffect, useState } from "react";
import Typist from 'react-typist';

import Console from './Console';
import "./Header.css";


export default function Header() {

  return (
    <div className="headerContent">
      {/* <Console/> */}
      <div className="textHeader">
        <p className="titleBig">placeholder text</p>
        <p>placeholder text</p>
        <div className="scrollIndicatorContainer"></div>
      </div>
    </div>
  );
}