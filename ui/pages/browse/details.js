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

library.add(fab, fas);

export default function Home() {
    const router = useRouter();
    const [tab, setTab] = useState(0);

    return (
        <div className="container md mx-auto overflow-visible py-20 px-40 w-screen">
            <div className="flex">
                <div className="h-16 flex-grow">
                    <p className="text-sm font-thin">
                        <a className="link link-hover text-green-300">PAWS Society of Malaysia</a>
                    </p>
                    <p className="text-3xl">

                        Save the Kitties
                    </p>
                </div>
                <p className="h-16 flex-none w-1/4">
                    By Staff from <a href="mailto" className="link link-secondary">@PAWS Society</a>
                </p>
            </div>
            <div className="flex">
                <div className="flex-grow">
                    <div className="w-full carousel rounded-box">
                        <div className="w-full carousel-item">
                            <img src="/charities/1.campaign.cat.png" className="w-full" />
                        </div>
                        <div className="w-full carousel-item">
                            <img src="/charities/1.banner.jpeg" className="rounded-xl shadow-xl w-full" />
                        </div>
                        <div className="w-full carousel-item">
                            <img src="https://picsum.photos/id/501/256/144" className="w-full" />
                        </div>
                        <div className="w-full carousel-item">
                            <img src="https://picsum.photos/id/502/256/144" className="w-full" />
                        </div>
                        <div className="w-full carousel-item">
                            <img src="https://picsum.photos/id/503/256/144" className="w-full" />
                        </div>
                        <div className="w-full carousel-item">
                            <img src="https://picsum.photos/id/504/256/144" className="w-full" />
                        </div>
                        <div className="w-full carousel-item">
                            <img src="https://picsum.photos/id/505/256/144" className="w-full" />
                        </div>
                        <div className="w-full carousel-item">
                            <img src="https://picsum.photos/id/506/256/144" className="w-full" />
                        </div>
                    </div>




                    <div className={"card bordered bg-gray-800 flex-grow compact mt-4"}>
                        <div className="card-body">
                            <div className="card-title">
                                About the Campaign
                            </div>
                            <p className="font-thin leading-relaxed pb-4">The branch aims to help cats and kittens both in branch care and working with communities to help stray or community cats and feral cats. </p>

                            <p className="font-thin leading-relaxed pb-4">As a volunteer-run branch, we do not have a central adoption centre or base. The cats in our care are looked after by fosterers in either purpose built pens in their garden or dedicated foster rooms within their homes. Cats in branch care are never allowed to roam freely around houses or mix with other cats. This is to ensure we can clean the rooms and pens properly between cats and ensure effective disease control. To find out more about the welfare standards you can expect to find if you are adopting from the branch, please visit out welfare pages.</p>

                            <p className="font-thin leading-relaxed pb-4">We are run entirely by volunteers and we couldn’t do any of the above without our brilliant band of volunteers who give up their time to keep the branch running. We are always looking to recruit new volunteers, please check out our volunteer page to find out more.</p>

                            <div class="justify-start">
                                <button className="btn btn-secondary btn-sm" onClick={async () => await web3Modal.connect()}>Join the Cause</button>
                            </div>

                        </div>
                    </div>
                    <div className={"card bordered bg-gray-800 flex-grow compact mt-4"}>
                        <div className="card-body">
                            <div className="card-title">
                                Dashboards
                            </div>
                            <div>
                                <div className="stats shadow w-full">
                                    <div className="stat">
                                        <div className="stat-figure text-secondary">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <div className="stat-title">Participants</div>
                                        <div className="stat-value">1,203</div>
                                        <div className="stat-desc">of 2,000</div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-figure text-secondary">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                                            </svg>
                                        </div>
                                        <div className="stat-title">New Participants this week</div>
                                        <div className="stat-value">72</div>
                                        <div className="stat-desc text-error">↘︎ 12 (14%)</div>
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-wrap mt-4">
                                <div className="w-1/3">
                                    <div className='header text-center mb-2'>
                                        <h1 className='title'>Game Rewards</h1>
                                    </div>
                                    <Pie data={{
                                        labels: ['1st', '2nd', '3rd', 'DAO'],
                                        datasets: [
                                            {
                                                label: 'prize breakdown',
                                                data: [20, 10, 5, 65],
                                                backgroundColor: [
                                                    'rgba(255, 99, 132, 0.9)',
                                                    'rgba(54, 162, 235, 0.9)',
                                                    'rgba(255, 206, 86, 0.9)',
                                                    'rgba(75, 192, 192, 0.9)',
                                                    'rgba(153, 102, 255, 0.9)',
                                                    'rgba(255, 159, 64, 0.9)',
                                                ],
                                                borderColor: [
                                                    'black',
                                                    'black',
                                                    'black',
                                                    'black',
                                                    'rgba(153, 102, 255, 1)',
                                                    'rgba(255, 159, 64, 1)',
                                                ],
                                                borderWidth: 1,
                                            }
                                        ]
                                    }} />
                                </div>
                                <div className="w-2/3">
                                    <div className='header mb-2'>
                                        <h1 className='title text-center'>Entries Over Time (Weeks)</h1>
                                    </div>
                                    <Line data={{
                                        labels: ['1', '2', '3', '4', '5', '6'],
                                        datasets: [
                                            {
                                                label: '# of Entries',
                                                data: [12, 19, 3, 5, 2, 3],
                                                fill: false,
                                                backgroundColor: 'rgb(255, 99, 132)',
                                                borderColor: 'rgba(255, 99, 132, 0.2)',
                                            },
                                        ],
                                    }} options={{
                                        scales: {
                                            yAxes: [
                                                {
                                                    ticks: {
                                                        beginAtZero: true,
                                                    },
                                                },
                                            ],
                                        },
                                    }} />

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"card bordered bg-gray-800 flex-grow compact mt-4"}>
                        <div className="card-body">
                            <div className="card-title">
                                DAO, Governance and Milestones
                            </div>
                            <p className="font-thin">
                                Donations are automatically managed by a DAO (Decentralised Autonomous Organisation) Smart Contract
                                that manages the distributions and validation of milestones and goals. Each goal is attested by a number
                                of approved attesters before the funds for a milestone is released.
                                    </p>

                        </div>
                    </div>

                </div>
                <div className="flex-none w-1/4 ml-4">
                    <div className="card bordered bg-gray-800 compact">
                        <div className="card-body divide-y">
                            <div className="pb-4">
                                <h2 className="card-title">1203 Participants</h2>
                                <progress className="progress progress-warning" value="1203" max="2000"></progress>
                                <p className="font-thin">out of 2000 Participants</p>
                                <p className="font-thin">@ 100 ONE per entry <span className="text-gray-400">($6.40)</span></p>
                                <p className="py-2">Goal 200,000 ONE <span className="text-gray-400">($11,380)</span></p>
                            </div>
                            <div className="pt-4">
                                <p className="san-serif text-green-500">
                                    ✓ Verified
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <button className="btn btn-secondary flex-1 mt-4" onClick={() => router.push("/browse")}>Join the Cause</button>
                    </div>

                    <div className="card bordered compact bg-gray-800 mt-4">
                        <div className="card-body">
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                <div className="avatar">
                                    <div className="mb-2 w-10 h-10 bordered">
                                        <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                    </div>
                                </div>
                                <div className="col-span-3 h-full">
                                    <div>
                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                            target="_blank_" className="link link-hover link-accent text-xs truncate leading-relaxed">
                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                        </a>
                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• 12 minutes ago</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                <div className="avatar">
                                    <div className="mb-2 w-10 h-10 bordered">
                                        <Blockies opts={{ seed: "food", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                    </div>
                                </div>
                                <div className="col-span-3 h-full">
                                    <div>
                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                            target="_blank_" className="link link-hover link-accent text-xs truncate leading-relaxed">
                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                        </a>
                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• 12 minutes ago</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                <div className="avatar">
                                    <div className="mb-2 w-10 h-10 bordered">
                                        <Blockies opts={{ seed: "foo3", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                    </div>
                                </div>
                                <div className="col-span-3 h-full">
                                    <div>
                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                            target="_blank_" className="link link-hover link-accent text-xs truncate leading-relaxed">
                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                        </a>
                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• 12 minutes ago</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                <div className="avatar">
                                    <div className="mb-2 w-10 h-10 bordered">
                                        <Blockies opts={{ seed: "foo,", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                    </div>
                                </div>
                                <div className="col-span-3 h-full">
                                    <div>
                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                            target="_blank_" className="link link-hover link-accent text-xs truncate leading-relaxed">
                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                        </a>
                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• 12 minutes ago</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                <div className="avatar">
                                    <div className="mb-2 w-10 h-10 bordered">
                                        <Blockies opts={{ seed: "fo,o", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                    </div>
                                </div>
                                <div className="col-span-3 h-full">
                                    <div>
                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                            target="_blank_" className="link link-hover link-accent text-xs overflow-elipsis leading-relaxed">
                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                        </a>
                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• 12 minutes ago</span></p>
                                    </div>
                                </div>
                            </div>
                            <p>+1,193 <span className="text-gray-500">people have joined</span></p>
                        </div>
                    </div>

                    <div className="card bordered compact bg-gray-800 mt-4">
                        <figure className="h-32 mb-2">
                            <img src="/charities/1.png" />

                        </figure>

                        <div className="card-body">
                            <p className="font-bold">About</p>
                            <p className="font-thin">PAWS (PAWS Animal Welfare Society) is a non-profit animal shelter in Petaling Jaya that has been in operation since 1987.</p>
                            <div className="mt-2">
                                <p><FontAwesomeIcon icon="envelope" /></p>
                                <p><FontAwesomeIcon icon="globe" /></p>
                                <p><FontAwesomeIcon icon={["fab", "facebook"]} /></p>
                                <p><FontAwesomeIcon icon={["fab", "twitter"]} /></p>
                                <p><FontAwesomeIcon icon="phone-square" /></p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}
