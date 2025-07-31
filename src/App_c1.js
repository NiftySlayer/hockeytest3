
import './App.css';
import backgroundImage from './assets/rink_coords6.png'
//import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { CsvReader } from './CsvReader2.js';
import GameFilter from './components/GameFilter.jsx'; // Import the GameFilter component
import GameSelector from './components/GameSelector.jsx'; // Import the GameSelector component

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  ScatterChart,
  Cell,
} from "recharts";


const fullData = await CsvReader(); // get all the data from test file
let filteredForGameData = [];
let events = [];
let teams = [];
let players = [];
let periods = [];
let dataForPlot = []; //initialize data for the scatterplot
let filteredData = [];


const dataChris = [

  {
    color: "red",
    xcoord: 150,
    ycoord: 70
  },
  {
    color: "blue",
    xcoord: 80,
    ycoord: 49
  },
]



//let filteredForGameData = [];

function App() {

  // arrays to store the filter options for the game data
  const games = [...new Set(fullData.map(item => item.game_date))];

  // App state variables
  const [filterOptions, setFilterOptions] = useState({ event: "", team: "", period: "", player: "" });
  const [filterFlag, setFilterFlag] = useState("true");  //used to trigger effect
  // <GameFilter events={events} teams={teams} periods={periods} players={players} handleFilterSet={setFilterOptions} handleSetFilterFlag={setFilterFlag} />

  const [gameOption, setGameOptions] = useState("");
  const [gameFlag, setGameFlag] = useState("false");  //used to trigger effect
  //GameSelector games={games} handleGameSet={setGameOptions} handleGameSetFlag={setGameFlag} />

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");


  // Run when Game has been chosen
  useEffect(() => {

    //If game hasnt been chosen then skip
    if (!gameFlag) {
      return;
    }

    filteredForGameData = fullData.filter(x => x.game_date === gameOption.game);
    events = [...new Set(filteredForGameData.map(item => item.Event))];
    teams = [...new Set(filteredForGameData.map(item => item.Team))];
    periods = [...new Set(filteredForGameData.map(item => item.Period))];
    players = [...new Set(filteredForGameData.map(item => item.Player))];

    //setHomeTeam(filteredForGameData[0]["Home Team"]);
    //setAwayTeam(filteredForGameData[0]["Away Team"]);

  }, [gameFlag, gameOption, homeTeam, awayTeam]);



  // This is where all the filtering takes place
  useEffect(() => {

    // If filterFlag is false, do not filter
    if ((!filterFlag) && (gameFlag)) {
      return;
    }

    const event = filterOptions.event === "" ? null : filterOptions.event;
    const team = filterOptions.team === "" ? null : filterOptions.team;
    const period = filterOptions.period === "" ? null : filterOptions.period;
    const player = filterOptions.player === "" ? null : filterOptions.player;

    filteredData = filteredForGameData.filter(filteredForGameData => {
      return (
        (!event || filteredForGameData.Event === event) &&
        (!team || filteredForGameData.Team === team) &&
        (!period || filteredForGameData.Period === period) &&
        (!player || filteredForGameData.Player === player));
    });



    //Grab the x and y coordinates from the filtered data and put them in the data array
    dataForPlot = filteredData.map(item => ({
      player: item.Player,
      color: ((item.Team === homeTeam) ? "blue" : "red"),
      xcoord: adjustXcoordinate(item.Team, item.Period, Number(item["X Coordinate"]), item.Event, homeTeam),
      ycoord: adjustYcoordinate(Number(item["Y Coordinate"]), item.Event),
    }));

    // Adjust x coordinates for changeing sides, and by home and away
    function adjustXcoordinate(team, period, xcoord, event, hometeam) {

      // Add jitter to X coordinates for faceoffs
      const jitterAmount = 3 * Math.random();
      const jitter = ((event === "Faceoff Win") ? jitterAmount : 0);

      if (team === hometeam) {

        if (!(period % 2 === 1)) {

          return (200 - xcoord - jitter);
        }
        else {
          return xcoord - jitter;
        }

      } else {

        if ((period % 2 === 1)) {

          return 200 - xcoord - jitter;
        }
        else {
          return xcoord - jitter;
        }
      }

    }

    // Add jitter to Y coordinates for faceoffs
    function adjustYcoordinate(ycoord, event) {
      const jitterAmount = 3 * Math.random();;
      const jitter = ((event === "Faceoff Win") ? jitterAmount : 0);
      return ycoord - jitter;
    }

    // Set the filter flag back to false after filtering
    setFilterFlag(false);

  }, [filterFlag]);



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

        <p style={{ color: "blue", marginLeft: "60px" }}>Home Team:  </p>
        <p style={{ color: "red", marginLeft: "60px" }}>Away Team:  </p>
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
          <Tooltip></Tooltip>

          <Scatter data={dataForPlot}>
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
      <GameSelector games={games} handleGameSet={setGameOptions} handleGameSetFlag={setGameFlag} />
      <GameFilter events={events} teams={teams} periods={periods} players={players} handleFilterSet={setFilterOptions} handleSetFilterFlag={setFilterFlag} />
    </div>

  )
}

export default App;
