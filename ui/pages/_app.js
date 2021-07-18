import 'tailwindcss/tailwind.css'
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import ActiveLink from '../components/activeLink';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (<div>
    <Head>
        <title>My new cool app</title>
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
          <ActiveLink href="/manage">
              Manage
          </ActiveLink>
          <ActiveLink href="/dashboard">
              Dashboard
          </ActiveLink>
          <Link href="/charities">
            <a className="btn btn-info btn-sm rounded-btn">
              Connect
            </a>
          </Link>
        </div>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
      
    </div>

    <Component {...pageProps} />
  </div>);
}

export default MyApp
