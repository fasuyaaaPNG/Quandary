'use client';

import "./style.css";
import { Typewriter } from 'react-simple-typewriter'

export default function Missing() {

    return (
        <>
            <div className="background">
              <div className="container">
                  <img src="/assets/error/asset.jpg" draggable="false" className="logo" alt="" />
                  <div className="text">
                      <p className="textAtas">
                        Oopss!
                      </p>
                      <p className="textBawah">
                        Looks like this page is 
                        <Typewriter
                        words={[' missing', ' not found', ' 404']}
                        loop={false}
                        cursor
                        cursorStyle='_'
                        typeSpeed={60}
                        deleteSpeed={70}
                        delaySpeed={1500}
                        />
                      </p>
                  </div>
              </div>
            </div>
        </>
    )
}

