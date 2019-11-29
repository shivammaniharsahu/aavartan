import React, { Component } from "react";
import $ from "jquery";
import "./highlight.css";

class Highlight extends Component {
    componentDidMount(){
        // this will be called onload

    // changed .hover to .each
    $('.photo').each(function() {
        var rotation = Math.random() * 41 - 10;
        var depth = Math.floor(Math.random() * 256);
        $(this).css({
          'transform' : 'rotateZ(' + rotation + 'deg)',
          'z-index' : depth
        });        
    });

    }
  render() {
    return (
      <div className="highlight-main">
          <div className="gallery">  
  <figure className="photo">
    <img src="/gallery/original/13.jpeg" alt="Hippo" />
    <figcaption>L I Q U I D - D R U M</figcaption>
  </figure>
  <figure className="photo">
    <img src="/gallery/original/4.jpeg" alt="Garth" />
    <figcaption>A A V A R T A N</figcaption>
  </figure>
  <figure className="photo">
    <img src="/gallery/original/9.jpeg" alt="Pamela" />
    <figcaption>D J  - N I G H T</figcaption>
  </figure>

  <figure className="photo">
    <img src="/gallery/original/19.jpeg" alt="Gerald" />
    <figcaption>M J 5</figcaption>
  </figure>
  <figure className="photo">
    <img src="/gallery/original/16.jpeg" alt="Diana" />
    <figcaption>E D M  - N I G H T</figcaption>
  </figure>
 
  <figure className="photo">
    <img src="/gallery/original/12.jpeg" alt="Timothy" />
    <figcaption>L I Q U I D -   L E D</figcaption>
  </figure>

  <figure className="photo">
    <img src="/gallery/original/14.jpeg" alt="Henry" />
    <figcaption>M O O N W A L K</figcaption>
  </figure>

</div>
      </div>
    )
  }
}
export default Highlight;