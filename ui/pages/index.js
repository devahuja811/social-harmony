import Head from 'next/head'
import Web3 from "web3";
import Web3Modal from "web3modal";
import React, { useEffect, useState } from "react";
import { themeChange } from "theme-change"
import Hero from '../components/main/hero';
import Link from 'next/link';


const providerOptions = {
  /* See Provider Options Section */
};


export default function Home() {
  const [web3Modal, setModal] = useState(null);

  // useEffect(e => {
  //   setModal(new Web3Modal({
  //     network: "mainnet", // optional
  //     cacheProvider: true, // optional
  //     providerOptions // required
  //   }));
  // });

  // useEffect(() => {
  //   themeChange(false)
  //   // 👆 false parameter is required for react project
  // }, []);

  return (
    <div className="container w-screen overflow-visible">
      <Hero />
    </div>
  )
}
