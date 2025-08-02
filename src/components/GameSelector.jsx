function GameSelector({ games, game, handleGameSet }) {
    return (
        <div className="game-filter">
            <label className="gameMenu">  Choose Game  </label>
            <select
                className="selectFilter"
                defaultValue={game}
                onChange={(e) => { handleGameSet(e.target.value);}}>
                <option value="" disabled>
                    Choose a game
                </option>
                {games.map((game, index) => (
                    <option key={index} value={game}>
                        {game}
                    </option>
                ))}
            </select>
            <br/>
              <br/>
        </div>
    );
}

export default GameSelector;