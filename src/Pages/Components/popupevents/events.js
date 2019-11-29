import React, { Component } from "react";
import $ from "jquery";
import "./events.css";
import { Helmet } from "react-helmet";
import OTPmodal from "../OTPmodal/OTPmodal";
import Theme from "../../Home/Components/night_theme/theme";
import RegisterOptions from "../RegisterOptions/RegisterOptions";
class Pevents extends Component {
  state = {
    otp: "",
    otpModelShow: false,
    key: "",
    userEvents: this.props.REGevents,
    isUserLoggedIn: "wait"
  };

  getFromLS = async () => {
    let database = await window.localStorage.getItem("browserDataAavartan");
    if (database == "undefined") {
      return undefined;
    } else {
      return JSON.parse(database);
    }
  };
  toggleOTPmodel = () => {
    this.setState(prevState => ({
      otpModelShow: !prevState.otpModelShow
    }));
  };
  closeOTPmodel = () => {
    this.setState({ otpModelShow: false });
  };
  getFromLS = async () => {
    let database = await window.localStorage.getItem("browserDataAavartan");
    if (database == "undefined") {
      return undefined;
    } else {
      return JSON.parse(database);
    }
  };
  dumpToLS = async database => {
    await window.localStorage.setItem(
      "browserDataAavartan",
      JSON.stringify(database)
    );
  };

