import React from 'react';

function OutputTable() {
  const data1 = [
    { name: 'Alice', age: 30, city: 'New York' },
    { name: 'Bob', age: 24, city: 'London' },
    { name: 'Charlie', age: 35, city: 'Paris' },
  ];

console.log("In the table code");
//console.log(outputData);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Player</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          {data1.map((row, index) => (
            <tr key={index}>
              <td>{row.Team}</td>
              <td>{row.Player}</td>
              <td>{row.Event}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OutputTable;