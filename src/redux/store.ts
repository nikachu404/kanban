import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { columnsReducer } from './slices/columnsSlice';
import { repoUrlSliceReducer } from './slices/repoUrlSlice';
import { isBreadcrumbsVisibleReducer } from './slices/isBreadcrumbsVisibleSlice';
import { breadcrumbsInfoReducer } from './slices/breadcrumbsInfoSlice';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['columns', 'repoUrl', 'isBreadcrumbsVisible', 'breadcrumbsInfo'],
};

const rootReducer = combineReducers({
  columns: columnsReducer,
  repoUrl: repoUrlSliceReducer,
  isBreadcrumbsVisible: isBreadcrumbsVisibleReducer,
  breadcrumbsInfo: breadcrumbsInfoReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch