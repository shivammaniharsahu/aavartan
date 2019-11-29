import React, { Component } from "react";

import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="main-footer-container is-centered">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="container-foot">
                <a
                  className="fb"
                  href="https://www.facebook.com/NITRR.Aavartan/" target="_blank"  rel="noopener noreferrer"
                  style={{ color: "white" }}
                >
                  <i
                    className="fa fa-facebook"
                    style={{ fontSize: "30px", marginRight: "2%" }}
                  />
                </a>
                <a
                  className="tw"
                  href="https://twitter.com/nitrr_aavartan" target="_blank"  rel="noopener noreferrer"
                  style={{ color: "white" }}
                >
                  <i
                    className="fa fa-twitter"
                    style={{ fontSize: "30px", marginRight: "3%" }}
                  />
                </a>

                <a
                  className="insta"
                  href="https://www.instagram.com/nitrr.aavartan/?hl=en" target="_blank"  rel="noopener noreferrer"
                  style={{ color: "white" }}
                >
                  <i
                    className="fa fa-instagram"
                    style={{ fontSize: "30px", marginRight: "3%" }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="columns is-vcentered">
          <div
            className="column is-12"
            style={{ marginTop: "0%", textAlign: "center", color: "white" }}
          >
            <span className="footer-text">
              Made with <span id="heart">❤️</span> Technocracy Web Team
            </span>
          </div>
        </div>


      </div>
    );
  }
}

export default Footer;
