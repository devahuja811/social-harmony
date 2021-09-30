import { useRouter } from 'next/router'
import { useEffect } from 'react';
import useStickyState from '../../lib/useStickyState';
import { getReporting } from '../../lib/web3/token';

function Hero() {
    const router = useRouter();

    const [reporting, setReporting] = useStickyState({
      gamesPlayed: 0,
      organisations: 0,
      moneyRaised: 0,
      ticketsPurchased: 0
    }, "overallReport");

    useEffect(async e=>{
      setReporting(await getReporting());
    }, []);

    return (<div className="flex w-screen bg-cover card h-screen bg-neutral" style={{ "backgroundImage": "url('" + `unsplash-charity-${Math.floor(Math.random() * 5) + 1}.jpeg` + "')" }}>
        <div className="hero md:min-h-screen bg-neutral bg-opacity-60 md:mt-0 mt-8">
          <div className="flex-col hero-content lg:flex-row-reverse">
            <img src="/social-harmony.png" className="max-w-sm bg-neutral bg-opacity-70 rounded-lg shadow-2xl" />
            <div>
              <h1 className="mb-5 md:text-5xl font-bold text-2xl">
                A new way to support a social cause
          </h1>
              <p className="mb-5 md:text-lg text-md">
                Choose a game, enter the draw, and win while also supporting your favourite social causes
          </p>
              <button className="btn btn-primary" onClick={e=>router.push("/charities/")}>Get Started</button>
            </div>
          </div>
        </div>
        <div className="flex md:px-8 md:mx-8 py-8 justify-center w-screen md:absolute block bottom-0">

          <div className="stats shadow bg-gradient-to-r from-green-400 to-blue-500 object-bottom md:p5" style={{ zIndex: "1000" }}>
            <div className="stat bg-opacity-0">
              <div className="stat-title text-xs">Charities</div>
              <div className="stat-value">{reporting.organisations}</div>
            </div>
            <div className="stat bg-opacity-0">
              <div className="stat-title text-xs">Games Played</div>
              <div className="stat-value">{reporting.gamesPlayed}</div>
            </div>
            <div className="stat bg-opacity-0">
              <div className="stat-title text-xs">Tickets Bought</div>
              <div className="stat-value">{reporting.ticketsPurchased}</div>
            </div>
            <div className="stat bg-opacity-0">
              <div className="stat-title text-xs">ONE Donated</div>
              <div className="stat-value">{reporting.moneyRaised}</div>
            </div>
          </div>
        </div>
      </div>);
}

export default Hero;