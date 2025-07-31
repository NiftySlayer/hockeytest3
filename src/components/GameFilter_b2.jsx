import { useState } from "react";

function GameFilter({ games, events, teams, periods, players, handleFilterSet, handleSetFilterFlag }) {

    // Set state variables
    const [selectedGame, setSelectedGame] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState("");

    //change handlers
    const handleFilterChange = () => {
        handleFilterSet({
            game: selectedGame,
            event: selectedEvent,
            team: selectedTeam,
            period: selectedPeriod,
            player: selectedPlayer
        });

        handleSetFilterFlag(true); // Set the filter flag to true to indicate that a filter has been applied
    };

    return (
        <div className="game-filter">

            <select className="selectFilter" value={selectedGame} onChange={(e) => { setSelectedGame(e.target.value) }}>
                <option value="">All Games</option>
                {games.map((game, index) => (
                    <option key={index} value={game}>{game}</option>
                ))}
            </select>

            <select className="selectFilter" value={selectedEvent} onChange={(e) => { setSelectedEvent(e.target.value) }}>
                <option value="">All Events</option>
                {events.map((event, index) => (
                    <option key={index} value={event}>{event}</option>
                ))}
            </select>

            <select className="selectFilter" value={selectedTeam} onChange={(e) => { setSelectedTeam(e.target.value) }}>
                <option value="">All Teams</option>
                {teams.map((team, index) => (
                    <option key={index} value={team}>{team}</option>
                ))}
            </select>

            <select className="selectFilter" value={selectedPeriod} onChange={(e) => { setSelectedPeriod(e.target.value) }}>
                <option value="">All Periods</option>
                {periods.map((period, index) => (
                    <option key={index} value={period}>{period}</option>
                ))}
            </select>

            <select className="selectFilter" value={selectedPlayer} onChange={(e) => { setSelectedPlayer(e.target.value)}}>
                <option value="">All Players</option>
                {players.map((player, index) => (
                    <option key={index} value={player}>{player}</option>
                ))}
            </select>

            <div>
                <button onClick={handleFilterChange}>Submit</button>
            </div>

        </div>
    );
}

export default GameFilter;