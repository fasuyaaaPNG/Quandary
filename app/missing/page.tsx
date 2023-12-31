'use client';

import "./style.css";
import { Typewriter } from 'react-simple-typewriter'

export default function Missing() {

    return (
        <>
            <div className="background">
              <div className="container">
                  <img src="/assets/error/asset.jpg" className="logo" alt="" />
                    <p className="error">
                      <Typewriter
                          words={['403', '404']}
                          loop={false}
                          cursor
                          cursorStyle=''
                          typeSpeed={160}
                          deleteSpeed={150}
                          delaySpeed={1150}
                        />
                    </p>
                  <div className="text">
                      <p className="textAtas">
                        Oopss!
                      </p>
                      <p className="textBawah">
                        Looks like this page is <Typewriter
                        words={['forbidden', 'missing']}
                        loop={false}
                        cursor
                        cursorStyle='_'
                        typeSpeed={60}
                        deleteSpeed={70}
                        delaySpeed={1100}
                      />
                      </p>
                  </div>
              </div>
            </div>
        </>
    )
}