  getUserRegistered = async (key, eventNumber) => {
    let url = `https://cors-anywhere.herokuapp.com/http://aavartan.nitrr.ac.in:8000/user/register/?event_id=${eventNumber}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${key}`
      }
    });

    return response.json();
  };

  registerForEvent = eventNumber => {
    this.getFromLS().then(data => {
      // IF USER IS LOGGED IN
      if (data === undefined || data == null) {
        alert("Please login to register for events");
      } else {
        if (data.loggedIn) {
          this.setState({ key: data.currentUser.key });
          this.getUserRegistered(data.currentUser.key, eventNumber).then(
            dataAfterEventRegRequest => {
              if (dataAfterEventRegRequest.message == "Please Verify first") {
                // WHEN USER WAS NOT VERIFIED
                this.setState({ otpModelShow: true });
              } else {
                // WHEN USER WAS  VERIFIED
                // Adding to state
                this.props.eventAdder(eventNumber);
                // adding to LS
                let database = {
                  loggedIn: true,
                  // details of logged in
                  currentUser: {
                    name: data.currentUser.name,
                    id: data.currentUser.id,
                    key: data.currentUser.key,
                    events: this.props.REGevents
                  }
                };
                this.dumpToLS(database);
              }
            }
          );
          // IF USER IS LOGGED OUT
        } else {
          alert("Please login to register for events");
        }
      }
    });
  };
  componentWillReceiveProps() {
    //  WHEN LOGOUT OR LOGIN IS PERFORMED OF THIS FILE IS CHANGED BY NAVBAR
    this.setState({
      isUserLoggedIn: this.props.logState,
      userEvents: this.props.REGevents
    });
  }
  componentDidMount() {
    // Updating user events in state from LS
    this.getFromLS().then(database => {
      if (database == undefined) {
        this.setState({
          isUserLoggedIn: false,
          userEvents: []
        });
      } else {
        this.setState({
          isUserLoggedIn: database.loggedIn,
          userEvents: database.currentUser.events,
          key: database.currentUser.key
        });
      }
    });
    // Listening to LS changes

    // adding Register function to all butons
    var eventRegButton = document.getElementsByClassName("eventRegButton");
    for (var i = 0; i < eventRegButton.length; i++) {
      eventRegButton[i].addEventListener("click", this.registerForEvent, false);
    }

    var num = $(".circle");
    var previous = $(".lft");
    var next = $(".rght");

    //////////modal11 OPENS ON card11 CLICK/TAP
    $(".circle").click(function(e) {
      //alert(num.index(this));
      //get index of card11 to open corresponding modal11
      $(".modal11")
        .eq(num.index(this))
        .addClass("active");
      e.preventDefault();
    });

    //////////modal11 CLOSE ON X CLICK/TAP
    $(".modal11-close").click(function(e) {
      $(".modal11").removeClass("active");
      e.preventDefault();
    });

    //////////PREVIOUS ARROW
    $(".lft").click(function(e) {
      // remove transition
      $(".modal11").addClass("no-transition");
      //hides current modal11
      $(".modal11")
        .eq(previous.index(this))
        .removeClass("active");
      //opens next modal11
      $(".modal11")
        .eq(previous.index(this) - 1)
        .addClass("active");
      // return to transition after 0.3s
      setTimeout(function() {
        $(".modal11").removeClass("no-transition");
      }, 300);
      e.preventDefault();
    });

    //////////NEXT ARROW
    $(".rght").click(function(e) {
      // remove transition
      $(".modal11").addClass("no-transition");
      //hides current modal11
      $(".modal11")
        .eq(next.index(this))
        .removeClass("active");
      //opens next modal11
      $(".modal11")
        .eq(next.index(this) + 1)
        .addClass("active");
      // return to transition after 0.3s
      setTimeout(function() {
        $(".modal11").removeClass("no-transition");
      }, 300);
      e.preventDefault();
    });

    //////////LAST NEXT ARROW
    $(".last-next").click(function(e) {
      // remove transition
      $(".modal11").addClass("no-transition");
      //hides current modal11
      $(".modal11")
        .eq(next.index(this))
        .removeClass("active");
      //opens first modal11
      $(".modal11")
        .eq(0)
        .addClass("active");
      // return to transition after 0.3s
      setTimeout(function() {
        $(".modal11").removeClass("no-transition");
      }, 300);
      e.preventDefault();
    });
  }
  render() {
    return (
      <div className='Events'>
        <Helmet>
          <title>Aavartan 2019 Events NIT Raipur</title>
          <meta
            name='description'
            content='Aavartan 2k19 has wide range of events that are specifically designed to test the technical aptitudes and skills of students. Aavartan is just not limited to mind engaging  technical events but also has a good line of adventure and fun events for giving students a recreational time...'
          />
          <meta
            name='keywords'
            content='nit raipur nitrr aavartan avartan 2019 tech techfest central india vigyaan vigyan nit chhattisgarh website awesome best performance technical national largest'
          ></meta>
        </Helmet>
        <Theme />
        {/* <StarBG /> */}
        {this.state.otpModelShow ? (
          <OTPmodal
            closeFunction={this.closeOTPmodel}
            Userkey={this.state.key}
          />
        ) : (
          ""
        )}
        <h2 className='event_head' style={{ marginTop: "3%" }}>
          TECHNICAL EVENTS
        </h2>
        <div className='container11'>
          <div className='card11'>
            <div className='circle'>
              <img src='/events/technical/1quize.jpg' alt='MIND PLAYER' />
            </div>
            <h2 className='name'>MIND PLAYER</h2>
            <RegisterOptions
              eventNo={13}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img src='/events/technical/2cadalyst.jpg' alt='CADALYST' />
            </div>
            <h2 className='name'>CADALYST</h2>
            <RegisterOptions
              eventNo={2}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img src='/events/technical/3enigma.jpg' alt='ENIGMA 3.O' />
            </div>
            <h2 className='name'>ENIGMA 3.O</h2>
            <RegisterOptions
              eventNo={15}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img src='/events/technical/4 circuitrix.jpg' alt='CIRCUITRIX' />
            </div>
            <h2 className='name'>CIRCUITRIX</h2>
            <RegisterOptions
              eventNo={3}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/technical/5 popsic tower.jpg'
                alt='POPSIC TOWER'
              />
            </div>
            <h2 className='name'>POPSIC TOWER</h2>
            <RegisterOptions
              eventNo={5}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/technical/6 gravity control.jpg'
                alt='GRAVITY CONTROL'
              />
            </div>
            <h2 className='name'>GRAVITY CONTROL</h2>
            <RegisterOptions
              eventNo={31}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>
          <div className='card11'>
            <div className='circle'>
              <img src='/events/technical/7 code hunt.jpg' alt='CODE HUNT' />
            </div>
            <h2 className='name'>CODE HUNT</h2>
            <RegisterOptions
              eventNo={9}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img src='/events/technical/8 pipomania.jpg' alt='PIPOMANIA' />
            </div>
            <h2 className='name'>PIPOMANIA</h2>
            <RegisterOptions
              eventNo={12}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>
          <div className='card11'>
            <div className='circle'>
              <img src='/events/technical/9 technoquiz.jpg' alt='TECHNOQUIZ' />
            </div>
            <h2 className='name'>TECHNOQUIZ</h2>
            <RegisterOptions
              eventNo={20}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>
          <div className='card11'>
            <div className='circle'>
              <img src='/events/technical/10 khet.jpg' alt='KHET' />
            </div>
            <h2 className='name'>KHET</h2>
            <RegisterOptions
              eventNo={17}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/technical/1quize.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px", color: "white" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>MIND PLAYER (IEEE)</h1>
              <br />
              <h3>Description:</h3>
              <p>
                {" "}
                ………..is a tech quiz which aims at testing the basic technical
                knowledge of the participants. The students can participate in a
                team of 2. The event will be held in 2 rounds.{" "}
              </p>
              <p>
                {" "}
                Round 1 will be an aptitude test which will test the EQ and IQ
                of the students. The shortlisted teams will move on to compete
                in Round 2.{" "}
              </p>
              <p>
                {" "}
                Round 2 will be the final round of the event. It will be a
                buzzer quiz round. The teams will be provided with buzzers and
                ……… questions will be asked simultaneously. One who press the
                buzzer earlier will be given the opportunity to answer first.
                ……points will be awarded for each correct answer. Unnecessary
                use of buzzer will result in deduction of points. The team with
                most points in the end wins.{" "}
              </p>
              <br />
              <h3>Requirements:</h3>
              <p> Printed Question Paper for round 1</p>
              <p> Buzzers </p>

              <br />
              <h3>Venue:</h3>
              <p>Architecture Auditorium</p>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/technical/2cadalyst.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>CADALYST</h1>
              <p>
                In this event participants will be given a chance to showcase
                their knowledge and skills in AutoCAD software. Students will be
                given the dimensions of an object and they will have to design a
                3D model of the object in Auto CAD in the given time.
              </p>
              <br />
              <h3>Description:</h3>
              <p> This event will be conducted in two rounds. </p>
              <p>Round 1: Aptitude test — </p>
              <p>
                {" "}
                This round is will be an aptitude test. 30 questions will be
                given to the students will a time limit of 30 minutes. Questions
                will be related to the Auto CAD software and general aptitude.{" "}
              </p>
              <p>Round 2: Final round </p>
              <p>
                {" "}
                In this round students will be given the dimensions of an object
                and they will have to make a 3D design of the object in Auto CAD
                in given time limit.
              </p>
              <br />
              <h3>RULES:</h3>
              <p>
                (a) 1.Use of internet, smart phones and tutorial videos is
                strictly prohibited. Anyone caught using any of the above means
                will be immediately disqualified.{" "}
              </p>
              <p>(b) 2.A team should not have more than 3 members.</p>
              <br />
              <h3>Team Requirements:</h3>
              <p> 1.A team consists of maximum 3 members.</p>.
              <p> 2.One laptop is mandatory in each team.</p>
              <p>
                {" "}
                3.Teams must have Auto CAD software installed in their laptops
              </p>
              <br />
              <h3>Judgment criteria:</h3>
              <p>
                {" "}
                Round 1: This round will be judged on the basis of score
                obtained by the teams in aptitude test.
              </p>
              <p>
                {" "}
                Round 2: This round will be judged on the basis of time taken by
                the teams to complete the given task.
              </p>
              <br />
              <h3>Requirements:</h3>
              <p> Projector </p>
              <p>Sheets</p>
              <p>Laptop</p>
              <p>Extension cord</p>
              <br />
              <h3>Venue:</h3>
              <p>Classroom with projector</p>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/technical/3enigma.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>ENIGMA 3.0</h1>
              <br />
              <h3>Description:</h3>
              <p>
                {" "}
                The event aims to test the participants’ problem solving
                abilities as a unit and their ability to their best under
                pressure. It will be held in 3 rounds.{" "}
              </p>
              <p>
                {" "}
                Round 1 will consist of Aptitude test which will test both EQ
                and IQ of the participants. Students can participant in teams
                consisting 3 members. The shortlisted teams will participate in
                Round 2
              </p>
              <p>
                {" "}
                Round 2 will be a Group Discussion. The qualifying teams will
                fight in the final Round 3.{" "}
              </p>
              <p>
                {" "}
                Round 3 will begin with each team performing tasks assigned to
                them randomly. The number of tasks will depend on the number
                teams. The team completing the maximum number of tasks wins.{" "}
              </p>
              <br />
              <h3>Requirements:</h3>
              <p> Question Paper</p>

              <br />
              <h3>Venue:</h3>
              <p> 1.right1 Garden</p>
              <p> 2.left1 Garden (the L-side)</p>
              <p> 3.Lab (preferably Computer lab)</p>
              <p> 4.Sports area around Shiv Mandir</p>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/technical/4 circuitrix.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>CIRCUITRIX</h1>
              <p>
                This event is based solely on analysis and basic knowledge of
                electrical engineering and there will be different types of
                technical and fun activities.
              </p>
              <br />
              <h3>Description:</h3>
              <p> This event will be conducted in two rounds. </p>
              <p>Round 1: Circuit-Maze </p>
              <p>
                {" "}
                In this round teams have to find the correct path of current in
                the maze by solving circuits. Participants have to choose one
                path from different path for current to flow from the electrical
                maze provided.{" "}
              </p>
              <p>Round 2: Circuit-Treasure</p>
              <p>
                {" "}
                In this round teams have to make the provided circuit by finding
                components from Treasure Hunt.{" "}
              </p>
              <br />
              <h3>Evaluation:</h3>
              <p> Only group entries are eligible.</p>
              <br />
              <h3>Requirements:</h3>
              <p> Resistors</p>
              <p>Batteries</p>
              <p>Bread Board</p>
              <p>Pen</p>
              <p>Paper</p>
              <p>Multimeter</p>
              <p>Connecting Wires</p>

              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/technical/5 popsic tower.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>POPSIC TOWER</h1>
              <p>
                {" "}
                The participants will be given a fixed number of ice cream
                sticks using these sticks they will have to build a structure
                which is at least 25 cm above the ground and is able to hold a
                standard smartphone. The participants will be given 2 hrs.
              </p>
              <br />
              <h3>Rules And Regulations :</h3>
              <p>
                {" "}
                The judgement will be done on the basis of number of sticks a
                team has used. The team that uses less number of sticks wins. In
                case of a tie the team whose structure is higher wins the game
                .If the tie persists the structure able to hold more weight wins
              </p>
              <br />
              <h3>Team Size:</h3>
              <p> 3 Members </p>
              <br />
              <h3>Requirements:</h3>
              <p>Papers </p>
              <p>Ice Cream Sticks </p>
              <p>Adhesive </p>
              <p>Ruler </p>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/technical/6 gravity control.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>GRAVITY CONTROL</h1>
              <p> Hate Newton or love him? Well that’s none of our concern</p>
              <p> let’s just see how much you love gravity.</p>
              <br />
              <h3>Description:</h3>
              <p>
                {" "}
                If you have a basic knowledge about gravity then it would be an
                interesting task to do . All you have to do is just hold the
                ball on slanted table for more time as compared to other
                competitors.
              </p>
              <br />
              <h3>RULES AND REGULATIONS:</h3>
              <p>ROUND 1:</p>
              <p>
                {" "}
                1.A test will be conducted in a team of 2 with questions on
                physics related to science.{" "}
              </p>
              <p> 2.The top 10 teams will qualify for the second round. </p>
              <p>ROUND 2:</p>
              <p>
                {" "}
                1.In this round each group will be provided with an inclined
                table and fixed number of barriers.{" "}
              </p>
              <p>
                {" "}
                2.The sole aim of each team is to use the barriers in such a way
                that the ball takes maximum time to reach the bottom of incline.{" "}
              </p>
              <p>
                {" "}
                3.The ball should move continuously without stopping in between.{" "}
              </p>
              <p>
                {" "}
                4.The group which holds the ball on the incline for maximum time
                will emerge the winner.{" "}
              </p>
              <br />
              <h3>Requirements:</h3>
              <p>Ed Board</p>
              <p>Any classroom</p>
              <p>TT-Ball</p>
              <p>Thermocol for making obstacle</p>
              <p>Double sided tape </p>
              <p> Cutter </p>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/technical/7 code hunt.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>CODE HUNT</h1>
              <p>
                {" "}
                In this event participants will be given a chance to show their
                skills over programming in C language.{" "}
              </p>
              <br />
              <h3>Description:</h3>
              <p> This event will be conducted in two rounds. </p>
              <p>Round 1: Aptitude test </p>
              <p>
                {" "}
                This round is will be an aptitude test. 30 questions will be
                given to the students will a time limit of 30 minutes. Questions
                will be related to logical maths and general aptitude.{" "}
              </p>
              <p>Round 2: Final round </p>
              <p>
                {" "}
                It will be basically a treasure hunt round in which codes of c
                language will be given and the output will provide the hint for
                the next location where the next code will be provided by the
                volunteers. And after several outputs the team which will reach
                to the final location will be declared winner.
              </p>
              <br />
              <h3>RULES:</h3>
              <p>
                (a) Use of internet, smart phones and tutorial videos is
                strictly prohibited. Anyone caught using any of the above means
                will be immediately disqualified.{" "}
              </p>
              <p>(b) A team should not have more than 3 members.</p>
              <br />
              <h3>Team Requirements:</h3>
              <p> 1.A team consists of maximum 3 members.</p>.
              <p> 2.Each team should carry a pen.</p>
              <br />
              <h3>Judgment criteria:</h3>
              <p>
                {" "}
                Round 1: This round will be judged on the basis of score
                obtained by the teams in aptitude test.
              </p>
              <p>
                {" "}
                Round 2: The team which will reach at the last location will be
                winner.{" "}
              </p>
              <br />
              <h3>Requirements:</h3>
              <p>Pen</p>
              <p>Sheets</p>
              <br />
              <h3>Venue:</h3>
              <p>Any Classroom </p>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/technical/8 pipomania.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>PIPOMANIA</h1>
              <p>
                {" "}
                The event is based on challenge solving capability. Better
                methodology to use pipes to develop a tower like structure.
              </p>
              <br />
              <h3>Description:</h3>
              <p>
                {" "}
                Two inlets on the top. When water is poured from them, water
                must flow through all the pipes and should come out from the
                four outlets at the bottom.{" "}
              </p>
              <br />
              <h3>Team Requirements:</h3>
              <p> There will be maximum 3 participants in each group. </p>
              <br />
              <h3>Rules:</h3>
              <p> 1.Model should have two inlet and four outlets.</p>
              <p>
                {" "}
                2.For model making you have been provided only 25 main pipes and
                10 supporting pipes.
              </p>
              <p> 3.Model must be stable.</p>
              <p> 4.Model must be working.</p>
              <p>
                {" "}
                5.The cross-sectional area of model base should be minimum as it
                is stable.{" "}
              </p>
              <p> 6.Cello tape will be used only for joint making.</p>
              <p>
                {" "}
                7.Materials used, will be provided by the coordinator. Except
                these, none of the things should be used.
              </p>
              <br />
              <h3>Judging Criteria:</h3>
              <p>
                {" "}
                Winner will be considered whose model will be more stable,
                longest and water passes from all the main pipes.
              </p>
              <br />
              <h3>Requirements:</h3>
              <p>Straws</p>
              <p>Water</p>
              <p>Cello Tape</p>
              <p>Cutter</p>
              <br />
              <h3>Venue:</h3>
              <p>Central Garden</p>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/technical/9 technoquiz.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>
                TTQ ( THE TECHONOMIC QUOTIENT INTERACTCLUB)
              </h1>
              <br />
              <h3>Description:</h3>
              <p>
                {" "}
                This is an event organized by the INTERACT club during AAVARTAN,
                the Techno management fest of NIT Raipur. This is centred on the
                areas like Tech & Biz. The techonomic quotient 6.0 was a huge
                popularity not only among the students of NITRR but also the
                students of other institutes in and around Raipur.{" "}
              </p>
              <br />
              <h3>Requirements:</h3>
              <p>Speaker check</p>
              <p>Chair check</p>
              <p>Mike-2</p>
              <p>Projector</p>
              <p>Sheets (Customised)</p>
              <p>Stationary (pens)</p>
              <br />
              <h3>Venue:</h3>
              <p>E-hall</p>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght last-next'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/technical/10 khet.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>KHET</h1>
              <p>
                {" "}
                In present day we utilize a lot of big instruments which utilize
                refractive and reflective properties of light. This property has
                immense application in engineering world. Hence we bring you a
                new event which will enhance your knowledge on properties of
                light. This is a team event consisting of maximum 3 members.
              </p>
              <br />
              <h3>Event Description:</h3>
              <p> This event will be conducted in two rounds. </p>
              <p>Round 1: </p>
              <p>
                {" "}
                In this round, basically your imagination is judged based on
                concept of mirror and its properties like reflection,
                refraction, total internal reflection etc.{" "}
              </p>
              <br />
              <h3>Description of Round 1:</h3>
              <p>
                {" "}
                Each team shall be given 5min and provided 8 small pieces of
                mirror of size 8cm*8cm. The team is given a source of laser beam
                and a target and is asked to make a mirror maze, or an
                arrangement out of their imagination using concepts of multiple
                reflections and strike the target with laser beam within the
                given time.{" "}
              </p>
              <br />
              <h3>Judging Criteria of Round 1:</h3>
              <p>
                {" "}
                1.Ranking will be done according to the time taken by the team
                to hit the target.{" "}
              </p>
              <p> 2.Least time takers will be given top ranks. </p>
              <p>Round 2:</p>
              <p>
                {" "}
                Khet is a chess-like abstract strategy board game using lasers.
                Teams take turns moving Egyptian-themed pieces around the
                playing field, firing their laser after each move.{" "}
              </p>
              <br />
              <h3>Description of Round 2:</h3>
              <p>
                {" "}
                Each team starts the game with a few playing pieces, arranged in
                a pre-defined configuration and a laser. The pieces in the game
                are:{" "}
              </p>
              <br />
              <h3> Sphinx: </h3>
              <p>
                {" "}
                The Sphinxes hold the lasers. They may not move (each team's is
                located at their closest right-hand corner) but may be rotated
                in place so as to fire down the rank instead of the file. A
                Sphinx is unaffected by laser fire, whether the opponent's or
                its own reflected back upon itself.{" "}
              </p>
              <br />
              <h3> Pharaoh: </h3>
              <p>
                {" "}
                The Pharaoh is the most important piece for each side, similar
                to a king in chess. If it is hit with a laser, it is destroyed
                and its owner loses the game.{" "}
              </p>
              <br />
              <h3> Scarab: </h3>
              <p>
                {" "}
                Scarabs consist primarily of large, dual-sided mirrors. They
                reflect a laser coming in from any direction and thus cannot be
                eliminated from the board.{" "}
              </p>
              <br />
              <h3> Pyramid: </h3>
              <p>
                {" "}
                Pyramids have a single diagonal mirror, and form the primary
                mechanism for directing the path of the laser. They are
                vulnerable to a hit from two of the four sides.{" "}
              </p>
              <br />
              <h3>Obelisk: </h3>
              <p>
                {" "}
                Large pillars with no mirrored sides, these are vulnerable to
                attack from any direction, and therefore useful mostly as an
                emergency sacrifice to protect another piece (such as the
                Pharaoh).{" "}
              </p>
              <br />
              <h3> Anubis: </h3>
              <p>
                {" "}
                Anubis has the advantage that, despite still being un-mirrored,
                they are not affected by a laser strike on the front; they must
                be hit on the sides or rear in order to be eliminated.{" "}
              </p>
              <br />
              <h3>Rule And Regulations:</h3>
              <p>
                {" "}
                1.Silver moves first. Team’s alternate turns, with each team
                moving only his/her own pieces. All the pieces, including
                Pharaohs, can be moved.{" "}
              </p>
              <p>
                {" "}
                2.Each team has a Sphinx which contains a laser. It is not a
                playing piece and cannot be eliminated from play. It is located
                in its special corner space. The Sphinx can be rotated to point
                the laser down either the first column or the first row and is
                only optional. If a team chooses to rotate the Sphinx as his/her
                turn, it must be rotated before the head is pushed and the laser
                is fired .
              </p>
              <p>
                {" "}
                3.A turn consists of moving any one piece one step in any
                direction (including diagonally) or of rotating a piece a
                quarter turn (90 degrees) in either direction without changing
                squares. A piece cannot be moved and rotated on the same turn or
                rotated more than a quarter twist on one turn.{" "}
              </p>
              <p>
                {" "}
                4.No red piece, including a Scarab, can move into any square
                containing a silver mark. No silver piece, including a Scarab,
                can move into any square containing a red mark that are located
                along portions of the edges of the board.
              </p>
              <p>
                {" "}
                5.Except for the Scarab, no piece can move into a square
                occupied by another piece of either colour.{" "}
              </p>
              <p>
                {" "}
                6.The Scarab can swap places with an adjacent Pyramid or Anubis,
                but not with a Pharaoh or another Scarab piece. Neither piece
                rotates during the swap.{" "}
              </p>
              <p>
                {" "}
                7.If the laser beam stops on a non-mirrored surface of a Pyramid
                that piece is removed from the board.{" "}
              </p>
              <p>
                {" "}
                8.If the laser beam stops on the front side of an Anubis piece,
                the Anubis is not removed from the board and the turn is
                over—this piece is impervious to a hit on its front. If the
                laser beam strikes a side or back of an Anubis, that piece is
                removed from the board.{" "}
              </p>
              <p>
                {" "}
                9.The laser is fired only once at the end of a team’s turn. The
                turn is over whether or not a piece is hit. Teams may not test
                where the beam will go by firing the laser before completing
                their moves.
              </p>
              <p>
                {" "}
                10.The game ends when a beam illuminates a Pharaoh. The winner
                is the team whose Pharaoh wasn’t hit. A team who illuminates his
                or her own Pharaoh is out of luck.{" "}
              </p>
              <br />
              <h3>Judgment criteria:</h3>
              <p> 1.The team which completes the game in least time wins. </p>
              <p>
                {" "}
                2.If two teams complete the game in same time, then the one with
                least number of hits is declared winner.{" "}
              </p>
              <br />
              <h3>Requirements:</h3>
              <p> Mirror 8*8 cm - 10 </p>
              <p>Laser Source</p>
              <p>Thermocol Sheets </p>
              <p>Water Colours </p>
              <p>Double Tape </p>
              <p> Cellotape-5(thick)</p>
              <p>Thermocol Cutter </p>
              <p> Fevicol</p>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght last-next'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className='event_head'>ROBOTICS EVENTS</h2>
        <div className='container11'>
          <div className='card11'>
            <div className='circle'>
              <img src='/events/robotics/1 aqua bot.jpeg' alt='AQUA BOT' />
            </div>
            <h2 className='name'>AQUA BOT</h2>
            <RegisterOptions
              eventNo={6}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img src='/events/robotics/2 robosoccer.jpeg' alt='ROBO SOCCER' />
            </div>
            <h2 className='name'>ROBO SOCCER</h2>
            <RegisterOptions
              eventNo={10}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/robotics/3 maze runner.jpeg'
                alt='MAZE RUNNER'
              />
            </div>
            <h2 className='name'>MAZE RUNNER</h2>
            <RegisterOptions
              eventNo={7}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/robotics/4 terrain treader.png'
                alt='TERRAIN TREADER'
              />
            </div>
            <h2 className='name'>TERRAIN TREADER</h2>
            <RegisterOptions
              eventNo={11}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/robotics/1 aqua bot.jpeg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>AQUA BOT </h1>
              <br />
              <p>
                Make a bot that can swim its way through the water. Wired or
                autonomous it must clear the track through the water by
                performing various assigned tasks.{" "}
              </p>
              <br />
              <h3>Description: </h3>
              <br />
              <p>
                Set your rudders, gun your propellers and cut through choppy
                waves in this one of a kind Manual controlled robot event. Make
                a simple RC/Manual robot and run it in a competition to outpace
                your competitor. Design and construct a robot capable of running
                on water surface.{" "}
              </p>
              <br />
              <p>The competition will consist of two rounds. </p>
              <br />
              <p>1. Qualifying round </p>
              <br />
              <p>2. Final round.</p>
              <br />
              <p>ROBO SPECIFICATION </p>
              <br />
              <p>
                • The robot should fit in a box of dimension 30 cm x 30 cm x
                30cm (l*b*h) at every given point of the race. <br />
                • Teams can use both wireless and wired remote controls for
                controlling the bot. <br />
                • The external wireless/wired remote control used to control the
                robot is not included in the size constraint. <br />
                • Maximum voltage between any two terminals should not be more
                than 24 V DC. <br />
                • In case of wired the length of wire must be minimum 3 meters
                and maximum 6 meters. <br />
                • Teams can use any mode of power supply (on-board or
                off-board). An external AC power supply will be supplied from a
                three pin socket. <br />• Violating these clauses will lead to
                the straight disqualification of the team.{" "}
              </p>
              <br />
              <h3>ROUND-1: QUALIFYING ROUND </h3>
              <p>
                • In this round the robot has to travel from starting point to
                end point by bursting the balloon placed in intermediate
                positions. <br />• For bursting a single balloon 20 points will
                be awarded. <br />
                • The maximum time given for the task is 5 minutes. <br />• Top
                teams will be selected on the basis of no. of points scored and
                time taken to complete task.{" "}
              </p>
              <br />
              <h3>ROUND-2: FINAL ROUND </h3>
              <br />
              <p>
                • In this round, the robot has to travel from starting point to
                end point by picking cubes and balls placed at intermediate
                positions.
                <br />
                • In intermediate position the robot first has to burst balloon
                then only it can start picking up cubes and balls. <br />
                • After picking, the robot has to reach end point within
                allotted time otherwise no points will be given to team for
                whatever it has picked. <br />• For every ball picked-10 points,
                smaller cube picked-20 points, big cube picked- 30 points
                respectively will be given. <br />
                • For bursting balloon 20 points will be awarded <br />• The
                maximum time given for the task is 7 minutes.{" "}
              </p>
              <br />
              <h3>DIMENSIONS </h3>
              <br />
              <p>
                • Smaller cube is of size 6cm*6cm*6cm (l*b*h) <br />
                • Big cube is of size 9cm*9cm*9cm (l*b*h) <br />• Ball diameter
                – 5 cm{" "}
              </p>
              <br />
              <h3>Rules: </h3>
              <br />
              <p>
                • A team may consist of maximum of 4 members. <br />
                • Readymade kits are not allowed. <br />
                • Teams will have to report at least 15 minutes before the time
                slot allotted to them at the beginning of event, failing to do
                so may result in disqualification. <br />
                • No last minute repairs will be allowed in the arena. <br />•
                Organizers reserve the rights to change the rules at any point
                of time as they deem fit.{" "}
              </p>
              <br />
              <h3>Judging Criteria: </h3>
              <br />
              <p>
                Winner will be decided on basis of maximum points earned by
                team. In case of tie time will be the factor for deciding the
                winner.{" "}
              </p>
              <br />
              <h3>Venue: </h3>
              <br /> <p>Central Garden </p>
              <br />
              <h3>Prizes: </h3>
              <p>
                1st Prize INR 5000/- <br />
                2nd Prize INR 3000/-
              </p>
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/robotics/2 robosoccer.jpeg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>ROBO SHOOT </h1>
              <br />
              <p>
                Soccer for Robots! Score big win bigger. This competition is to
                show how good and swift robot of yours can be by playing soccer
                using it and scoring more goals. Numerous colleges participated
                in the event in which your robot has to score a goal against the
                opponent's robot.{" "}
              </p>
              <br />
              <h3>Description: </h3>
              <br />
              <p>
                For all who have passion in Robotics or Sports, AAVARTAN’19
                presents ‘ROBO-SHOOT’. This competition is to show how good and
                swift your robot can be, by playing soccer and scoring more
                goals. This event is a platform for participants to showcase
                their robotics talents and also to bring alive the football
                spirit. Their robot controlling and ball shooting skills will be
                raised above their sky high limits.{" "}
              </p>
              <br />
              <p>
                They are required to build manually controlled wired or wireless
                bots capable of playing soccer on an arena specially designed
                for the robotic soccer match. Teams will have to play a football
                match against other team. 2 minutes of setup time will be
                provided to each team for pregame setup and testing. Each match
                will consist of two halves of 6 minutes each. Ball will be
                placed at the centre of the arena at the starting of the match.{" "}
              </p>
              <br />
              <h3>ROBOT SPECIFICATIONS </h3>
              <br />
              <p>
                1. The robot must fit into a cube of (30x30x30) cm at all times.
                It may not expand at any time during the match beyond this size
                even for hitting the ball. Violating this clause will lead to
                immediate disqualification. <br />
                2. Teams can use both on board and off board circuits for
                communication with computer. The bots can have on board as well
                as off board power supply. Teams will be provided 220 volts 50
                Hz AC supply. <br />
                3. The maximum potential difference between any two points on
                the robot should not exceed 24 volts.{" "}
              </p>
              <br />
              <h3>Rules: </h3>
              <br />
              <h3>GENERAL RULES</h3> <br />
              <p>
                1. A team may consist of maximum of 3 members. Students from
                different institutes may form a team. <br />
                2. Ready-made LEGO kits are not allowed. However, ready-made
                gear assemblies and development boards may be used. <br />
                3. Teams will have to report at least 15 minutes before the time
                slot allotted to them at the beginning of the event, failing to
                do so may result in disqualification. <br />
                4. No last minute repairs will be allowed in the arena. However,
                each team can take a time-out of 2 minutes once during a match.{" "}
                <br />
                5. Bots would be checked for their safety before the match and
                may be discarded if found unsafe for other team or spectators.{" "}
                <br />
                6. Organizers reserve the rights to change the rules at any
                point of time as they deem fit. The changes will however be
                highlighted on the website. So keep checking the ‘AAVARTAN’
                website for latest updates.{" "}
              </p>
              <br />
              <h3>RULES FOR SCORING </h3>
              <br />
              <p>
                1. After the first half, goals will be swapped. <br />
                2. A goal will be considered to be scored only if the ball has
                crossed the goal line completely.{" "}
              </p>
              <br />
              <h3>RULES FOR FOULS </h3>
              <br />
              <p>
                1. Any kind of intentional damage caused to opponent team’s
                robot will be considered as foul. Intentional grabbing of the
                ball so as to make it impossible for other team to get the
                control of the ball will also be considered as foul. <br />
                2. A free kick will be given to other team in case of fouls
                during which bots of the team committing the foul will be freeze
                for 30 seconds and ball will be given to the other team. <br />
                3. In case of repeated fouls yellow card and red cards will be
                given. If yellow card is given the robot will not be allowed to
                play rest of the match whereas the in case of red card it will
                not be allowed to play current as well as the next match. <br />
                4. If a foul is committed inside the D-area, penalty will be
                given. <br />
                5. Decision of the referee will be final and binding.{" "}
              </p>
              <br />
              <h3>DISQUALIFICATION </h3>
              <br />
              <p>Following cases will attract immediate disqualification: · </p>
              <p>
                1. If a team fails to adhere to size specifications.
                <br />
                2. If a team damages the arena in any way. <br />
                3. If a team commits repeated fouls. <br />
                4. If a team fails to report in time. <br />
                5. If a team tries to intervene the game play without permission
                of the referee.{" "}
              </p>
              <br />
              <h3>Judgment criteria: </h3>
              <br />
              <p>
                1. Time will be the judgment criteria <br />
                2. TEAM WITH MAX GOAL WILL BE WINNER. <br />
                3. In CASE OF TIE 3 min extra time will be given. THE TEAM TO
                SCORE FIRST GOAL DURING THE EXTRA TIME WILL WIN THE MATCH.{" "}
              </p>
              <br />
              <h3>Venue: </h3>
              <br />
              <p>In front of Central Garden </p>
              <br />
              <h3>Prizes: </h3>
              <br />
              <p>
                1st prize INR 5000/- <br />
                2nd prize INR 3000/-{" "}
              </p>
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/robotics/3 maze runner.jpeg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>MAZE RUNNER </h1>
              <br />
              <p>
                Solve it like Harry did. The game is to make a bot that can
                solve the maze in a given time. It is a line following bot and
                you're judged based on time you took.{" "}
              </p>
              <br />
              <h3>Description: </h3>
              <br />
              <p>
                JUNO crossed Mars but now in front of it lies a belt of
                asteroids, random stones and mountains floating in space to get
                past this belt it must follow a certain path directed by NASA.{" "}
              </p>
              <br />
              <p>
                Build autonomous line follower robot to follow a given path.{" "}
              </p>
              <br />
              <p>The event consists of 2 rounds- </p>
              <br />
              <p>
                (a) Qualifier Round In this round, a path formed by black lines
                will be provided. The participants have to come with an
                autonomous robot which should traverse from the source location
                to the destination on that path provided. The teams who will
                successfully complete this round will go to the next round.{" "}
              </p>
              <br />
              <p>
                (b) Final Round In this round, a maze will be provided. The
                robots have to solve the maze and reach the end point of the
                maze.
              </p>
              <br />
              <h3>ROBOT SPECIFICTION- </h3>
              <br />
              <p>(a) Robot size should not exceed 25cm X 25cm. </p>
              <br />
              <p>(b) Battery should not be more than 12V. </p>
              <br />
              <p>
                (c) The robot should be autonomous not manual. Lego kits will
                not be allowed.{" "}
              </p>
              <br />
              <h3>RULES: </h3>
              <br />
              <p>
                (A) Single hand touch of robots is only allowed during run in
                case robot goes out of arena.{" "}
              </p>
              <br />
              <p>(B) Lego kits not allowed. </p>
              <br />
              <p>
                (C) For every checkpoint cleared you will get 50 points and
                completion of path will give you additional 100 points.{" "}
              </p>
              <br />
              <p>
                (D) For every restart in the race 50 points will be deducted.{" "}
              </p>
              <br />
              <p>
                (E) Everybody should come on time. Late comers will not be
                entertained.{" "}
              </p>
              <br />
              <h3>Judgment criteria: </h3>
              <br />
              <p>
                Points and time will be the judgment criteria. In case of tie,
                time will be considered.
              </p>
              <br />
              <h3>Venue: G-37 </h3>
              <br />
              <h3>Prizes: 1st Prize INR 5000/- 2nd Prize INR 3000/- </h3>
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/robotics/4 terrain treader.png' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>TERRAIN TREADER </h1>
              <br />
              <p>
                If it can go through the dirt your bot can go through this. Here
                your bots’ manoeuvrability and power is tested. The track is
                filled with obstacles and hurdles. The winner takes it all.{" "}
              </p>
              <br />
              <h3>Description: </h3>
              <br />
              <p>
                A satellite has crashed into the dense deep forests of Amazon
                the abode of wilderness with rough terrain impossible to tread
                even bare foot. The satellite contains data of great sensitivity
                and significance and must be fetched under any circumstances.
                For that a treader needs to made which can overcome any hurdle
                the wilderness has to offer In this the teams have to build a
                manually controlled robot which is capable of grabbing different
                objects and crossing different types of terrain by
                reconstructing its path and broken bridge.{" "}
              </p>
              <br />
              <h3>ROBOT SPECIFICATION: </h3>

              <br />
              <p>1. Each team is allowed to have a only one robot. </p>
              <br />
              <p>
                2. The robot must fit into a cube of (30x30x30) cm at all times.
                It may not expand at any time during the match beyond this size
                even for hitting the ball. Violating this clause will lead to
                immediate disqualification.{" "}
              </p>
              <br />
              <p>3. Robots must be controlled manually. </p>
              <br />
              <p>4. Robot can be wired or wireless/sensored robotics. </p>
              <br />
              <h3>Rules: </h3>
              <br />
              <h3>GENERAL RULES </h3>
              <br />
              <p>
                1) A team may consist of maximum of 3 members. Students from
                different institutes may form a team.{" "}
              </p>
              <br />
              <p>
                2) Ready-made LEGO kits are not allowed. However, ready-made
                gear assemblies and development boards may be used.{" "}
              </p>
              <br />
              <p>
                3) Teams will have to report at least 15 minutes before the time
                slot allotted to them at the beginning of the event, failing to
                do so may result in disqualification.{" "}
              </p>
              <br />
              <p>
                4) No last minute repairs will be allowed in the arena. However,
                each team can take a time-out of 2 minutes once during a match.{" "}
              </p>
              <br />
              <p>
                5) Bots would be checked for their safety before the match and
                may be discarded if found unsafe for other team or spectators.{" "}
              </p>
              <br />
              <p>
                6) Organizers reserve the rights to change the rules at any
                point of time as they deem fit. The changes will however be
                highlighted on the website. So keep checking the ‘AAVARTAN’
                website for latest updates.{" "}
              </p>
              <br />

              <h3>GAME PLAY </h3>
              <br />
              <p>
                The robot should traverse through the path covered with
                devastating hurdles. If the robot falls off, then the robot
                should begin from previous checkpoint. If the robot comes
                outside of the path, penalty of 10 seconds will be added.{" "}
              </p>
              <h3>Judging criteria: </h3>
              <br />
              <p>
                The time taken to traverse the path along with the penalty will
                be judging criteria.{" "}
              </p>
              <br />
              <h3>Venue: </h3>

              <br />
              <p>In front of Central Garden. </p>
              <br />
              <h3>Prizes: </h3>
              <br />
              <p>1st Prize INR 5000/- </p>
              <br />
              <p>2nd Prize INR 3000/- </p>
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className='event_head'>ONLINE EVENTS</h2>
        <div className='container11'>
          <div className='card11'>
            <div className='circle'>
              <img src='/events/online/1 lan gaming.jpg' alt='LAN GAMING' />
            </div>
            <h2 className='name'>LAN GAMING</h2>
            <RegisterOptions
              eventNo={31}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img src='/events/online/alquora.png' alt='ALQUORA' />
            </div>
            <h2 className='name'>ALQUORA</h2>
            <RegisterOptions
              eventNo={24}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img src='/events/online/3 social hunt.jpg' alt='SOCIAL HUNT' />
            </div>
            <h2 className='name'>SOCIAL HUNT</h2>
            <RegisterOptions
              eventNo={19}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/online/4 capture the movement.jpg'
                alt='CAPTURE THE MOMENT'
              />
            </div>
            <h2 className='name'>CAPTURE THE MOMENT</h2>
            <RegisterOptions
              eventNo={21}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/online/5 paint our theme.jpg'
                alt='PAINT OUR THEME'
              />
            </div>
            <h2 className='name'>PAINT OUR THEME</h2>
            <RegisterOptions
              eventNo={23}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/online/6 face.jpeg'
                alt='FACE OF AAVARTAN'
              />
            </div>
            <h2 className='name'>FACE OF AAVARTAN</h2>
            <RegisterOptions
              eventNo={33}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/online/7 kleos.jpeg'
                alt='KLEOS'
              />
            </div>
            <h2 className='name'>KLEOS</h2>
            <RegisterOptions
              eventNo={34}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/online/1 lan gaming.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'> GAMING</h1>
              <br />
              <h3>Description </h3>
              <br />
              <p>Computer games connected via network. </p>
              <p>NFS</p> <br />
              <p>FIFA</p>
              <br />
              <p>Counter Strike </p>
              <br />
              <h3>Team Death match (PUBG)</h3>
              <br />
              <h3> Rules: </h3>
              <br />
              <p>
                FIFA and NFS will be played individually. TDM will be played by
                2 teams at once consisting of 4 Players each. All rounds will be
                knockout round.{" "}
              </p>
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/online/alquora.png' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>ALQUORA 2019</h1>
              <br />
              <p>
                Alquora 18 has been one of the most successful event out of a
                large pool of equally enthralling technical events, held as a
                part of Central India’s largest TechFest AAVARTAN’18. This event
                was for everyone with a knack for programming.  It is our annual
                programming competition, conducted on the eve of AAVARTAN, our
                annual Tech Fest. It will be a single round IOI style
                Individual contest, hosted on Code chef. It will be consisting
                of 6 to 7 challenges, to be solved in 3 hours duration. The
                problems are expected to be engaging for everyone participating.
                Ranking is based on IOI style, with penalty of 10 minutes for
                every rejected solution (except Compile Errors).
              </p>
              <br />

              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/online/3 social hunt.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'> SOCIAL HUNT</h1>
              <br />
              <h3>DESCRIPTION </h3>
              <br />
              <p>
                This will be an online treasure hunt basically; we will be using
                our Facebook/Instagram pages as connection to find a specific
                thing i.e. date at which photo is uploaded or any other thing.{" "}
              </p>
              <br />
              <h3>Event Description: </h3>
              <br />
              <p>
                Ex- Suppose we are using AAVARTAN page, then we will be posting
                on technocracy Facebook page it will be linked to our photo that
                we have already posted on AAVARTAN page, like Face of AAVARTAN,
                17, and answer to the question might be date at which the photo
                is uploaded or likes/shares on that photo. Similarly, like this
                we will be using all the Facebook pages of clubs coming under
                Technocracy committee and we can make up to like 4-5 questions
                (Technocracy, AAVARTAN, ROBOTIX, and IEEE NIT).{" "}
              </p>
              <br />
              <h3>Rules </h3>
              <br />
              <p>
                Every participant answering must have liked all the pages
                mentioned above and must have shared the first intro of the
                event on Facebook, on his timeline otherwise he/she will be
                disqualified. He/she must have tagged at least 2 of his friends
                on the same Facebook post. If two people answered the question
                at same time points will be awarded to the person selected by
                heads. Teams can also be there all of them must have followed
                rule #1{" "}
              </p>
              <br />

              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/online/4 capture the movement.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br/><h1 className="event-head">Capture the moment</h1><br/>
