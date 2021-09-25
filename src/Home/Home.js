import './Home.css';
import {
  Link
} from "react-router-dom";


export default function Home() {
  return (
    <div className="home-container">
        <div className="work-links">
            <Link to="/tesla">Tesla</Link>
        </div>
        <p className="contact-link" onClick={() => {
            alert("contact")
        }}>contact&nbsp;&nbsp;|&nbsp;&nbsp;<span>@joshua knauber</span></p>
    </div>
  );
}
