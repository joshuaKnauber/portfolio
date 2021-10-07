import React, { useEffect, useState } from "react";
import Typist from 'react-typist';

import Console from './Console';
import "./Header.css";


export default function Header() {

  return (
    <div className="headerContent">
      <Console/>
    </div>
  );
}