<p>
Photography is a way of feeling, of touching, of loving." <br/>
What you have caught in this Aavrartan'19 is captured forever. It remembers little things, long after you have forgotten everything. <br/>
This Aavartan we are organizing an interesting competition of photography for them who is expert in clicking the moments. During Aavartan  <br/>there will be number of events and attractions, we are organizing so you just click the photos of precious and joyful moments. Picture may be of any event or attraction.</p><br/>

<h3>
How to participate :</h3><br/>
<p>
In order to participate in the event, you need to upload your photo in Instagram tagging @clickclubnitrr and @nitrr.aavartan as well as mail the same pic to clickclubnitrr@gmail.com along with the caption and your Name, Branch, semester, college. 
Failing to do so will led to immediate disqualification. </p><br/>


<h3>
General Rules :</h3>
<br/>
<p>
1. No restriction for no. of photos submitted by individual. <br/>
2. Photo should be clicked during Aavrartan'19 in the college itself. <br/>
3. There is no restriction on the camera being used for the event . Mobile photography is acceptable . <br/>
4. Entries found to be copied from the internet or any other source shall positively win the honour of being instantly disqualified. <br/>
5. The photographs should be clicked in JPEG format.<br/>
6. The photos should be without any borders, frames and watermarks.<br/>
7. The photographs should have appropriate caption. <br/>
8. No photographs should be entertained after 2 days of completion of fest. <br/>
9. Result will be declared on (as per your official result date) <br/>
</p>
<h3>
Judgement:
</h3><br/>
<p>
Photos are selected by the collective decision of jury. Decision by the jury will be final. 

 Photographs should be send to clickclubnitrr@gmail.com</p><br/>
