import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Fix: Use default import
import authReducer from './authSlice';

const persistConfig = { key: 'root', storage, whitelist: ['auth'] };
const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: { auth: persistedReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'] },
    }),
});

export const persistor = persistStore(store);