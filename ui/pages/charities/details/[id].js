import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons'
import Blockies from '../../../components/blockies';
library.add(fab, fas);

import { useRouter } from 'next/router'
import useStickyState from "../../../lib/useStickyState";
import OrgDetails from "../../../components/main/orgDetails";
import GameDetails from "../../../components/main/gameDetails";

const providerOptions = {
    /* See Provider Options Section */
};


export default function Home(props) {

    const router = useRouter()
    const [web3Modal, setModal] = useState(null);
    const [tab, setTab] = useState(0);
    const [leaderTab, setLeaderTab] = useState(0);
    const [charitiesObj, setCharitiesObj] = useStickyState([], "charities");
    const [gamesObj, setGamesObj] = useStickyState([], "games");
    const [charity, setCharity] = useState({});
    const [games, setGames] = useState([]);

    const { id } = router.query;

    useEffect(() => {
        if (charitiesObj.length === 0) {
            return;
        }
        const c = charitiesObj.filter(e => e.id == id);
        setCharity(c[0]);
        const g = gamesObj.filter(e=> e.organisation === id);
        setGames(g);
        
    }, [id, charitiesObj]);

    return (
        <div className="container md mx-auto overflow-visible py-20 px-40 w-screen">
            <div className="flex">
                <p className="h-16 flex-grow text-3xl">
                    {charity?.organisation}
                </p>
            </div>
            <div className="flex">
                <div className="flex-grow">
                    <div className="w-full carousel rounded-box">
                        {charity?.heroImages?.map(e => {
                            return (
                                <div className="w-full carousel-item">
                                    <img src={e} className="rounded-xl shadow-xl w-full" />
                                </div>
                            );
                        })}
                    </div>

                    <div className="card compact lg:card-side bordered mt-4 bg-gray-800">
                        <div className="card-body">
                            <div className="tabs mb-4">
                                <a className={"tab tab-bordered " + (tab === 0 ? "tab-active" : "")} onClick={e => setTab(0)}>Story</a>
                                <a className={"tab tab-bordered " + (tab === 1 ? "tab-active" : "")} onClick={e => setTab(1)}>Social Campaigns</a>
                            </div>
                            <div className={"" + (tab === 0 ? "" : "hidden")}>
                                {charity?.story?.split("\n").map((e, i) => {
                                    return i === 0 ? <p className="font-thin pb-4">{e}</p> : <p className="font-thin">{e}</p>
                                })}

                            </div>
                            <div className={"" + (tab === 1 ? "" : "hidden")}>
                                <div className="grid grid-cols-3 gap-4">
                                    {
                                        games?.map(game => {
                                            return (
                                                <GameDetails key={game} game={game}/>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
                <div className="flex-none w-1/4 ml-4">
                    <div className="card bordered bg-gray-800 compact">
                        <div className="card-body divide-y">
                            <div className="pb-4">
                                <h2 className="card-title">500,000 raised</h2>
                                <progress className="progress progress-warning" value="100" max="100"></progress>
                                <p className="font-thin">from 250 games</p>
                            </div>
                            <div className="pt-4">
                                <p className="san-serif text-green-500">
                                    ✓ Verified
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <button className="btn btn-secondary flex-1 mt-4" onClick={() => router.push("/browse")}>Browse active Campaigns</button>
                    </div>

                    {<OrgDetails charity={charity}/>}

                </div>
            </div>
        </div >
    )
}
