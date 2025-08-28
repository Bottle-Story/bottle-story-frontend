import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  oceanCode: 'DAWN_OCEAN',
  particleCode: 'PARTICLE',
  skyCode: 'DAWN_MOON_CLEAR',
  userCount: 121,
  websocketConnected: false // ← 웹소켓 연결 상태 추가

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
    setUserLot: (state, action) => { state.userLot = action.payload; },
    setWebsocketConnected: (state, action) => { state.websocketConnected = action.payload; } // ← 액션 추가

  }
});

export const { 
  setOceanCode, 
  setParticleCode, 
  setSkyCode, 
  setUserCount, 
  setNewBottleList, 
  setUserLat, 
  setUserLot, 
  setWebsocketConnected // ← export
} = sceneSlice.actions;
export default sceneSlice.reducer;
