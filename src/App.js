import './App.css';
import backgroundImage from './assets/rink_coords6.png'
import { useEffect, useState } from 'react';
import { CsvReader } from './CsvReader.js';
import GameFilter from './components/GameFilter.jsx'; // Import the GameFilter component
import GameSelector from './components/GameSelector.jsx'; // Import the GameSelector component
import CustomTooltip from './components/CustomTooltip.jsx';
//import 'bootstrap/dist/css/bootstrap.min.css';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  ScatterChart,
  Cell,
} from "recharts";
import OutputTable from './components/OutputTable.jsx';



function App() {

  // retrieve the data asynchronously from the CSV file once when the component mounts
  const [fullData, setFullData] = useState([]);
  const [games, setGames] = useState([]);

  // useEffect #1 -- Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        return await CsvReader(); // get all the data from the file
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData().then((data) => {
      setGames([...new Set(data.map(item => item.game_date))]);
      setFullData(data);
    });
  }, []);

  // App state variables
  const [filterOptions, setFilterOptions] = useState({ event: " ", team: " ", period: " ", player: " " });
  const [filterFlag, setFilterFlag] = useState("false");
  const [gameOption, setGameOption] = useState("");
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [players, setPlayers] = useState([]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [filteredForGameData, setFilteredForGameData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [dataForPlot, setDataForPlot] = useState([]); //initialize data for the scatterplot


  // ***  useEffect #2 -- Run when Game has been chosen
  useEffect(() => {
    // reset the data for when a new game is selected
    setDataForPlot([]);
    setHomeTeam("");
    setAwayTeam("");
    setTeams([]);
    setEvents([]);
    setPeriods([]);
    setPlayers([]);
    setFilteredForGameData([]);

    // Reset filter options when a game changes
    setFilterOptions({ event: "", team: "", period: "", player: "" }); /// ****** This is not working
    setFilterFlag("false"); //reset the filter flag to indicate no filters have been applied

    console.log("Top of effect2:");
    console.log("event: " + filterOptions.event);
    console.log("team: " + filterOptions.team);
    console.log("In useEffect1. GameOption is: " + gameOption);

    // filter the full data set for the selected gameOption
    if (gameOption === "") {
      setFilteredForGameData([]); // reset filtered data if no game is selected
      return;
    }

    // Use filter instead of mutating array
    const filteredGameData = fullData.filter(item => item.game_date === gameOption);
    setFilteredForGameData(filteredGameData);

    // Set the values for the filter menus and teams
    const eventsSet = new Set(filteredGameData.map(item => item.Event));
    const teamsSet = new Set(filteredGameData.map(item => item.Team));
    const periodsSet = new Set(filteredGameData.map(item => item.Period));
    const playersSet = new Set(filteredGameData.map(item => item.Player));
    const homeTeamArr = [...new Set(filteredGameData.map(item => item["Home Team"]))];
    const awayTeamArr = [...new Set(filteredGameData.map(item => item["Away Team"]))];

    setEvents([...eventsSet]);
    setTeams([...teamsSet]);
    setPeriods([...periodsSet]);
    setPlayers([...playersSet]);
    setHomeTeam(homeTeamArr.length > 0 ? homeTeamArr[0] : "");
    setAwayTeam(awayTeamArr.length > 0 ? awayTeamArr[0] : "");

    console.log("");
    console.log(" ********* New Date Game ********");
    console.log("filterOptions in effect1:")
    console.log(filterOptions);
    console.log("Teams after I changed date");
    console.log("Teamset:")
    console.log(teamsSet);

    console.log("teams:")
    console.log(teams);

    console.log(`homeTeam after set: ${homeTeamArr.length > 0 ? homeTeamArr[0] : ""}`);
    console.log(`awayTeam after set: ${awayTeamArr.length > 0 ? awayTeamArr[0] : ""}`);

  }, [gameOption, fullData]);


  // ***  useEffect # 3 - Filter the game data for final plot points
  useEffect(() => {

    // If filterFlag is false, do not filter
    if ((filterFlag === "false")) {
      return;
    }

    setFiltered([]); // clear out the filtered data before creating new

    console.log(" ");
    console.log("*********** New Filter************");

    // Get the user choices from select menues, use all in category if no choice
    const event = filterOptions.event === "" ? null : filterOptions.event;
    const team = filterOptions.team === "" ? null : filterOptions.team;
    const period = filterOptions.period === "" ? null : filterOptions.period;
    const player = filterOptions.player === "" ? null : filterOptions.player;

    console.log("filterOptions in effect2:")
    console.log(filterOptions);
    console.log("event:" + event);
    console.log("team:" + team);
    console.log("period:" + period);
    console.log("player:" + player);

    const filtered = filteredForGameData.filter(filteredForGameData => {
      return (
        (!event || filteredForGameData.Event === event) &&
        (!team || filteredForGameData.Team === team) &&
        (!period || filteredForGameData.Period === period) &&
        (!player || filteredForGameData.Player === player));
    });


    // setFiltered(filteredForGameData.filter(filteredForGameData => {
    //   return (
    //     (!event || filteredForGameData.Event === event) &&
    //     (!team || filteredForGameData.Team === team) &&
    //     (!period || filteredForGameData.Period === period) &&
    //     (!player || filteredForGameData.Player === player));
    // }));

    console.log("filteredForGameData:");
    console.log(filteredForGameData);

    console.log("filtered data");
    console.log(filtered);

    // Use the game filtered array to further filter for chosen categories
    // const filtered = filteredForGameData.filter(filteredForGameData => {
    //   return (
    //     (!event || filteredForGameData.Event === event) &&
    //     (!team || filteredForGameData.Team === team) &&
    //     (!period || filteredForGameData.Period === period) &&
    //     (!player || filteredForGameData.Player === player));
    // });

    //Grab the x and y coordinates from the filtered data and put them in the data array
    const plotData = filtered.map(item => ({
      player: item.Player,
      event: item.Event,
      detail1: item["Detail 1"],
      detail2: item["Detail 2"],
      detail3: item["Detail 3"],
      detail4: item["Detail 4"],
      color: ((item.Team === homeTeam) ? "blue" : "red"),
      xcoord: adjustXcoordinate(item.Team, item.Period, Number(item["X Coordinate"]), item.Event, homeTeam),
      ycoord: adjustYcoordinate(Number(item["Y Coordinate"]), item.Event),
    }));

    setDataForPlot(plotData); //set the plot points

    // Adjust x coordinates for changing sides, and by home and away
    function adjustXcoordinate(team, period, xcoord, event, hometeam) {

      // Add jitter to X coordinates for faceoffs
      const jitterAmount = 5 * Math.random();
      const jitter = ((event === "Faceoff Win") ? jitterAmount : 0);

      if (team === hometeam) {
        if (!(period % 2 === 1)) {
          return (200 - xcoord - jitter);
        } else {
          return xcoord - jitter;
        }
      } else {
        if ((period % 2 === 1)) {
          return 200 - xcoord - jitter;
        } else {
          return xcoord - jitter;
        }
      }
    }

    // Add jitter to Y coordinates for faceoffs
    function adjustYcoordinate(ycoord, event) {
      const jitterAmount = 5 * Math.random();
      const jitter = ((event === "Faceoff Win") ? jitterAmount : 0);
      return ycoord - jitter;
    }

  }, [filterFlag, filterOptions, homeTeam, awayTeam]);

  return (
    <div>
      {/* {filteredData ? 
        filteredData.map((item, index) => (
          <div key={index}>
            <p>Game Date: {item.game_date}</p>
            <p>Event: {item.Event}</p>
            <p>Team: {item.Team}</p>
            <p>Period: {item.Period}</p>
            <p>Player: {item.Player}</p>
          </div>
        ))
        : <p>No data available</p>
    } */}


      <div>

        <p style={{ color: "blue", marginLeft: "60px" }}>Home Team: {homeTeam}</p>
        <p style={{ color: "red", marginLeft: "60px" }}>Away Team: {awayTeam}</p>
      </div>

      <div
        className="App"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "beige",
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "58px 5px",
          backgroundSize: '92%',
          backgroundRepeat: "no-repeat",
          height: "300px",
          width: "710px"
        }}
      >

        <ScatterChart width={720} height={320}>
          <CartesianGrid></CartesianGrid>
          <XAxis axisLine={false} tick={false} type="number" dataKey="xcoord" name="xcoord" domain={[0, 200]}></XAxis>
          <YAxis axisLine={false} tick={false} type="number" dataKey="ycoord" name="ycoord" domain={[0, 85]}></YAxis>
          <Tooltip content={<CustomTooltip />}></Tooltip>

          <Scatter data={dataForPlot} shape="circle" fill="#8884d8">
            {dataForPlot.map((entry, index) => (
              <Cell key={`${index}`} fill={entry.color} />
            ))}
          </Scatter>

          {/*<Scatter data={data} fill="blue"></Scatter>*/}
        </ScatterChart>
      </div >

      <br />
      <br />

      {/*<GameFilter games={games} events={events} teams={teams} periods={periods} players={players} handleFilterSet={setFilterOptions} /> */}
      <GameSelector games={games} game={gameOption} handleGameSet={setGameOption} />
      <GameFilter events={events} teams={teams} periods={periods} players={players} handleFilterSet={setFilterOptions} handleSetFilterFlag={setFilterFlag} />
      {/*<OutputTable outputData={filtered}/> */}
    </div>
  );
}

export default App;