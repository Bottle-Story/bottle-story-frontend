import React from 'react';
import DawnMoonClear from './type/DawnMoonClear';
import DawnMoonCloudy from './type/DawnMoonCloudy';
import DawnMoonOvercast from './type/DawnMoonOvercast';
import SunriseProgressClear from './type/SunriseProgressClear';
import SunriseProgressCloudy from './type/SunriseProgressCloudy';
import SunriseProgressOvercast from './type/SunriseProgressOvercast';
import DayClear from './type/DayClear';
import DayCloudy from './type/DayCloudy';
import DayOvercast from './type/DayOvercast';
import SunsetClear from './type/SunsetClear';
import SunsetCloudy from './type/SunsetCloudy';
import SunsetOvercast from './type/SunsetOvercast';
import NightMoonClear from './type/NightMoonClear';
import NightMoonCloudy from './type/NightMoonCloudy';
import NightMoonOvercast from './type/NightMoonOvercast';

export default function SkyType({ code, sunPosition }) {
  switch(code) {
    case 'DAWN_MOON_CLEAR': return <DawnMoonClear sunPosition={sunPosition} />;
    case 'DAWN_MOON_CLOUDY': return <DawnMoonCloudy sunPosition={sunPosition} />;
    case 'DAWN_MOON_OVERCAST': return <DawnMoonOvercast sunPosition={sunPosition} />;

    case 'SUNRISE_PROGRESS_CLEAR': return <SunriseProgressClear sunPosition={sunPosition} />;
    case 'SUNRISE_PROGRESS_CLOUDY': return <SunriseProgressCloudy sunPosition={sunPosition} />;
    case 'SUNRISE_PROGRESS_OVERCAST': return <SunriseProgressOvercast sunPosition={sunPosition} />;

    case 'DAY_CLEAR': return <DayClear sunPosition={sunPosition} />;
    case 'DAY_CLOUDY': return <DayCloudy sunPosition={sunPosition} />;
    case 'DAY_OVERCAST': return <DayOvercast sunPosition={sunPosition} />;

    case 'SUNSET_CLEAR': return <SunsetClear sunPosition={sunPosition} />;
    case 'SUNSET_CLOUDY': return <SunsetCloudy sunPosition={sunPosition} />;
    case 'SUNSET_OVERCAST': return <SunsetOvercast sunPosition={sunPosition} />;

    case 'NIGHT_MOON_CLEAR': return <NightMoonClear sunPosition={sunPosition} />;
    case 'NIGHT_MOON_CLOUDY': return <NightMoonCloudy sunPosition={sunPosition} />;
    case 'NIGHT_MOON_OVERCAST': return <NightMoonOvercast sunPosition={sunPosition} />;

    default: return <DayClear sunPosition={sunPosition} />;
  }
}