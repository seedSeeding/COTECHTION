import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';



export default function BarGraph({ img,data,width}) {


  
  const CustomXAxisTick = ({ x, y, payload }) => {
    const id = payload.value; 
    
    console.log(id)
    return (
      <g transform={`translate(${x},${y})`}>
        {id && (
          <image
            xlinkHref={img[id]} 
          
            x={-25}
            y={0}
            width="50"
            height="50"
            alt="Product Image"
          />
        )}
      </g>
    );
  };
  return (
    <>
      {data ? (
         <BarChart
      
         width={width}
         height={600}
         data={data}
         margin={{ top: 8, right: 0, left: 20, bottom: 25 }}
       >
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="name" tick={<CustomXAxisTick />} />
         
         <Tooltip />
         
         <Bar dataKey="value" fill="#157a00" />
       </BarChart>
      ) : (
          <p>no Records</p>
      )}
    </>
  );
}
