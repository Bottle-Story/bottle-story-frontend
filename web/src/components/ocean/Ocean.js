import React from 'react';
import NormalOcean from './type/NormalOcean';


export default function Ocean({ code }) {
  switch(code) {
    // case 'NORMAL_OCEAN':
    //   return <NormalOcean />;
    // case 'RAIN_OCEAN':
    //   return <RainOcean />;
    // case 'SNOW_OCEAN':
    //   return <SnowOcean />;
    // case 'SNOW_RAIN_OCEAN':
    //   return <SnowRainOcean />;
    default:
      return <NormalOcean />;
  }
}