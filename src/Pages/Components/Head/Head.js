import React, {Component} from 'react';
import './Head.css';



class head extends Component {
    render(){
  return (
    <div>
    {/* <h1 className="h1_style">Executive Web Team</h1> */}

        <div className="card__collection">
        <div className="cards cards--two">
            <img src='/heads/1.jpg' alt="Aditya Swarnkar"/>
                <span className="cards--two__rect"></span>
                <span className="cards--two__tri"></span>
                <p>Aditya Swarnkar</p>
                <ul>
                    <li><a className="fa fa-facebook" href="https://www.facebook.com/aditya.sony149" target="_blank" rel="noopener noreferrer"></a></li>
                </ul>
                
        </div>
        <div className="cards cards--two">
                <img src='/heads/8.png' alt="Ayush Mishra"/>
                <span className="cards--two__rect"></span>
                <span className="cards--two__tri"></span>
                <p>Ayush Mishra</p>
                {/* <ul>
                    <li><a className="fa fa-facebook" href="https://m.facebook.com/photo.php?fbid=1676064295828522&id=100002749024369&set=a.101860866582214&source=11&ref=bookmarks" target="_blank" rel="noopener noreferrer"></a></li>
                </ul> */}
            </div>
        <div className="cards cards--two">
                <img src='/heads/42.jpg' alt="Manyata Agrawal"/>
                <span className="cards--two__rect"></span>
                <span className="cards--two__tri"></span>
                <p>Manyata Agrawal</p>
                <ul>
                    <li><a className="fa fa-facebook" href="https://m.facebook.com/photo.php?fbid=1676064295828522&id=100002749024369&set=a.101860866582214&source=11&ref=bookmarks" target="_blank" rel="noopener noreferrer"></a></li>
                </ul>
            </div>
           
            <div className="cards cards--two">
                <img src='/heads/7.jpeg' height="100%" alt="Namrata khoriya"/>
                <span className="cards--two__rect"></span>
                <span className="cards--two__tri"></span>
                <p>Namrata khoriya</p>
                <ul>
                    <li><a className="fa fa-facebook" href="https://www.facebook.com/namrata.khoriya" target="_blank" rel="noopener noreferrer"></a></li>
                </ul>
            </div>
            <div className="cards cards--two">
                <img src='/heads/3.jpg' height="100%" alt="Prabhat Shukla"/>
                <span className="cards--two__rect"></span>
                <span className="cards--two__tri"></span>
                <p>Prabhat Shukla</p>
                <ul>
                    <li><a className="fa fa-facebook" href="https://www.facebook.com/prabhatnick" target="_blank" rel="noopener noreferrer"></a></li>
                </ul>
            </div>
            <div className="cards cards--two">
                <img src='/heads/6.jpg' alt="Ritik Garg"/>
                <span className="cards--two__rect"></span>
                <span className="cards--two__tri"></span>
                <p>Ritik Garg</p>
                <ul>
                    <li><a className="fa fa-facebook" href="https://www.facebook.com/ritikgarg1998" target="_blank" rel="noopener noreferrer"></a></li>
                </ul>
            </div>
           
            <div className="cards cards--two">
                <img src='/heads/2.jpg' height="100%" alt="Shilpa Kumari"/>
                <span className="cards--two__rect"></span>
                <span className="cards--two__tri"></span>
                <p>Shilpa Kumari</p>
                <ul>
                    <li><a className="fa fa-facebook" href="https://m.facebook.com/shilpa.kumari.26/" target="_blank" rel="noopener noreferrer"></a></li>
                </ul>
            </div>
            <div className="cards cards--two">
                <img src='/heads/5.jpg' height="100%" alt="SUHAS"/>
                <span className="cards--two__rect"></span>
                <span className="cards--two__tri"></span>
                <p>SUHAS</p>
                <ul>
                    <li><a className="fa fa-facebook" href="https://www.facebook.com/suhas.ksrisai" target="_blank" rel="noopener noreferrer"></a></li>
                </ul>
            </div>
           
    </div>
    </div>
    );
  }
}

export default head;
