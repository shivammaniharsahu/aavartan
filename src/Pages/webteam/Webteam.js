import React,{Component} from "react";
// import './team.css'
// import Team from "../Components/Team/Team";
import Theme from "../Home/Components/night_theme/theme"
import Webteam from "../Components/webteam/webteam";
class webteampage extends Component {

  render(){
  return (
    <div>
      <Theme />
      <Webteam />
      
    </div>
  );
}
}

export default webteampage;
