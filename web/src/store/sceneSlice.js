import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  oceanCode: 'DAWN_OCEAN',
  particleCode: 'PARTICLE',
  skyCode: 'DAWN_MOON_CLEAR',
  userCount: 121
};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    setOceanCode: (state, action) => { state.oceanCode = action.payload; },
    setParticleCode: (state, action) => { state.particleCode = action.payload; },
    setSkyCode: (state, action) => { state.skyCode = action.payload; },
    setUserCount: (state, action) => { state.userCount = action.payload; },
    setNewBottleList: (state, action) => { state.newBottleList = action.payload; },
    setUserLat: (state, action) => { state.userLat = action.payload; },
    setUserLot: (state, action) => { state.userLot = action.payload; }
  }
});

export const { setOceanCode, setParticleCode, setSkyCode, setUserCount , setNewBottleList,setUserLat,setUserLot} = sceneSlice.actions;
export default sceneSlice.reducer;
