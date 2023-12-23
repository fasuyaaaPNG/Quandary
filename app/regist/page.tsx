import "./style.css";

export default function Regist() {
  return (
    <div className="container">
      <img src="/assets/LoginRegister/QUANDARY.png" alt="" className="logoAtas" />
      <div className="content">
        <div className="info">
          <p className="register">
            Create your account
          </p>
        </div>
        <form action="">
          <div className="input">
            <input type="email" placeholder="Email" className="email" />
            <input type="password" placeholder="Password" className="password" />
            <input type="password" placeholder="Confirm password" className="repassword" />
          </div>
          <div className="submit">
            <button className="enter">
              Sign up
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
      <div className="already">
        <p>
          Already have an account? <a href="" className="signin">Sign in</a>
        </p>
      </div>
    </div>
  )
}
