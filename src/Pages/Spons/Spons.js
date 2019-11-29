import React,{Component} from "react";
import './Spons.css'
import {Helmet} from "react-helmet";
import Theme from "../Home/Components/night_theme/theme"
import Spons from "../Components/Spons/Spons";
class Sponspage extends Component {

  render(){
  return (
    <div>
      <Helmet>
          <title>Aavartan 2019 Sponsors NIT Raipur</title>
          <meta name="description" content="Acknowledging the importance of technical fest like AAVARTAN , there are many brands who have stepped forward to become our sponsors.." />
          <meta name="keywords" content="nit raipur nitrr aavartan avartan 2019 tech techfest central india vigyaan vigyan nit chhattisgarh website awesome best performance technical national largest"></meta>
          
      </Helmet>
      <Theme/>
      <Spons />
      
    </div>
  );
}
}

export default Sponspage;