<h3>
For Any Quary Contact-
</h3>
<br/>
<p>
Devansh Rathi 
<br/>
+919425149841</p><br/>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/online/5 paint our theme.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'> PAINT OUR THEME</h1>
              <br />
              <p>
                Posters are not only visually appealing but are the most
                effective way to provide information in a fun and creative way.
                So Aavartan '19 invites all the design geeks and show how
                creative they are. Paint our theme is an online theme based
                poster designing competition. Participants need to design a
                poster a poster on Aavartan'19 theme in a given deadline.
                Posters will be uploaded from Aavartan'19 Facebook page.
              </p>
              <br />
              <h3>Rules:-</h3>
              <br />
              <p>
                Poster should be strictly based on theme. Using features like
                3-D text, bleeding, background image reflection, contrasts
                colour carry more weightage. Poster made using online platform
                will be disqualified.
              </p>
              <br />
              <h3>JUDGING CRITERIA:</h3>
              <br />
              <p>1. No. of likes share react on the poster</p>
              <br />
              <p>2. Jury's vote</p>
              <br />
              <p>No venue</p>
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/online/6 face.jpeg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br/><h1 className="event-head"> FACE OF AAVARTAN </h1><br/>
<p>Aavartan is back with a bang, this time with even more spectacles for you to witness. The aura is set and the wait is on, so gear up as it's your time to shine!
Team technocracy is back with the mega Tech-fest and so is your chance to be  'The Face Of Aavartan'.
Beauty is believing in more than what dazzles the eyes.
Want your smile to be cherished in the memories of a mega fest? Have you got the confidence and charm to be under the spotlight and let your grace shine through? 

