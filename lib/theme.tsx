
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type ThemePrefs = {
  accent: string;
  bubbleRadius: number;
  fontScale: number; // 0.85..1.15
  wallpaper: 'none'|'graphite'|'dots'|'gradient';
  density: 'comfortable'|'compact';
  lockEnabled: boolean;
};

const defaults: ThemePrefs = {
  accent: '#00A884',
  bubbleRadius: 16,
  fontScale: 1,
  wallpaper: 'graphite',
  density: 'comfortable',
  lockEnabled: false,
};

const KEY='vault_theme_prefs_v2';
const ThemeCtx = createContext<{prefs:ThemePrefs; setPrefs:(p:Partial<ThemePrefs>)=>void; colors:any}>(null as any);

export const palette = {
  bg: '#0B141A',
  surface: '#111B21',
  surfaceAlt: '#202C33',
  border: '#2A3942',
  text: '#E9EDEF',
  muted: '#AEBAC1',
  faint: '#667781',
  accent: '#00A884',
  accentDim: '#008069',
  danger: '#F15C6D',
  blue: '#53BDEB',
};

export function ThemeProvider({children}:{children:React.ReactNode}){
  const [prefs,setPrefsState]=useState<ThemePrefs>(defaults);
  useEffect(()=>{ (async()=>{
    const s=await SecureStore.getItemAsync(KEY);
    if(s) try{ setPrefsState({...defaults, ...JSON.parse(s)});}catch{}
  })(); },[]);
  const setPrefs = async (patch:Partial<ThemePrefs>)=>{
    const next={...prefs, ...patch};
    setPrefsState(next);
    await SecureStore.setItemAsync(KEY, JSON.stringify(next));
  };
  const colors = { ...palette, accent: prefs.accent };
  return <ThemeCtx.Provider value={{prefs,setPrefs,colors}}>{children}</ThemeCtx.Provider>
}
export const useTheme=()=>useContext(ThemeCtx);
