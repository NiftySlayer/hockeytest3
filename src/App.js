import './App.css';
import backgroundImage from './assets/rink_coords6.png'
import { useEffect, useState } from 'react';
import { CsvReader } from './CsvReader2.js';
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


function App() {

  // retrieve the data asynchronously from the CSV file once when the component mounts
  const [fullData, setFullData] = useState([]);
  const [games, setGames] = useState([]);

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
      // print the number of dimensions in the data array
      // console.log("Number of dimensions in the data array: " + Object.keys(data[0]).length);
      // console.log("Number of games in the data array: " + games.length);
      // console.log("Number of rows in the data array: " + data.length);
    });
  }, []);

  //let filteredForGameData = [];
  //let events = [];
  //let teams = [];
  //let players = [];
  //let periods = [];
  const [dataForPlot, setDataForPlot] = useState([]); //initialize data for the scatterplot
  const [filteredData, setFilteredData] = useState([]);
  //let homeTeam = "";
  //let awayTeam = "";


  // App state variables
  const [filterOptions, setFilterOptions] = useState({ event: "", team: "", period: "", player: "" });
  const [filterFlag, setFilterFlag] = useState("true");  //used to trigger effect

  const [gameOption, setGameOption] = useState("");
  const [gameFlag, setGameFlag] = useState("false");  //used to trigger effect

  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [players, setPlayers] = useState([]);

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");

  const [filteredForGameData, setFilteredForGameData] = useState([]);



  // Run when Game has been chosen
  useEffect(() => {

    console.log("In useEffect1. GameOption is: " + gameOption);

    // filter the full data set for the selected gameOption
    if (gameOption === "") {
      setFilteredForGameData([]); // reset filtered data if no game is selected
      return;
    }

    for (let i = 0; i < fullData.length; i++) {
      if (fullData[i].game_date === gameOption) {
        filteredForGameData.push(fullData[i]);
      }
    }
    // get rid of duplicates in the filteredForGameData array
    setFilteredForGameData(filteredData => [...new Set(filteredData)]);


    // filter the full data set for this game only
    //filteredForGameData = fullData.filter(fullData => fullData.game_date === gameOption);
    // setFilteredForGameData([fullData.filter(x => x.game_date === gameOption)]);
    // debugger
    setFilterOptions({ event: "", team: "", period: "", player: "" }); //reset the filter items when a game changes
    setFilterFlag("false"); //reset the filter flag to indicate no filters have been applied
    // setGameFlag("false"); //reset the game flag
    // //setPeriods([]);

    // set the values for the filter menus
    setEvents([...new Set(filteredForGameData.map(item => item.Event))])
    setTeams([...new Set(filteredForGameData.map(item => item.Team))]);
    setPeriods([...new Set(filteredForGameData.map(item => item.Period))])
    setPlayers([...new Set(filteredForGameData.map(item => item.Player))])
    setHomeTeam([...new Set(filteredForGameData.map(item => item["Home Team"]))])
    setAwayTeam([...new Set(filteredForGameData.map(item => item["Away Team"]))])

  }, [gameOption]);

  


  // This is where all the filtering takes place
  useEffect(() => {

    // If filterFlag is false, do not filter
    //if ((!filterFlag) && (gameFlag)) {
    if ((!filterFlag)) {
      return;
    }

    const event = filterOptions.event === "" ? null : filterOptions.event;
    const team = filterOptions.team === "" ? null : filterOptions.team;
    const period = filterOptions.period === "" ? null : filterOptions.period;
    const player = filterOptions.player === "" ? null : filterOptions.player;

    const filtered = filteredForGameData.filter(filteredForGameData => {
      return (
        (!event || filteredForGameData.Event === event) &&
        (!team || filteredForGameData.Team === team) &&
        (!period || filteredForGameData.Period === period) &&
        (!player || filteredForGameData.Player === player));
    });

    setFilteredData(filtered);

    //Grab the x and y coordinates from the filtered data and put them in the data array
    const plotData = filtered.map(item => ({
      player: item.Player,
      color: ((item.Team === homeTeam) ? "blue" : "red"),
      xcoord: adjustXcoordinate(item.Team, item.Period, Number(item["X Coordinate"]), item.Event, homeTeam),
      ycoord: adjustYcoordinate(Number(item["Y Coordinate"]), item.Event),
    }));

    setDataForPlot(plotData);

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
    //setFilterFlag(false);

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

          <Scatter data={dataChris}>
            {dataChris.map((entry, index) => (
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
    </div>

  )
}

export default App;
