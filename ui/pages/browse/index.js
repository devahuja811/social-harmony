// search bar
// quick filters for tags
// 5 columns with info on each
// click to view details

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import useStickyState from "../../lib/useStickyState";
import GameDetails from "../../components/main/gameDetails";


const providerOptions = {
    /* See Provider Options Section */
};


export default function Home() {
    const [web3Modal, setModal] = useState(null);
    const router = useRouter();
    const [games, setGames] = useStickyState([], "games");

    console.log(games);

    return (
        <div className="container md mx-auto overflow-visible py-20 px-40 w-screen">

            <div className="form-control py-8">
                <div className="relative">
                    <input type="text" placeholder="Search by Tag or Charity" className="w-full pr-16 input input-info input-bordered" />
                    <button className="absolute right-0 top-0 rounded-l-none btn btn-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {games?.map(game=>{
                    return (<GameDetails game={game}/>);
                })}
            </div>
        </div>
    )
}
