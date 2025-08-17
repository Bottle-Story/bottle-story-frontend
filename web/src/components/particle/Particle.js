import React from 'react';
import NoneParticles from './type/NoneParticles';
import RainParticles from './type/RainParticles';
import SnowParticles from './type/SnowParticles';
import RainSnowParticles from './type/RainSnowParticles';
import RainDropParticles from './type/RainDropParticles';
import RainDropSnowStormParticles from './type/RainDropSnowStormParticles';
import SnowStormParticles from './type/SnowStormParticles';

export default function Particle({ code }) {
  switch(code) {
    case 'PARTICLE_NONE': return <NoneParticles />;
    case 'PARTICLE_RAINY': return <RainParticles />;
    case 'PARTICLE_SNOW': return <SnowParticles />;
    case 'PARTICLE_RAINY_SNOW': return <RainSnowParticles />;
    case 'PARTICLE_RAIN_DROP': return <RainDropParticles />;
    case 'PARTICLE_RAIN_DROP_SNOW_STORM': return <RainDropSnowStormParticles />;
    case 'PARTICLE_SNOW_STORM': return <SnowStormParticles />;
    default: return <NoneParticles />;
  }
}