If so, don't miss the opportunity to allure the masses and leave your mark!

Take part in the event by posting the finest snap of yours and win exciting prizes.

   </p><br/>
  <h3>
Event Description </h3><br/>

<p>This an online event where contestants mail their photos to the Aavartan mail ID and those are uploaded through the official Facebook page of Aavartan. Based on no. of likes on the photo there will be a winner from boys and a winner from girls.
   </p><br/>
<h3> 
JUDGING 
CRITERIA:  </h3><br/>
<p> 
1. Each LIKE will be awarded with 1 point.<br/>
2. WOW react will be awarded with 3 points.<br/>
3. LOVE react will be awarded with 4 points.<br/>
4. Sharing of post is allowed but no points will be awarded for this.<br/>
5. Each positive comment will fetch 2 points and there is no marking for negative comment.<br/>
6. Angry reaction has no points.<br/>
7. Use of Facebook auto liker will lead to disqualification.  </p><br/>

              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/online/7 kleos.jpeg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br/><h1 className="event-head"> KLEOS </h1><br/>
<p>Do you call yourself a Hawkshaw? Got a jot of Sleuth-hound blood in your veins? Or if asked simply, are you interested in mystery?
If the answer is YES, then Team Technocracy is all set for the most mind blowing, invigorating and impelling event of Aavartan'19, KLEOS. 
Think to the level beyond your imagination, think intensively and wisely.
Involve your mind, perseverance and passion to crypt the toughest logic.
With puzzles, riddles, ciphers and other encryption KLEOS is indeed a mind blogging experience.


   </p><br/>
  <h3>
