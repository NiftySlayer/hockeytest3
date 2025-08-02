import { useState } from "react";

// Handles the filtering menus
function GameFilter({ events, teams, periods, players, handleFilterSet, handleSetFilterFlag }) {

    // Set state variables
    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState("");

    //change handlers
    const handleFilterChange = () => {
        handleFilterSet({
            event: selectedEvent,
            team: selectedTeam,
            period: selectedPeriod,
            player: selectedPlayer
        });

        handleSetFilterFlag("true"); // Set the filter flag to true to indicate that a filter has been applied
    };

    return (
        <div className="game-filter">
            <h5>Filter Options:</h5>

            <select id="sellEv" className="selectFilter" value={selectedEvent} multiple={false} onChange={(e) => { setSelectedEvent(e.target.value) }}>
                <option value="">All Events</option>
                {events.map((event, index) => (
                    <option key={index} value={event}>
                        {event}
                    </option>
                ))}
            </select>

            <select className="selectFilter" value={selectedTeam} multiple={false} onChange={(e) => { setSelectedTeam(e.target.value) }}>
                <option value="">All Teams</option>
                {teams.map((team, index) => (
                    <option key={index} value={team}>
                        {team}
                    </option>
                ))}
            </select>

            <select className="selectFilter" value={selectedPeriod} onChange={(e) => { setSelectedPeriod(e.target.value) }}>
                <option value="">All Periods</option>
                {periods.map((period, index) => (
                    <option key={index} value={period}>{period}</option>
                ))}
            </select>

            <select className="selectFilter" value={selectedPlayer} onChange={(e) => { setSelectedPlayer(e.target.value) }}>
                <option value="">All Players</option>
                {players.map((player, index) => (
                    <option key={index} value={player}>{player}</option>
                ))}
            </select>

            <div>
                <button className="filterButton" onClick={handleFilterChange}>Submit Filters</button>
            </div>

        </div>
    );
}

export default GameFilter;