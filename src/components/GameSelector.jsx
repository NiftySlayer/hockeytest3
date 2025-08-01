import { useState } from "react";

function GameSelector({ games, game, handleGameSet }) {
    return (
        <div className="game-filter">
            <select
                className="selectFilter"
                defaultValue={game}
                onChange={(e) => { handleGameSet(e.target.value); console.log("Game Selected: ", game)}}>
                <option value="" disabled>
                    Choose a game
                </option>
                {games.map((game, index) => (
                    <option key={index} value={game}>
                        {game}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default GameSelector;