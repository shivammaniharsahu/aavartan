import React, { Component } from "react";
import $ from "jquery";
import { Helmet } from "react-helmet";
import Theme from "../Home/Components/night_theme/theme";
import Footer from "../Components/Footer/Footer";
import Countdown from "../Components/Countdown/Countdown";
import Highlight from "./highlight_cards/highlight";
import "./newhome.css";
class newhome extends Component {
  componentDidMount() {
    $(".counting").each(function() {
      var $this = $(this),
        countTo = $this.attr("data-count");

      $({ countNum: $this.text() }).animate(
        {
          countNum: countTo
        },

        {
          duration: 6000,
          easing: "linear",
          step: function() {
            $this.text(Math.floor(this.countNum));
          },
          complete: function() {
            $this.text(this.countNum);
            //alert('finished');
          }
        }
      );
    });
  }
  render() {
    return (
      <div style={{ zIndex: "-1000" }}>
        <Helmet>
          <title>Aavartan 2019 NIT Raipur</title>
          <meta
            name='description'
            content="Aavartan is central India's largest tech fest. It is organised by Team TechnoCracy , the technical committee of NIT Raipur. Aavartan has a footfall of more than 10,000 people and a reach of over 150+ Indian colleges.
Aavartan is the ultimate goal of Technocracy and such a  common goal binds the whole group together strongly. There is a hard working and dedicated team whose members are specialised in specific fields crucial to the management of such a big event. The fields we specifically look into are Media and Marketing, public relation , web and app , public relation , design and creativity..
With a vision to bring into light the students' Technical skills and aptitude, Aavartan 2019 is going to be a grand event!"
          />
          <meta
            name='keywords'
            content='nit raipur nitrr aavartan avartan 2019 tech techfest central india vigyaan vigyan nit chhattisgarh website awesome best performance technical national largest'
          ></meta>
        </Helmet>

        {/* <Navbar /> */}
        {/* <Navbar/> */}
        <Theme />

        <div className='home_head'>
          <h1 className='home_font'>Aavartan 2019</h1>
          <h4 className='home_font1'>21 & 22 September</h4>
          <br />
          <h4 className='home_font1'>imagine improve implement</h4>
        </div>
        <div className='columns column-height'>
          <div className='column is-vcentered'></div>
          <div className='column is-half'>
            <div>
              <Countdown style={{ zIndex: "-1" }} />
            </div>
          </div>
          <div className='column'></div>
        </div>
        <div style={{ marginTop: "6%" }}>
          <div className='about_section'>
            <h1 className='about_head'>About Us</h1>
            <div className='inner_container'>
              <p>
                Started in 2007 with the aim of inspiring technology, innovation
                and scientific thinking, AAVARTAN is now accepted as Central
                India’s Largest Science and Technological fest with a footfall
                of more than 10,000 yearly and a reach of over 150+ Indian
                Colleges.In its attempt to provide a national platform for the
                youth to showcase their talents and skills in aggressive
                competitions, displaying latest technology and having renowned
                personalities motivate the youth and providing solutions to
                various significant problems, AAVARTAN endeavours for one and
                all to get inspired and look up to.
              </p>

              <section
                id='counter-stats'
                className='wow fadeInRight'
                data-wow-duration='1.4s'
              >
                <div className='columns about_description is-centered'>
                  <div className='column is-one-quarter-desktop is-two-quarter-tablet is-full-mobile'>
                    <div className='about_button'>
                      <div
                        className='counting about_button_h2'
                        data-count='150'
                      >
                        0
                      </div>
                      <h3 className='about_button_h3'>COLLEGES</h3>
                      <i className='fa fa-bank'></i>
                    </div>
                  </div>
                  <div className='column is-one-quarter-desktop is-two-quarter-tablet is-full-mobile'>
                    <div className='about_button'>
                      <div
                        className='counting about_button_h2'
                        data-count='10000'
                      >
                        0
                      </div>
                      <h3 className='about_button_h3'>FOOTFALL</h3>
                      <i className='fa fa-users'></i>
                    </div>
                  </div>
                  <div className='column is-one-quarter-desktop is-two-quarter-tablet is-full-mobile'>
                    <div className='about_button'>
                      <div className='counting about_button_h2' data-count='30'>
                        0
                      </div>
                      <h3 className='about_button_h3'>EVENTS</h3>
                      <i className='fa fa-calendar'></i>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className='highlight' style={{ backgroundColor: "#0A0A05" }}>
            <h2 className='home_font2'>HIGHLIGHTS</h2>
            <Highlight />
            {/* <img className="highlight-image" src={photo}/> */}
          </div>
          <div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default newhome;
