import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons'
import Blockies from '../../../components/blockies';
library.add(fab, fas);

import { useRouter } from 'next/router'
import useStickyState from "../../../lib/useStickyState";

const providerOptions = {
    /* See Provider Options Section */
};


export default function Home(props) {

    const router = useRouter()
    const [web3Modal, setModal] = useState(null);
    const [tab, setTab] = useState(0);
    const [leaderTab, setLeaderTab] = useState(0);
    const [charitiesObj, setCharitiesObj] = useStickyState([], "charities");
    const [charity, setCharity] = useState({});

    const { id } = router.query;

    useEffect(() => {
        console.log(charitiesObj, id);
        if (charitiesObj.length === 0) {
            return;
        }
        const c = charitiesObj.filter(e => e.id === id);
        setCharity(c[0]);
        console.log(c[0]);
    }, [id, charitiesObj]);

    return (
        <div className="container md mx-auto overflow-visible py-20 px-40 w-screen">
            <div className="flex">
                <p className="h-16 flex-grow text-3xl">
                    {charity?.organisation}
                </p>
                <p className="h-16 flex-none w-1/4">
                    By Staff from <a href="mailto" className="link link-secondary">@PAWS Society</a>
                </p>
            </div>
            <div className="flex">
                <div className="flex-grow">
                    <div className="w-full carousel rounded-box">
                        {charity?.heroImages.map(e => {
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
                                <a className={"tab tab-bordered " + (tab === 2 ? "tab-active" : "")} onClick={e => setTab(2)}>Leaderboard</a>
                            </div>
                            <div className={"" + (tab === 0 ? "" : "hidden")}>
                                <p className="font-thin pb-4">
                                    PAWS (PAWS Animal Welfare Society) is a non-profit animal shelter in Petaling Jaya
                                    that has been in operation since 1987. We receive the surrender of unwanted dogs and
                                    cats which we will vaccinate, deworm, neuter/spay, and put up for adoption. Currently,
                                    there are over 250 dogs and 250 cats under the care of the shelter.
                                </p>
                                <p className="font-thin">
                                    The shelter and all
                                    costs involved in running it are entirely funded by the generous donations of the public
                                    as well as proceeds from charitable events. The PAWS team consists of four office staff,
                                    a number of part-time veterinarians, one vet assistant, six kennel workers, and one driver.
                                    PAWS is a registered Society under the Registry of Societies of Malaysia that is led by
                                    an elected committee.
                                </p>
                            </div>
                            <div className={"" + (tab === 1 ? "" : "hidden")}>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="card bordered compact bg-gray-600 shadow-2xl">
                                        <figure>
                                            <img src="/charities/1.campaign.cat.png" />
                                        </figure>
                                        <div className="card-body">
                                            <p className="text-xs font-thin leading-relaxed">PAWS Malaysia</p>
                                            <p className="text-lg leading-relaxed">Save the Kitties</p>
                                            <p className="text-sm font-thin leading-relaxed">100 One/$6.20 per entry</p>
                                            <p className="text-sm font-thin leading-relaxed mt-2">120 Participants</p>
                                            <progress className="progress progress-warning" value="120" max="1000"></progress>
                                            <p className="text-xs text-gray-400 font-thin leading-relaxed">Of 1000 Participants Goal</p>
                                            <button className="btn btn-secondary btn-sm font-thin flex-1 mt-4" onClick={() => router.push("/browse/details")}>Join the Cause</button>
                                        </div>
                                    </div>
                                    <div className="card bordered compact bg-gray-600 shadow-2xl">
                                        <figure>
                                            <img src="/charities/1.campaign.cat.png" />
                                        </figure>
                                        <div className="card-body">
                                            <p className="text-xs font-thin leading-relaxed">PAWS Malaysia</p>
                                            <p className="text-lg leading-relaxed">Save the Kitties</p>
                                            <p className="text-sm font-thin leading-relaxed">100 One/$6.20 per entry</p>
                                            <p className="text-sm font-thin leading-relaxed mt-2">420 Participants</p>
                                            <progress className="progress progress-info" value="420" max="1000"></progress>
                                            <p className="text-xs text-gray-400 font-thin leading-relaxed">Of 1000 Participants Goal</p>
                                            <button className="btn btn-secondary btn-sm font-thin flex-1 mt-4" onClick={() => router.push("/browse/details")}>Join the Cause</button>
                                        </div>
                                    </div>
                                    <div className="card bordered compact bg-gray-600 shadow-2xl">
                                        <figure>
                                            <img src="/charities/1.campaign.cat.png" />
                                        </figure>
                                        <div className="card-body">
                                            <p className="text-xs font-thin leading-relaxed">PAWS Malaysia</p>
                                            <p className="text-lg leading-relaxed">Save the Kitties</p>
                                            <p className="text-sm font-thin leading-relaxed">100 One/$6.20 per entry</p>
                                            <p className="text-sm font-thin leading-relaxed mt-2">820 Participants</p>
                                            <progress className="progress progress-success" value="820" max="1000"></progress>
                                            <p className="text-xs text-gray-400 font-thin leading-relaxed">Of 1000 Participants Goal</p>
                                            <button className="btn btn-secondary btn-sm font-thin flex-1 mt-4" onClick={() => router.push("/browse/details")}>Join the Cause</button>
                                        </div>
                                    </div>
                                    <div className="card bordered compact bg-gray-600 shadow-2xl">
                                        <figure>
                                            <img src="/charities/1.campaign.cat.png" />
                                        </figure>
                                        <div className="card-body">
                                            <p className="text-xs font-thin leading-relaxed">PAWS Malaysia</p>
                                            <p className="text-lg leading-relaxed">Save the Kitties</p>
                                            <p className="text-sm font-thin leading-relaxed">100 One/$6.20 per entry</p>
                                            <p className="text-sm font-thin leading-relaxed mt-2">120 Participants</p>
                                            <progress className="progress progress-warning" value="120" max="1000"></progress>
                                            <p className="text-xs text-gray-400 font-thin leading-relaxed">Of 1000 Participants Goal</p>
                                            <button className="btn btn-secondary btn-sm font-thin flex-1 mt-4" onClick={() => router.push("/browse/details")}>Join the Cause</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"" + (tab === 2 ? "" : "hidden")}>

                                <div className="btn-group pt-2 pb-4">
                                    <button className={"btn btn-md font-thin " + (leaderTab === 0 ? "btn-active" : "")} onClick={e => setLeaderTab(0)}>Most Generous</button>
                                    <button className={"btn btn-md font-thin " + (leaderTab === 1 ? "btn-active" : "")} onClick={e => setLeaderTab(1)}>Luckiest</button>
                                    <button className={"btn btn-md font-thin " + (leaderTab === 2 ? "btn-active" : "")} onClick={e => setLeaderTab(2)}>Unluckiest</button>

                                </div>
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Ranking</th>
                                            <th>Name</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>
                                                <div className="flex">
                                                    <p>1</p>
                                                    <div className="px-4"><svg height="32.069" width="33.448" xmlns="http://www.w3.org/2000/svg"><g data-name="1st badge"><g fill="#f8db4b" data-name="Path 24159"><path d="M27.127 10.458L27.11 21.58l-10.407 5.634L6.32 21.61l.017-11.123 10.407-5.633 10.384 5.603z"></path><path d="M7.32 21.015l9.382 5.063 9.409-5.093.015-9.93-9.383-5.062-9.409 5.093-.015 9.93m-2.001 1.192l.018-12.316 11.405-6.174 11.387 6.144-.018 12.315-11.405 6.174-11.388-6.144z"></path></g><g fill="#1f2c40" data-name="Path 24160"><path d="M26.722 10.237L16.707 26.445 6.745 10.267l10-5.412 9.977 5.382z"></path><path d="M16.709 24.541l8.605-13.926-8.568-4.624-8.596 4.652 8.56 13.899m-.004 3.808L5.338 9.89l11.405-6.173L28.13 9.861 16.706 28.35z" fill="#f8db4b"></path></g></g></svg></div>
                                                </div>
                                            </th>
                                            <td className="mb-4">
                                                <div className="flex mb-2">
                                                    <div className="avatar">
                                                        <div className="mb-2 w-10 h-10 bordered">
                                                            <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                                        </div>
                                                    </div>
                                                    <div className="h-full pl-4">
                                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                                            target="_blank_" className="link link-hover link-accent text-sm truncate leading-relaxed">
                                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                                            </a>
                                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• donated</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                25
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <div className="flex">
                                                    <p>2</p>
                                                    <div className="px-4"><svg height="32.069" width="33.448" xmlns="http://www.w3.org/2000/svg"><g data-name="2nd badge"><g fill="#c2c2c2" data-name="Path 24161"><path d="M27.128 10.459l-.017 11.121-10.407 5.634L6.32 21.612l.017-11.123 10.407-5.633 10.384 5.602z"></path><path d="M7.32 21.015l9.383 5.063 9.409-5.092.015-9.93-9.383-5.063-9.41 5.093-.014 9.93m-2.001 1.192l.018-12.316 11.405-6.174 11.387 6.144-.019 12.316-11.404 6.173-11.388-6.144z"></path></g><g fill="#1f2c40" data-name="Path 24162"><path d="M26.721 10.237L16.707 26.445 6.744 10.267l10-5.412 9.977 5.382z"></path><path d="M16.708 24.54l8.605-13.925-8.568-4.624-8.596 4.652 8.56 13.898m-.004 3.809L5.338 9.89l11.404-6.172 11.387 6.143L16.705 28.35z" fill="#c2c2c2"></path></g></g></svg></div>
                                                </div>
                                            </th>
                                            <td className="mb-4">
                                                <div className="flex mb-2">
                                                    <div className="avatar">
                                                        <div className="mb-2 w-10 h-10 bordered">
                                                            <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                                        </div>
                                                    </div>
                                                    <div className="h-full pl-4">
                                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                                            target="_blank_" className="link link-hover link-accent text-sm truncate leading-relaxed">
                                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                                            </a>
                                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• donated</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                18
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <div className="flex">
                                                    <p>3</p>
                                                    <div className="px-4"><svg height="32.069" width="33.448" xmlns="http://www.w3.org/2000/svg"><g data-name="3rd badge"><g fill="#987630" data-name="Path 24161"><path d="M27.128 10.459l-.017 11.121-10.407 5.634L6.32 21.612l.017-11.123 10.407-5.633 10.384 5.602z"></path><path d="M7.32 21.015l9.383 5.063 9.409-5.092.015-9.93-9.383-5.063-9.41 5.093-.014 9.93m-2.001 1.192l.018-12.316 11.405-6.174 11.387 6.144-.019 12.316-11.404 6.173-11.388-6.144z"></path></g><g fill="#1f2c40" data-name="Path 24162"><path d="M26.721 10.237L16.707 26.445 6.744 10.267l10-5.412 9.977 5.382z"></path><path d="M16.708 24.54l8.605-13.925-8.568-4.624-8.596 4.652 8.56 13.898m-.004 3.809L5.338 9.89l11.404-6.172 11.387 6.143L16.705 28.35z" fill="#987630"></path></g></g></svg></div>

                                                </div>
                                            </th>
                                            <td className="mb-4">
                                                <div className="flex mb-2">
                                                    <div className="avatar">
                                                        <div className="mb-2 w-10 h-10 bordered">
                                                            <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                                        </div>
                                                    </div>
                                                    <div className="h-full pl-4">
                                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                                            target="_blank_" className="link link-hover link-accent text-sm truncate leading-relaxed">
                                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                                            </a>
                                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• donated</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                16
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                4
                                            </th>
                                            <td className="mb-4">
                                                <div className="flex mb-2">
                                                    <div className="avatar">
                                                        <div className="mb-2 w-10 h-10 bordered">
                                                            <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                                        </div>
                                                    </div>
                                                    <div className="h-full pl-4">
                                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                                            target="_blank_" className="link link-hover link-accent text-sm truncate leading-relaxed">
                                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                                            </a>
                                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• donated</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                15
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                5
                                            </th>
                                            <td className="mb-4">
                                                <div className="flex mb-2">
                                                    <div className="avatar">
                                                        <div className="mb-2 w-10 h-10 bordered">
                                                            <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                                        </div>
                                                    </div>
                                                    <div className="h-full pl-4">
                                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                                            target="_blank_" className="link link-hover link-accent text-sm truncate leading-relaxed">
                                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                                            </a>
                                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• donated</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                15
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                6
                                            </th>
                                            <td className="mb-4">
                                                <div className="flex mb-2">
                                                    <div className="avatar">
                                                        <div className="mb-2 w-10 h-10 bordered">
                                                            <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                                        </div>
                                                    </div>
                                                    <div className="h-full pl-4">
                                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                                            target="_blank_" className="link link-hover link-accent text-sm truncate leading-relaxed">
                                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                                            </a>
                                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• donated</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                15
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                7
                                            </th>
                                            <td className="mb-4">
                                                <div className="flex mb-2">
                                                    <div className="avatar">
                                                        <div className="mb-2 w-10 h-10 bordered">
                                                            <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                                        </div>
                                                    </div>
                                                    <div className="h-full pl-4">
                                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                                            target="_blank_" className="link link-hover link-accent text-sm truncate leading-relaxed">
                                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                                            </a>
                                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• donated</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                15
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                8
                                            </th>
                                            <td className="mb-4">
                                                <div className="flex mb-2">
                                                    <div className="avatar">
                                                        <div className="mb-2 w-10 h-10 bordered">
                                                            <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                                        </div>
                                                    </div>
                                                    <div className="h-full pl-4">
                                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                                            target="_blank_" className="link link-hover link-accent text-sm truncate leading-relaxed">
                                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                                            </a>
                                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• donated</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                15
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                9
                                            </th>
                                            <td className="mb-4">
                                                <div className="flex mb-2">
                                                    <div className="avatar">
                                                        <div className="mb-2 w-10 h-10 bordered">
                                                            <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                                        </div>
                                                    </div>
                                                    <div className="h-full pl-4">
                                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                                            target="_blank_" className="link link-hover link-accent text-sm truncate leading-relaxed">
                                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                                            </a>
                                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• donated</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                15
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                10
                                            </th>
                                            <td className="mb-4">
                                                <div className="flex mb-2">
                                                    <div className="avatar">
                                                        <div className="mb-2 w-10 h-10 bordered">
                                                            <Blockies opts={{ seed: "foo", color: "#dfe", bgcolor: "#a71", size: 20, scale: 2, spotcolor: "#000" }} />
                                                        </div>
                                                    </div>
                                                    <div className="h-full pl-4">
                                                        <a href="https://explorer.harmony.one/#/block/0xba91dae8f32b01575233bfab246b5192627ae43de42c7931485789c92ca4f653"
                                                            target="_blank_" className="link link-hover link-accent text-sm truncate leading-relaxed">
                                                            0x5412337e51Dd9B7b57ec18bFbcEbc3eFD12884d3
                                                            </a>
                                                        <p className="text-xs truncate">100 ONE <span className="text-gray-500">• donated</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                15
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
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
                            <p>+3,003 gamers <span className="text-gray-500">have donated</span></p>
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
    )
}
