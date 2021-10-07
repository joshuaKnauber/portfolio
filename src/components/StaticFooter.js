import React from "react";
import { FaEnvelope } from 'react-icons/fa';


export default function StaticFooter() {
  return (
    <div className="staticFooterContainer">
      <div className="iconContainer">
        <FaEnvelope size={16} />
      </div>
    </div>
  );
}