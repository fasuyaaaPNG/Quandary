import "./style.css"

export default function Home() {
  return (
    <>
      <div className="backHitam">
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
        <div className="container1">
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
          <div className="garis1">
          </div>
          <div className="whiteBackground">
            <img src="/assets/Landing/kiri.svg" className="garisKiri" alt="" />
            <img src="/assets/Landing/kanan.svg" className="garisKanan" alt="" />
            <img src="/assets/Landing/IlustContent2.svg" alt="" className="ilustContent2" />
            <div className="content2">
              <div className="content2Judul">
                <h1>
                  What Sets <span className="span1">Quandary</span> Apart?
                </h1>
              </div>
              <div className="decorLingkaran">
                <img src="/assets/Landing/lingkaran1.svg" alt="" className="decorLingkaran1" />
                <img src="/assets/Landing/lingkaran2.svg" alt="" className="decorLingkaran2" />
                <img src="/assets/Landing/lingkaran3.svg" alt="" className="decorLingkaran3" />
              </div>
              <div className="content2Desk">
                <div className="content2DeskJudul">
                  <p>
                    <b>Quandary</b> isn't just a forum
                  </p>
                </div>
                <div className="content2DeskParaf1">
                  <p>
                    It's a dedicated space crafted for the vibrant exchange of ideas, insights, and discussions centered around Indonesia. 
                  </p>
                </div>
                <div className="content2DeskParaf2">
                  <p>
                    Quandary aims to be the go-to platform for anyone seeking to explore, understand, and engage in conversations about Indonesia. 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}