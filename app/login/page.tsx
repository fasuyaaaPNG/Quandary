import "./style.css";

export default function login () {
    return (
        <>
            <div className="container">
      <img src="/assets/LoginRegister/QUANDARY.png" alt="" className="logoAtas" />
      <div className="content">
        <div className="info">
          <p className="register">
            Login to your account
          </p>
        </div>
        <form action="">
          <div className="input">
            <input type="email" placeholder="Email" className="email" />
            <input type="password" placeholder="Password" className="password" />
          </div>
          <div className="submit">
            <button className="enter">
              Sign in
            </button>
          </div>
        </form>
        <div className="google">
          <a href="" className="withgoogle">
            <div className="iconback">
              <img src="/assets/LoginRegister/google.png" alt="" className="icon"/>
            </div>
            <button className="with">
              Continue with Google
            </button>
          </a>
        </div>
      </div>
      <div className="notyet">
        <p>
            don't have an account yet? <a href="/regist" className="signin">Sign up</a>
        </p>
      </div>
    </div>
        </>
    )
}