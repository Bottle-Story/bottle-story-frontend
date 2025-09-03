import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  oceanCode: 'DAWN_OCEAN',
  particleCode: 'PARTICLE',
  skyCode: 'DAWN_MOON_CLEAR',
  sunSetTime: '18:45',   // 기본 석양 시간
  sunRiseTime: '06:12',  // 기본 일출 시간
  t1h:'20',
  userCount: 0,
  websocketConnected: false ,// ← 웹소켓 연결 상태 추가,
  newBottleList: [],
  textArray:[],


};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    setOceanCode: (state, action) => { state.oceanCode = action.payload; },
    setParticleCode: (state, action) => { state.particleCode = action.payload; },
    setSkyCode: (state, action) => { state.skyCode = action.payload; },
    setSunsetTime:(state, action) => { state.sunSetTime = action.payload; },
    setSunRiseTime:(state, action) => { state.sunRiseTime = action.payload; },
    setT1h:(state, action) => { state.t1h = action.payload; },
    setUserCount: (state, action) => { state.userCount = action.payload; },
    setNewBottleList: (state, action) => { state.newBottleList = action.payload; },
    setUserLat: (state, action) => { state.userLat = action.payload; },
    setUserLot: (state, action) => { state.userLot = action.payload; },
    setTextArray: (state, action) => { state.textArray = action.payload; },
    setWebsocketConnected: (state, action) => { state.websocketConnected = action.payload; } 

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
  setWebsocketConnected,
  setSunsetTime,
  setSunRiseTime,
  setT1h,
  setTextArray
} = sceneSlice.actions;
export default sceneSlice.reducer;
