// hero banner for the initiative [ok]
// game details (number of participants, total prize pool, cost per entry)
// Current stats (how many participants have entered the game) [ok]
// list of active participants
// Details about the organisation (e.g. PAWs)
// Details about how the money will be spent (include placeholder for milestones and attesters, etc)
// Analysis of participants per day over time (line)
// See a breakdown of winners vs DAO (pie)


import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons'
import Blockies from '../../components/blockies';
import { Pie, Line, Doughnut } from 'react-chartjs-2';
import useStickyState from "../../lib/useStickyState";
import OrgDetails from "../../components/main/orgDetails";

library.add(fab, fas);

export default function Home() {
    const router = useRouter();
    const [tab, setTab] = useState(0);

    const { id } = router.query;
    const [selected, selectedGamesObj] = useStickyState({}, "gameSelected");
    const [charities, setCharities] = useStickyState([], "charities");
    const [charity, setCharity] = useState({});

    useEffect(() => {
        const c = selected.organisation;

        if (charities.length === 0) {
            return;
        }
        console.log(charities);
        setCharity(charities.filter(e=>e.id === c)[0]);
    }, [selected, charities]);

    console.log(selected);

    return (
        <div className="container md mx-auto overflow-visible py-20 px-40 w-screen">
            <div className="flex">
                <div className="h-16 flex-grow">
                    <p className="text-sm font-thin">
                        <a className="link link-hover text-green-300">{selected?.organisationName}</a>
                    </p>
                    <p className="text-3xl">

                        {selected?.title}
                    </p>
                </div>
            </div>
            <div className="flex">
                <div className="flex-grow">
                    <div className="w-full carousel rounded-box">
                        {
                            selected?.heroImages?.map(img => {
                                return (
                                    <div className="w-full carousel-item">
                                        <img src={img} className="w-full" />
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className={"card bordered bg-gray-800 flex-grow compact mt-4"}>
                        <div className="card-body">
                            <div className="card-title">
                                About the Campaign
                            </div>
                            {
                                selected?.about?.split("\n").map(e => {
                                    return <p className="font-thin leading-relaxed pb-4">{e}</p>
                                })
                            }
                            <div class="justify-start">
                                {selected?.endorsed &&
                                    (<button className="btn btn-secondary flex-1 mt-4" onClick={() => router.push("/browse")}>Join the Cause</button>)
                                }
                                {!selected?.endorsed &&
                                    (<button className="btn btn-primary flex-1 mt-4" onClick={() => router.push("/browse")}>Endorse Cause</button>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-none w-1/4 ml-4">
                    <div className="card bordered bg-gray-800 compact">
                        <div className="card-body divide-y">
                            <div className="pb-4">
                                <h2 className="card-title">{selected?.entries} Participants</h2>
                                <progress className="progress progress-warning" value={selected?.entries} max={selected?.totalParticipants}></progress>
                                <p className="font-thin">out of {selected?.totalParticipants} Participants</p>
                                <p className="font-thin">@ {selected?.costPerEntry} ONE per entry <span className="text-gray-400">($6.40)</span></p>
                                <p className="py-2">Goal {(+(selected?.totalParticipants)) * (+(selected?.costPerEntry))} ONE <span className="text-gray-400">($11,380)</span></p>
                            </div>
                            <div className="pt-4">
                                {selected?.endorsed && (<p className="san-serif text-green-500">
                                    ✓ ENDORSED
                                </p>)}
                                {!selected?.endorsed && (<p className="san-serif text-blue-500">
                                    ? UNENDORSED
                                </p>)}
                                {!selected?.endorsed && <p className="font-thin text-xs italic">Game must be endorsed before starting</p>}

                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {selected?.endorsed &&
                            (<button className="btn btn-secondary flex-1 mt-4" onClick={() => router.push("/browse")}>Join the Cause</button>)
                        }
                        {!selected?.endorsed &&
                            (<button className="btn btn-primary flex-1 mt-4" onClick={() => router.push("/browse")}>Endorse Cause</button>)
                        }
                    </div>
                    <OrgDetails charity={charity}/>
                </div>
            </div>
        </div >
    );
}
