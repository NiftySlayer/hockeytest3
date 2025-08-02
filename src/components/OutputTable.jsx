import React from 'react';

function OutputTable() {
  const data1 = [
    { name: 'Alice', age: 30, city: 'New York' },
    { name: 'Bob', age: 24, city: 'London' },
    { name: 'Charlie', age: 35, city: 'Paris' },
  ];

  console.log("In the table code");
  //console.log(outputData);

  // Extract column headers from the first data object
  const columns = Object.keys(data1[0] || {});

  return (
    <div>
      <table>


        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.toUpperCase()}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data1.map((row) => (
            <tr key={row.id}> {/* Assuming 'id' is a unique identifier */}
              {columns.map((column, index) => (
                <td key={index}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>



        {/*<thead>
          <tr>
            <th>Team</th>
            <th>Player</th>
            <th>Event</th>
          </tr>
        </thead>*/}


        {/*<tbody>
          {data1.map((row, index) => (
            <tr key={index}>
              <td>{row.Team}</td>
              <td>{row.Player}</td>
              <td>{row.Event}</td>
            </tr>
          ))}
        </tbody> */}



      </table>
    </div>
  );
}

export default OutputTable;