Event Description </h3><br/>

<p>This is an app where an online treasure hunt is conducted. This includes solving ciphers and this tests the creativity of the participants. This also examines the logical thinking and problem solving skills. 

   </p><br/>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className='event_head'>FUN EVENTS</h2>
        <div className='container11'>
          <div className='card11'>
            <div className='circle'>
              <img src='/events/fun/1 rush hour.jpg' alt='RUSH HOUR' />
            </div>
            <h2 className='name'>RUSH HOUR</h2>
            <RegisterOptions
              eventNo={25}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img src='/events/fun/2 gwiggle.jpg' alt='GWIGGLE' />
            </div>
            <h2 className='name'>GWIGGLE</h2>
            <RegisterOptions
              eventNo={27}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/fun/3 sherlock homes.jpg'
                alt='SHERLOCK HOLMES'
              />
            </div>
            <h2 className='name'>SHERLOCK HOLMES</h2>
            <RegisterOptions
              eventNo={29}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/fun/1 rush hour.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'> RUSH HOUR</h1>
              <br />
              <h3>EVENT 1: AIRBALL </h3>
              <br />
              <p>
                In this event, 3-5 small plastic balls are placed on the tables.
                The table tops would be covered by handmade obstacles. The
                tables would be slightly tilted or inclined. The participant has
                to blow the ball with air and let it pass through the obstacles
                to the finishing line. However, during the whole process the
                ball should not touch the boundary of the lower end of the
                tilted table. If the ball touches the lower boundary then the
                ball would be disqualified and participant would have to start
                with the new ball again from the starting line.
              </p>
              <br />
              <h3>EVENT 2: SPIN A WHEEL</h3>
              <br />
              <p>
                Here, the participants will perform in a pair. One member of the
                team will rotate the spin wheel and other needs to solve the
                question in a given sector. As soon as they complete the task
                they will be sent to next event.
              </p>
              <br />
              <h3>EVENT 3: LOGO CROSSWORD</h3>
              <br />
              <p>
                The participants need to solve the crossword based on logo in
                the minimum possible time.
              </p>
              <br />
              <h3>EVENT 4: WORD JUMBLE </h3>
              <br />
              <p>
                Here, different words would be kept in the chits on the tables.
                The team members have to take 5 chits at a time. If the team
                doesn’t gets any word, they had to take 5 extra chits. The team
                which forms a valid word fastest from its own selected chits
                will be declared the winner.
              </p>
              <br />
              <h3>EVENT 5: RING AROUND </h3>
              <br />
              <p>
                In this event participants have to take a chit having particular
                categories of applications mentioned on it. Participants need to
                knock out five applicants of given categories using ring
                provided.
              </p>
              <br />

              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/fun/2 gwiggle.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>GWIGGLE</h1>
              <br />
              <h3>DESCRIPTION:</h3>
              <br />
              <p>
                To hunt, a treasure has always followed a mainstream way, why
                not make it bizarre. Adding blend of some technical ways to it
                could make it fun thrilling. Each team will have 3-4 members
                utmost. The event has the following rounds.{" "}
              </p>
              <br />
              <h3>Round 1- APTITUDE TEST – </h3>
              <p>
                questions based on latest breakthrough in technology would be
                there. It will be a pen paper test.
              </p>{" "}
              <h3>Round 2- Treasure hunt – </h3>{" "}
              <p>
                Words written in paper will be hidden at places in different
                languages, the participants have to use Google translate to
                convert it into understandable form thereby forming a sentence
                which would further take them to place where some images would
                be kept. They have to find the same image in Google. The images
                would be shown to us.
              </p>
              <br /> <h3>Round 3-</h3>
              <p>
                {" "}
                There will be a set of questions for each image, the answers of
                which would be a place. The qualified participants will have to
                find the answer of the questions and locate the places on Google
                map. By joining all the places (answers) on Google map alphabets
                will be formed, which would be the password for the Gmail ID we
                will give them to crack. Evaluation – whoever completes the task
                in proper sequence and least time wins the treasure.{" "}
              </p>
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/fun/3 sherlock homes.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br /> <h1 className='event-head'> SHERLOCK HOLMES</h1>
              <br />
              <p>
                This is a crime-investigation and detective event which
                challenges the conventional way of thinking and very much lives
                by the ideology: "The only promise a puzzle makes is an answer."
                An event with set of clues linking to one another using team’s
                analytical & technical knowledge. Also a run against time and
                mutual understanding of team. Be the "007", "Sherlock Holmes"
                and "spy kids" of your arena and crack out d clue nuts!! If you
                think your navigation skills are sharp and your puzzle solving
                is sharper then this event is for you. The teams will be given a
                clue, which when solved will lead to a series of subsequent
                puzzles and a new location. The clues will be concealed around
                the campus. Teams should construe the clues and puzzles and
                which is first in doing so is the winner. So….Do you have the
                witty skills of SHERLOCK HOLMES!!??{" "}
              </p>
              <br />
              <h3>Event Description:</h3>
              <br />
              <p>
                “Once you eliminate the impossible, whatever remains, no matter
                how improbable, must be the truth.” Sherlock Holmes As the name
                suggests Sherlock Holmes is an offline detective event filled
                with puzzles, riddles and clues which the participant is
                supposed to decipher. The event consists of total 7 rounds,
                first round being the aptitude test to screen the teams and the
                difficulty level will keep on rising in the successive rounds as
                one proceeds.{" "}
              </p>
              <br />
              <h3>RULES: </h3>
              <br />
              <p>1. Maximum 3 members per team are allowed.</p> <br />
              <p>
                2. On the basis of aptitude round, 50 teams will go to the next
                level.
              </p>
              <br />
              <p>3. Internet usage is allowed.</p>
              <br />
              <p>
                4. In case of any disputes the decision taken by the technical
                committee will be final and binding.{" "}
              </p>{" "}
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className='event_head'>MANAGERIAL EVENTS</h2>
        <div className='container11'>
          <div className='card11'>
            <div className='circle'>
              <img src='/events/fun/4 beg borrow.jpg' alt='BEG BORROW STEAL' />
            </div>
            <h2 className='name'>BEG BORROW STEAL</h2>
            <RegisterOptions
              eventNo={18}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img src='/events/fun/5 sold out.jpg' alt='SOLD OUT' />
            </div>
            <h2 className='name'>SOLD OUT</h2>
            <RegisterOptions
              eventNo={16}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/fun/4 beg borrow.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'> BEG BORROW STEAL</h1>
              <br />
              <h3>DESCRIPTION:</h3>
              <br />
              <p>
                Get ready to put all your resources and contacts to a test to
                fetch the most radical and extraordinary things in this epic
                race. In this game show you can win money by begging, borrowing
                or stealing things. Participants will be given a list of things
                that they have to fetch within a time span. Everything is fair
                in this war. ‘Jugaad’ is the key word. For once, you won’t be
                ostracized for begging, despised for borrowing or prosecuted for
                stealing. The team which earns the maximum points in the least
                time will be declared winners. It’s time to put on your shoes,
                fasten your belts, spruce up your imagination and put all your
                resources to fetch the most radical things. For once in a
                lifetime you won’t be eschewed for begging, despised for
                borrowing or prosecuted for stealing. So get ready to have some
                real fun.
              </p>
              <br />
              <h3>Rules</h3>
              <p>
                A team will comprise of 3 players. All the teams will be
                provided with a list of items. Team members will have to
                complete the task within a time limit of 30 min. Team can either
                beg, borrow or steal the items that are enlisted and provided to
                them. Teams will have to get themselves registered before the
                commencement of the event. After the completion of the task the
                task the teams will are required to report to the coordinators
                for evaluation. Teams will be judged on first come, first serve
                basis and also the items they were able to collect.
              </p>
              <br />

              <h3>Prizes</h3>
              <br />
              <p>Winner: </p>
              <br />
              <p>1st runner up:</p>
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/fun/5 sold out.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>SOLD OUT!! </h1>
              <br />
              <h3>Description </h3>
              <br />
              <p>This event will test the management skill of participants. </p>
              <br />
              <h3>Event Description:</h3>
              <br />
              <h3>Round 1:</h3>
              <br />
              <p>
                This will be written round, participants will be given 3 or 5
                questions on spot. They have to answer it in the best way
                possible, on this basis teams will be selected for second round.
              </p>
              <br />
              <h3>Round 2:</h3>
              <br />
              <p>
                In this selected teams will be given 69 credit and using this
                credit they have to buy products presented before them, each
                product will cost a credit. Every team has to buy a minimum of 9
                products. After all, products are sold marking would be done on
                the following basis- All products credit will be multiplied by
                their value point. After all the products are sold, the
                remaining credits will be multiplied by credit point and the
                total score will be the addition of both and points. Value
                point= “3” Credit point= “2”{" "}
              </p>
              <br />
              <p>Total score= Product point + Remaining credit point</p>
              <br />
              <h3>Rules </h3>
              <br />
              <p>1.2 Or 3 members per team</p>
              <br />
              <p>
                2. If two teams have tie score winner will be the team with more
                remaining credit point.
              </p>{" "}
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className='event_head'>MISCELLANEOUS EVENTS</h2>
        <div className='container11'>
          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/miscellaneous/1 cry bazooka.jpg'
                alt='CRY BAZOOKA'
              />
            </div>
            <h2 className='name'>CRY BAZOOKA</h2>
            <RegisterOptions
              eventNo={26}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img
                src='/events/miscellaneous/2 october sky.jpg'
                alt='OCTOBER SKY'
              />
            </div>
            <h2 className='name'>OCTOBER SKY</h2>
            <RegisterOptions
              eventNo={28}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>

          <div className='card11'>
            <div className='circle'>
              <img src='/events/miscellaneous/go green.jpg' alt='ECOPOLIS' />
            </div>
            <h2 className='name'>ECOPOLIS</h2>
            <RegisterOptions
              eventNo={14}
              isUserLoggedIn={this.state.isUserLoggedIn}
              eventList={this.props.REGevents}
              onClickFunction={this.registerForEvent}
            />
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/miscellaneous/1 cry bazooka.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>CRY BAZOOKA </h1>
              <br />
              <h3>Task: </h3>
              <br />
              <p>
                Design and build a spud gun. Use it to compete in different
                challenges, adhering to the rules and regulations of the game.{" "}
              </p>
              <br />
              <h3>Model Specifications and Rules: </h3>
              <br />
              <div className="h_iframe">
              <iframe width="420" height="315"
              src="https://www.youtube.com/embed/SYrh5obm9Gw?autoplay=1">
              </iframe>
              </div>
              
              <br/>
              <p>
                1. You may use a spud gun made of PVC, built from scratch by
                your team and bring it during the event.</p> <p>2. Use of metallic
                pipes are prohibited.</p> <p>3. Your gun should work using electric sparks
                for ignition of the gas chamber. </p> <p>4. You should not use LPG, CNG,
                vaporized fossil fuels for aiding the ignition of gas chamber.
                Deodorant and perfumes are allowed. </p> <p>5. Your gun should use
                paper, potato, or clothes only as ammo.{" "}
              </p>
              
              <p>
                6.Decide the dimensions of your spud gun keeping in mind the arena
                and rules of various rounds. </p> <p>7. Your team must consist of maximum 5
                members.</p> <p>8.  Maximum length of the spud gun should be 3 meters.</p> <p>9. For
                all rounds, a line will be marked on the arena, behind which the
                team members have to stand while shooting the target(s).
                </p> <p>10. Participants should report strictly one hour prior to the start
                of the event. Participants should carry proof of identity issued
                by their institution.</p> <p>11. Any discrepancy or spot ruling that may be
                required to be made by the organizing party will be done as they
                see fit, and their ruling is final and not subject to appeal.{" "}
              </p>
              <br />
              <h3>Event Structure: </h3>
              <br />
              <p>
                1. The event consists of three rounds. Teams qualifying in a
                round will progress to subsequent rounds.{" "}
              </p>
              <br />
              <p>
                2. The rounds have been designed to accommodate every aspect
                needed to build a spud gun like design and accuracy.
              </p>
              <br />
              <h4>Round 1:</h4>
              <p>
                Objective: Maximum Shoot:
              </p>
              <br />
              <p>•	The team that will shoot the maximum range will qualify for round 2.
              </p> <p>•	Each team will be given 3 chances and the best range will be considered for the results.
              </p> <p>•	Time limit- 2 minutes per shot.</p>

              <br />
              <h4>Round 2:</h4>
              <p>
                Objective: Shoot the targets kept on the ground at different levels. Points vary from target 
