import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import actionLogReducer from './slices/actionLogSlice';
import inventoryReducer from './slices/inventorySlice';
import statsReducer from './slices/statsSlice';

export const createAppStore = () => configureStore({
  reducer: {
    stats: statsReducer,
    inventory: inventoryReducer,
    actionLog: actionLogReducer,
  },
});

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
