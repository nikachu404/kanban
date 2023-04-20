import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import issuesReducer from './slices/Issues';
import storage from 'redux-persist/lib/storage';
import { columnsReducer } from './slices/Columns';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['issues'], // імена збережуваних reducers
};

const rootReducer = combineReducers({
  issues: issuesReducer,
  columns: columnsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch