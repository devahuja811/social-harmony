import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import useStickyState from "../../lib/useStickyState";

const providerOptions = {
    /* See Provider Options Section */
};

// sample, query from registry + uri of each
const charities = [
    {
        "id": "123",
        "organisation": "PAWS Society of Malaysia",
        "organisationBanner": "/charities/1.png", // url of image
        "description": `PAWS (PAWS Animal Welfare Society) is a non-profit animal shelter in Petaling Jaya
        that has been in operation since 1987. We receive the surrender of unwanted dogs and
        cats which we will vaccinate, deworm, neuter/spay, and put up for adoption. Currently,
        there are over 250 dogs and 250 cats under the care of the shelter.`,
        "story": "",
        "icon": "",
        "heroImages": ["/charities/1.png"], // URL of images to show
        "publicKey": "",
        "contactDetails": {
            "email": "",
            "site": "",
            "twitter": "",
            "facebook": "",
            "phone": ""
        },
        "verified": true
    },
    {
        "id": "124",
        "organisation": "Action Singapore Dogs",
        "organisationBanner": "/charities/2.jpg", // url of image
        "description": `Action for Singapore Dogs (ASD) is a registered Charity and was established 
        in December 2000 as a non-profit organization with the mission to improve the welfare of stray 
        and abandoned dogs in Singapore with a strict no-kill policy.`,
        "story": "",
        "icon": "",
        "heroImages": ["/charities/2.jpg"], // URL of images to show
        "publicKey": "",
        "contactDetails": {
            "email": "",
            "site": "",
            "twitter": "",
            "facebook": "",
            "phone": ""
        },
        "verified": true
    },
    {
        "id": "125",
        "organisation": "The Salvation Army",
        "organisationBanner": "/charities/3.jpg", // url of image
        "description": `The Salvation Army in Malaysia is in the business of changing lives. 
        Since 1938, we have been serving the underprivileged 
        community in Malaysia without discrimination.`,
        "story": "",
        "icon": "",
        "heroImages": ["/charities/3.jpg"], // URL of images to show
        "publicKey": "",
        "contactDetails": {
            "email": "",
            "site": "",
            "twitter": "",
            "facebook": "",
            "phone": ""
        },
        "verified": true
    },
    {
        "id": "126",
        "organisation": "Share",
        "organisationBanner": "/charities/4.jpg", // url of image
        "description": `Share's aims are simple - we support families in crisis and people who are 
        homeless in North Wales and Cheshire and we assist refugees fleeing for their lives, wherever 
        they are in the world.`,
        "story": "",
        "icon": "",
        "heroImages": ["/charities/4.jpg"], // URL of images to show
        "publicKey": "",
        "contactDetails": {
            "email": "",
            "site": "",
            "twitter": "",
            "facebook": "",
            "phone": ""
        },
        "verified": true
    },
    {
        "id": "127",
        "organisation": "SPCA",
        "organisationBanner": "/charities/5.png", // url of image
        "description": `Founded in 1958, Society For The Prevention of Cruelty To Animals (SPCA Selangor) 
        is a well-respected and trusted animal welfare Non-Profit Organisation (Reg No.1320) based in Ampang Jaya, 
        Selangor (Malaysia). Over the years, the organisation has gained tremendous good-will, recognition and 
        support from animal lovers all over Malaysia.`,
        "story": "",
        "icon": "",
        "heroImages": ["/charities/5.png"], // URL of images to show
        "publicKey": "",
        "contactDetails": {
            "email": "",
            "site": "",
            "twitter": "",
            "facebook": "",
            "phone": ""
        },
        "verified": false
    }
];


export default function Home() {
    const [web3Modal, setModal] = useState(null);
    const router = useRouter();
    const [latest, setLatest] = useState(0);
    const [cards, setCards] = useState(null);
    const [charitiesObj, setCharitiesObj] = useStickyState([], "charities");

    useEffect(() => {
        setLatest(2); // read from the registry contract
        // save the charity details into the localStorage
        if (charitiesObj.length === 0) {
            setCharitiesObj(charities);
        }
    }, []);


    useEffect(() => {
        setCards(charitiesObj.map(charity => {
            return (
                <div className="card transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-10 bg-neutral shadow-md">
                    <figure className="bg-neutral">
                        <img src={charity.organisationBanner} className="h-32" />
                    </figure>
                    <div className="card-body">
                        {charity.verified && (<p className="san-serif text-green-500">
                            ✓ VERIFIED
                        </p>)}
                        {!charity.verified && (<p className="san-serif text-blue-500">
                            ? UNVERIFIED
                        </p>)}
                        <p className="font-thin overflow-ellipsis">{charity.description.substring(0, 200) + (charity.description.length > 200 ? "..." : "")}</p>
                        <div className="justify-end card-actions">
                            <button title={charity.description} className="btn btn-secondary" onClick={e => router.push("/charities/details/" + charity.id)}>More info</button>
                        </div>
                    </div>
                </div>
            );
        }));
    }, [latest]);

    return (
        <div className="container md mx-auto overflow-visible py-20 px-40 w-screen">
            <div className="grid grid-flow-row grid-cols-3 grid-rows-2 gap-8">
                {cards}
            </div>
        </div>
    )
}
