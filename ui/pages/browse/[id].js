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
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons'
import useStickyState from "../../lib/useStickyState";
import OrgDetails from "../../components/main/orgDetails";
import GameButton from "../../components/main/gameButton";
import UserContext from "../../lib/web3/userContext";
import { getGame, particpatingInGame, playGame } from "../../lib/web3/token";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

library.add(fab, fas);

export default function Home() {
    const router = useRouter();
    const [tab, setTab] = useState(0);

    const { id } = router.query;
    const [selected, selectedGamesObj] = useStickyState(null, "game");
    const [games, setGames] = useStickyState([], "games");
    const [charities, setCharities] = useStickyState([], "charities");
    const [charity, setCharity] = useState({});
    const [entered, setEntered] = useState(false);
    const [user, setUser] = useStickyState({}, "user");
    const [buttonUpdating, setUpdating] = useState(false);

    let color = "warning";
    let percent = 0;
    if (selected?.status === "pending" || selected?.status === "cancelled" && !selected?.endorsed) { // endorsement
        percent = 100 * (+selected?.currentEndorsers) / (+selected?.totalEndorsers + 1);
    }
    else { // 
        percent = 100 * (+selected?.entries) / (+selected?.totalParticipants + 1);
    }

    // if (percent < 30) color = "warning";
    // else if (percent < 60) color = "info";

    useEffect(() => {
        if (!id || !games || games.length === 0) return;
        if (selected) return;

        const sel = games.filter(e => e.id === id)[0];
        selectedGamesObj(sel);

        const c = sel.organisation;
        setCharity(charities.filter(e => e.id === c)[0]);

    }, [selected, games, id]);

    useEffect(() => {
        if (UserContext.user.isAuthorized && selected) {
            particpatingInGame(selected.id).then(result => {
                if (result.daoEscrow !== "0") {
                    // already entered the game
                    setEntered(true);
                }
            });
        }
        if (!UserContext.user.isAuthorized) {
            setEntered(false);
        }
    }, [UserContext.user.isAuthorized, selected]);

    const handleClick = async (game) => {
        // game completed/cancelled? ignore
        if (game.status !== "active") {
            return; // should change the button as well
        }

        if (!UserContext.user.isAuthorized) {
            await UserContext.user.signin();
            UserContext.setUser(UserContext.user);
        }

        const result = await playGame(game.id);
        setUpdating(true);
        console.log(result);
        if (result.status === "rejected") {
            // tell user they already entered the game ...
            Swal.fire(
                'Already Joined!',
                'You have already joined the game! Only one address per entry.',
                'error'
              );
        }
        else {
            // indicate they have already entered this game!

            // refresh selected game
            const gameObj = await getGame(game.id);
            selectedGamesObj(gameObj);

            Swal.fire(
                'Success',
                'You have successfully joined the social game!',
                'success'
              );
        }
        setUpdating(false);
        setEntered(true);
    }

    const entries = (+(selected?.totalParticipants)) * (+(selected?.costPerEntry));
    const total = entries * 6.40; // note - use price from exchange, currently hardcoded

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
                                    <div key={img} className="w-full carousel-item">
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
                                selected?.about?.split("\n").map((e, i) => {
                                    return <p key={i} className="font-thin leading-relaxed pb-4">{e}</p>
                                })
                            }
                            <div className="justify-start">
                                <GameButton game={selected} entered={entered} externalClickHandler={handleClick} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-none w-1/4 ml-4">
                    <div className="card bordered bg-gray-800 compact">
                        <div className="card-body divide-y">
                            <div className="pb-4">
                                {selected && selected?.status !== "pending" && <h2 className="card-title">{selected?.entries} Participants</h2>}
                                {selected && selected?.status !== "pending" && <progress className={"progress progress-" + color} value={+selected?.entries} max={+selected?.totalParticipants}></progress>}
                                {selected && selected?.status !== "pending" && <p className="text-xs text-gray-400 font-thin leading-relaxed">Of {selected?.totalParticipants} Participants Goal</p>}
                                {selected && selected?.status !== "pending" && <p className="font-thin">@ {selected?.costPerEntry} ONE per entry <span className="text-gray-400">($6.40)</span></p>}
                                {selected && selected?.status !== "pending" && <p className="py-2">Goal {entries} ONE <span className="text-gray-400">(${total})</span></p>}

                                {selected && selected?.status === "pending" && <h2 className="card-title">{selected?.currentEndorsers} Endorsers</h2>}
                                {selected && selected?.status === "pending" && <progress className={"progress progress-" + color} value={+selected?.currentEndorsers} max={+selected?.totalEndorsers}></progress>}
                                {selected && selected?.status === "pending" && <p className="text-xs text-gray-400 font-thin leading-relaxed">Of {selected?.totalEndorsers} Endorser Goal</p>}
                            </div>
                            <div className="pt-4">
                                {selected?.status !== "pending" && selected?.endorsed && (<p className="san-serif text-green-500">
                                    ✓ ENDORSED
                                </p>)}
                                {selected?.status === "pending" && (<p className="san-serif text-blue-500">
                                    ? PENDING ENDORSEMENT
                                </p>)}
                                {selected?.status === "completed" && (<p className="san-serif text-blue-500">
                                    ✓ GAME COMPLETE
                                </p>)}
                                {selected?.status === "cancelled" && (<p className="san-serif text-red-500">
                                    x GAME CANCELLED
                                </p>)}

                                {!selected?.status === "active" && <p className="font-thin text-xs italic">Game must be endorsed before starting</p>}

                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <GameButton game={selected} updating={buttonUpdating} entered={entered} externalClickHandler={handleClick} />
                    </div>
                    <OrgDetails charity={charity} />
                </div>
            </div>
        </div >
    );
}
