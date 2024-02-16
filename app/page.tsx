import "./style.css"

export default function Home() {
  return (
    <>
      <div className="backHitam">
        <div className="container1">
          <div className="headerLogoNav">
            <img src="/assets/Landing/Logo.svg" className="headerLogo" alt="" />
            <div className="headerNav">
              <a className="navHome">
                Home
              </a>
              <a className="navAbout">
                About
              </a>  
              <a className="navLogin">
                Log in
              </a>
            </div>
          </div>
          <div className="content1">
            <div className="content1Title">
              <h1>
                Join the <span className="span1">Conversation</span> at <span className="span1">Quandary</span>
              </h1>
            </div>
            <div className="content1Desk">
              <p>
                Your Premier Forum Destination for Thoughtful Discussions and Diverse Perspectives.
              </p>
            </div>
            <img className="miniIcon1" src="/assets/Landing/Vector.svg" alt="" />
            <img className="miniIcon2" src="/assets/Landing/Vector2.svg" alt="" />
            <div className="gridBox1">
              <div className="box1">
              </div>
              <div className="box2">
              </div>
            </div>
            <div className="gridBox2">
              <div className="box3">
                <div className="joinUs">
                  <h1 className="joinUsText">
                    Join Us
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}