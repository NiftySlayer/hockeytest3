import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// const data = [
//   { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
//   { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
//   // ... more data
// ];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`}>
          howdy
          hello

           {/* <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>*/}
          </p>
        ))}
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