to target.

              </p>
              <br/>
              <h4>Task</h4>
              <p>
              • The targets will be arranged in three levels in the form of an equilateral triangle with the apex facing away from you.
</p> <p>• Farther the target, more the points.
</p> <p>• Targets along the same level will have the same points.
</p> <p>• There are no restrictions on the number of shots in this round. The teams can shoot as many times they need in the prescribed time limit. Time limit – 6 minutes.

              </p>
              <br/>
              <h4>Points</h4>
              <p>
              • First level carry 50 points
</p> <p>• Second level carry 100 points
</p> <p>• Third level carry 200 points.
</p> <p>• Points achieved from each shot will be added to the total points.

              </p>
              
              <br />
              <h3>Round 3: </h3>
              <br />
              <p>Objective: Shoot a stationary target above the ground. </p>
              <br />

              <h3>Task : </h3>
              <br />
              <p>
              • Use the spud gun designed by your team to shoot a target kept at a height of about 10 meters above the ground.

</p> <p>• The target will be a square with concentric circles on it.
</p> <p>• Hitting the innermost circle will fetch most points and the   outermost carries the least.
</p> <p>• Not hitting the target will get zero points.
</p> <p>• 
Maximum number of shots -3 
Time limit – 2 minutes per shot
</p> <br/>
                <h3>Points:</h3>
                <p>
                • Point for this round will be given based on your accuracy.
