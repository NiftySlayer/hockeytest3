
import './App.css';
import backgroundImage from './assets/rink_coords6.png'
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { CsvReader } from './CsvReader2.js';
import GameFilter from './components/GameFilter.jsx'; // Import the GameFilter component

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
let dataForPlot = []; //initialize data for the scatterplot

function App() {

  // arrays to store the filter options for the game data
  const games = [...new Set(fullData.map(item => item.game_date))];

  const events = [...new Set(fullData.map(item => item.Event))];
  const teams = [...new Set(fullData.map(item => item.Team))];
  const periods = [...new Set(fullData.map(item => item.Period))];
  const players = [...new Set(fullData.map(item => item.Player))];

  // single variables *** change this, set these after game is chosen
  const homeTeam = fullData[0]["Home Team"];
  const awayTeam = fullData[0]["Away Team"];

  // App state variables
  const [filterOptions, setFilterOptions] = useState({ game: "", event: "", team: "", period: "", player: "" });
  const [filterFlag, setFilterFlag] = useState("true");  //used to trigger effect


  // This is where all the filtering takes place
  useEffect(() => {

    // If filterFlag is false, do not filter
    if (!filterFlag) {
      return;
    }

    const game = filterOptions.game === "" ? null : filterOptions.game;
    const event = filterOptions.event === "" ? null : filterOptions.event;
    const team = filterOptions.team === "" ? null : filterOptions.team;
    const period = filterOptions.period === "" ? null : filterOptions.period;
    const player = filterOptions.player === "" ? null : filterOptions.player;

    const filteredData = fullData.filter(fullData => {
      return ((!game || fullData.game_date === game) &&
        (!event || fullData.Event === event) &&
        (!team || fullData.Team === team) &&
        (!period || fullData.Period === period) &&
        (!player || fullData.Player === player));
    });

    //Grab the x and y coordinates from the filtered data and put them in the data array
    dataForPlot = filteredData.map(item => ({
      player: item.Player,
      color: ((item.Team == homeTeam) ? "blue" : "red"),
      xcoord: adjustXcoordinate(item.Team, item.Period, Number(item["X Coordinate"]), item.Event, homeTeam),
      ycoord: adjustYcoordinate(Number(item["Y Coordinate"]), item.Event),
    }));

    // function adjustXcoordinate(team, period, coord, hometeam) {

    //       if (team === hometeam) { ((!(period%2))===1) ? 200-coord : coord;
    //       } else { (((period%2))===1) ? 200-coord : coord;}

    //     }

    // Adjust x coordinates for changeing sides, and by home and away
    function adjustXcoordinate(team, period, xcoord, event, hometeam) {

      // Add jitter to X coordinates for faceoffs
      const jitterAmount = 3 * Math.random();
      const jitter = ((event === "Faceoff Win") ? jitterAmount : 0);

      if (team === hometeam) {

        // ((!(period%2))===1) ? 200-coord : coord;

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
        
        <p style={{color:"blue", marginLeft:"60px"}}>Home Team: {homeTeam} </p>
        <p style={{color:"red", marginLeft:"60px"}}>Away Team: {awayTeam} </p>
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
      <GameFilter games={games} events={events} teams={teams} periods={periods} players={players} handleFilterSet={setFilterOptions} handleSetFilterFlag={setFilterFlag} />
    </div>

  )
}

export default App;
