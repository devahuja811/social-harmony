// search bar
// quick filters for tags
// 5 columns with info on each
// click to view details

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'


const providerOptions = {
    /* See Provider Options Section */
};


export default function Home() {
    const [web3Modal, setModal] = useState(null);
    const router = useRouter();

    return (
        <div className="container md mx-auto overflow-visible py-20 px-40 w-screen">

            <div className="form-control py-8">
                <div className="relative">
                    <input type="text" placeholder="Search by Tag or Charity" className="w-full pr-16 input input-info input-bordered" />
                    <button className="absolute right-0 top-0 rounded-l-none btn btn-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
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
    )
}
