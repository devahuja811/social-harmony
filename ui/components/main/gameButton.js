import { useRouter } from 'next/router'
import useStickyState from '../../lib/useStickyState';

function GameButton({ game, externalClickHandler }) {

    const router = useRouter();
    const [gameObj, setSelected] = useStickyState(game, "game");

    const handleClick = () => {
        if (externalClickHandler) {
            externalClickHandler(game);
        }
        else {
            setSelected(game);
            router.push("/browse/" + game?.id);
        }
    };
    // pending endorsement, active, completed or cancelled
    // 
    return (<div>
        {game?.status !== "cancelled" && game?.status !== "completed" && game?.endorsed &&
            (<button className="btn btn-secondary flex-1 mt-4" onClick={handleClick}>Join the Cause</button>)
        }
        {game?.status !== "cancelled" && game?.status !== "completed" && !game?.endorsed &&
            (<button className="btn btn-primary flex-1 mt-4" onClick={handleClick}>Endorse Game</button>)
        }
        {game?.status === "completed" &&
            (<button className="" onClick={handleClick}><img src="/assets/completed.png" /></button>)
        }
        {game?.status === "cancelled" &&
            (<button className="" onClick={handleClick}><img src="/assets/cancelled.png" /></button>)
        }
    </div>);
}

export default GameButton;