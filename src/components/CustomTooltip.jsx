import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// const data = [
//   { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
//   { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
//   // ... more data
// ];

//https://recharts.org/en-US/examples/CustomContentOfTooltip


// const plotData = filtered.map(item => ({
//       player: item.Player,
//       event: item.Event,
//       detail1: item.Detail1,
//       color: ((item.Team === homeTeam) ? "blue" : "red"),
//       xcoord: adjustXcoordinate(item.Team, item.Period, Number(item["X Coordinate"]), item.Event, homeTeam),
//       ycoord: adjustYcoordinate(Number(item["Y Coordinate"]), item.Event),
//     }));

// <div className="custom-tooltip">
//         <h4>{label}</h4>
//         <p>UV: {uv}</p>
//         <p>PV: {pv}</p>
//         <p>Amount: {amt}</p>
//       </div>

//const CustomTooltip = ({ active, payload, label }) => {
//if (active && payload && payload.length) {

const CustomTooltip = ({ payload }) => {
  if (payload && payload.length) {

    //const { pl, ev, det, cl, xc, yc } = payload[0].payload;

    const pl = payload[0].payload.player;
    const ev = payload[0].payload.event;
    const de1 = payload[0].payload.detail1;
    const de2 = payload[0].payload.detail2; //shot destination
    const de3 = payload[0].payload.detail3; //traffic
    const de4 = payload[0].payload.detail4; //One timer

    var detail1;

    //const traffic = de3 === "" ? null : "traffic";

    //const detail1 = de1 === "" ? null : ((de3 === 't') ? "true" : "false");
    const traffic = de3 === "" ? null : ((de3 === 't') ? "True" : "False");
    const oneTimer = de4 === "" ? null : ((de4 === 't') ? "True" : "False");

    switch (ev) {

      case "Dump In/Out":
        detail1 = "Possession:";
        break;

      case "Faceoff Win":
        detail1 = "Faceoff Method:";
        break;

      case "Goal":
        detail1 = "Shot Type:";
        break;

      case "Incomplete Play":
        detail1 = "Pass Type:";
        break;

      case "Penalty Taken":
        detail1 = "Penalty Type:";
        break;

      case "Play":
        detail1 = "Pass Type:";
        break;

      case "Shot":
        detail1 = "Shot Type:";
        break;

      case "Zone Entry":
        detail1 = "Entry Type:";
        break;

      default:
        detail1 = "";
    }


    //console.log("payload: " + payload.player);

    return (
      <div style={{ fontSize: "12px", textAlign: "left", backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <p>Event: {ev}</p>
        <p>Player: {pl}</p>
        {de1 ? <p>{detail1} {de1}</p> : null}
        {de2 ? <p>Shot Destination: {de2}</p> : null}
        {de3 ? <p>Traffic: {traffic}</p> : null}
        {de4 ? <p>One Timer: {oneTimer}</p> : null}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;

// function MyChartWithCustomTooltip() {
//   return (
//     <LineChart width={500} height={300} data={data}>
//       <XAxis dataKey="name" />
//       <YAxis />
//       <CartesianGrid strokeDasharray="3 3" />
//       <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//       <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
//       <Tooltip content={<CustomTooltip />} /> {/* Custom Tooltip */}
//     </LineChart>
//   );
// }


//<div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
// <p className="label">{`${label}`}</p>
// {payload.map((entry, index) => (
//   <p key={`item-${index}`}>
//   howdy
//   hello

//    {/* <p key={`item-${index}`} style={{ color: entry.color }}>
//     {`${entry.name}: ${entry.value}`}
//   </p>*/}
//   </p>
// ))}
//</div>