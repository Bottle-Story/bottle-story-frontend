import React from 'react';
import NormalOcean from './type/NormalOcean';
import DawnOcean from './type/DawnOcean';
import DayOcean from './type/DayOcean';
import SunRiseSetOcean from './type/SunRiseSetOcean';
import NightOcean from './type/NIghtOcean';


export default function Ocean({ code }) {

  switch(code) {
    case 'NORMAL_OCEAN':
      return <NormalOcean />;
    case 'DAY_OCEAN':
      return <DayOcean />;
    case 'DAWN_OCEAN':
      return <DawnOcean />;
    case 'NIGHT_OCEAN':
      return <NightOcean />;
    case 'SUN_RISE_SET_OCEAN':
      return <SunRiseSetOcean />;
    default:
      return <NormalOcean />;
  }
}