import 'tailwindcss/tailwind.css'
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import ActiveLink from '../components/activeLink';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (<div>
    <Head>
        <title>Social Harmony - Donate for a Greater Good</title>
    </Head>
    <div className="navbar shadow-lg w-screen bg-black bg-opacity-80 text-neutral-content rounded-box" style={{ position: "absolute", top: "0px", zIndex: "1000" }}>
      <div className="flex-none px-2 mx-2">
        <Link href="/">
          <a className="flex justify-start">
            <img className="object-scale-down h-6 px-2" src="/harmony-one.svg" />
            <span className="text-lg font-bold float">
              socialHarmony
          </span>
          </a>
        </Link>
      </div>
      <div className="flex-1 px-2 mx-2">
        <div className="items-stretch hidden lg:flex">
          <ActiveLink href="/charities">
            Social Causes
            
          </ActiveLink>
          <ActiveLink href="/browse">
            Browse Games
            
          </ActiveLink>
          
        </div>
      </div>
      <div className="flex-none">
        <Link href="/charities">
            <a className="btn btn-info btn-sm rounded-btn">
              Connect
            </a>
        </Link>
      </div>
      
    </div>

    <Component {...pageProps} />
  </div>);
}

export default MyApp
