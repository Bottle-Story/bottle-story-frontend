import { configureStore } from '@reduxjs/toolkit';
import sceneReducer from './sceneSlice';

export const store = configureStore({
  reducer: {
    scene: sceneReducer,
  },
});