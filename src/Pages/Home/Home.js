import React from "react";
import Background from "./Components/SpacecraftBackground/bg";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/navbar";
import Theme from "./Components/night_theme/theme";

function Home() {
  return (
    <div className="Home">
      <Navbar/>
      <Theme style={{height:"100vh",width:"100vw"}}/>
      <div className="container">
        <h1 style={{fontSize:'60px',textAlign:"center"}}>Aavartan -2k19</h1>
      </div>
     <div className="columns" style={{marginTop:"15vh"}}>
       <div className="column is-vcentered"></div>
      <div className="column is-half">
      
      </div>       
      <div className="column"></div>
     </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
