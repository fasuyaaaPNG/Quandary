'use client'

import './style.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import React, { useRef } from 'react';

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <div className="container">
        {/* search + profil */}
        <div className="searchProfil">
          <div className="search">
            <div className="searchIcon" onClick={handleSearchIconClick}>
              <FontAwesomeIcon
                style={{ fontSize: '3.5vw' }}
                icon={faMagnifyingGlass}
              />
            </div>
            <input type="text" ref={inputRef} placeholder='Search post' className='searchBar' />
          </div>
          <div className="profilImage">
            <img src="/assets/main/image1.jpg" className="profil" alt="" />
          </div>
        </div>
        {/* ucapan */}
        <div className="wellcomeBanner">
          <img src="/assets/main/wellcome.png" className='banner' alt="" />
        </div>
        {/* tranding */}
        <div className="tranding">
          <div className="tranding1">
            <button>
              Trending
            </button>
          </div>
          <div className="tranding2">
            <button>
              New
            </button>
          </div>
          <div className="tranding3">
            <button>
              Culture
            </button>
          </div>
        </div>
      </div>
      <div className="navbar">
        
      </div>
    </>
  );
}
