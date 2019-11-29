import React from "react";
import {Helmet} from "react-helmet";
import Theme from "../Home/Components/night_theme/theme"
import Demo4 from "../Components/Gallery/Gallery";
function Gallery() {
  return (
    <div>
      <Helmet>
          <title>Aavartan 2019 Gallery NIT Raipur</title>
          <meta name="description" content="Pictures says a 1000 words and these pictures clearly depict the grandeur of AAVARTAN the technical fest of NITRR.. We have tried out not miss any emotions that students go through while experiencing the techfest of NIT Raipur.." />
          <meta name="keywords" content="nit raipur nitrr aavartan avartan 2019 tech techfest central india vigyaan vigyan nit chhattisgarh website awesome best performance technical national largest"></meta>
          
      </Helmet>
     <Theme />
      <div>

        <div style={{margin:"5%"}}>
          <Demo4 />
        </div>
      </div>
    </div>
  );
}

export default Gallery;