</p> <p>• Innermost circle: 100 points
</p> <p>• Middle circle: 70 points
</p> <p>• Outermost Circle: 50 points
</p> <p>• Outside all circles, but within the square: 30 points.
</p> <p>• Hitting the circumference of any circle will fetch the points for the outer one.
</p> <p>• Points achieved from each shot will be added to the total points.

              </p>
              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/miscellaneous/2 october sky.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'> OCTOBER SKY </h1>
              <br />
              <p>
                In this event, students will showcase their talent in the field
                of rocket science, fluid dynamics and projectile motion. This is
                an interesting technical event in which students will have to
                prepare a ROCKET with the help of 2 litre bottle of cold drinks
                and a LAUNCHER, to project it by the hydraulic pressure, filled
                inside the rocket and launcher.{" "}
              </p>
              <br />
              <h3>Event Description </h3>
              <br />
              <h3>RULES:</h3>
              <br />
              <p>
                Rules of the event are as follows- 1. There should be maximum 3
                members in each team. 2. Rocket should be made with 2 litre
                plastic water bottle. 3. Rocket should fly due to hydraulic
                pressure. 4. October sky event contains 2 level of difficulties,
                whose introduction would be given on the spot.{" "}
              </p>
              <br />
              <h3>JUDGING CRITERIA: </h3>
              <br />
              <p>
                Event would be judge on the following parameters: Level 1
                Maximum range of the rocket. Level 2 Whether the October hits
                the target or not and if it hits the target then at what point
                it scores on hitting? • How close it is from the target.
                Requirements ``8 Pole Target board (painted wooden board){" "}
              </p>
              <br />

              <h3>Venue: Hockey Ground</h3>

              <br />
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='modal11'>
          <div className='modal11-in'>
            <div className='left1'>
              <div className='rectangle'>
                <img src='/events/miscellaneous/go green.jpg' alt='' />
              </div>
            </div>
            <div className='right1'>
              <div className='modal11-close'>
                {/* <img src="https://png.pngtree.com/svg/20160712/a8897b349d.svg" height="40px"/> */}
                <i
                  className='fa fa-times-circle-o'
                  style={{ fontSize: "36px" }}
                ></i>
              </div>
              <br />
              <h1 className='event-head'>ECOPOLIS-THE CITY PLANNER</h1>
              <p>
                {" "}
                City planner is a pictorial model designing event .In this a
                mutual, eco- friendly, and efficient blueprint of a city is to
                be prepared by using the infrastructure (building, factories,
                hospital etc) and resources (like forest ,dams, windmills etc)
                provided by us randomly. This event will give an opportunity to
                the students to test their creative and designing skills as
                engineers are the backbone of industrialisation and the
                resources are depleting so we required a greener alternative to
                this development.
              </p>
              <br />
              <h3>Description:</h3>
              <p> This event will be conducted in two rounds. </p>
              <p>Round 1: GUESS THE CITY— </p>
              <p>
                {" "}
                In the first round, the participants have to answer 25 questions
                on cities based on the description given (geography, location,
                resource).{" "}
              </p>
              <p> TIME LIMITS: 15 minutes</p>
              <p>
                JUDGEMENT: Since the questions will be objective type, the
                evaluation will be done by the organizers or the committee
                members on the basis of the answer key.
              </p>
              <p>VENUE:classroom</p>
              <p>REQUIREMETS:</p>
              <p>1.Questions Papers(100)</p>
              <p>2.Pens(100)</p>
              <p>Round 2: CITY OF MY DREAMS </p>
              <p>
                {" "}
                Through a random selection the shortlisted teams from first
                round will be given different information sheets specifying the
                constraints that each model must abide by. There will be 5-6
                different variations of planning constraints in the information
                sheets.Each variation of constraints will be set relating to a
                real world city. The constraints will be based on different
                factors such as geographical location, natural resources,
                demographics etc.Students should design the blueprint in form of
                block diagrams.{" "}
              </p>
              <p>
                {" "}
                TIME LIMITS: 25 minutes for drawing and 5 minutes per team for
                presentation.
              </p>
              <p>JUDGES:Colleges Faculties </p>
              <p>JUDGEMENT CRITERIA:</p>
              <p>
                {" "}
                1. The city plan that proves to be the most sustainable within
                the given constraints, will be considered as the best green city
                model.{" "}
              </p>
              <p>
                {" "}
                2. Also evaluation will be done on the basis of comparison
                between the plans and their real world counterparts.
              </p>

              <br />
              <h3>Prizes:</h3>
              <p>1st Prize worth Rs.5000/-</p>
              <p>2nd Prize worth Rs.3000/-</p>
              <div className='arrows'>
                <div className='lft'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54623.svg'
                    alt=''
                    height='40px'
                  />
                </div>
                <div className='rght'>
                  <img
                    src='https://image.flaticon.com/icons/svg/54/54240.svg'
                    alt=''
                    height='40px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Pevents;
