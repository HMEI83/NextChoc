// import create from "zustand";
import { create } from 'zustand';
// import { persist } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCommonStore = create(
    persist(
        (set, get) => ({
            token: "",
            isIntro: "open",
            user: {

            },
            wallets: [],
            loginMethod: "",
            devToken: "",
            local: {

            },
            isUpdate: "0",
            flag: '0',
            actions: {
                setWallets: (cardInfo) => { set((state) => ({ ...state, wallets: [...state.wallets, cardInfo] })) },
                setToken: (token) => {
                    set((state) => ({ ...state, token: token }));
                },
                setUser: (user) => {
                    set((state) => ({ ...state, user: user }));
                },
                setLoginMethod: (data) => {
                    set((state) => ({ ...state, loginMethod: data }))
                },
                setFlag: (status) => {
                    set((state) => ({ ...state, flag: status }))
                },
                setIsIntro: (status) => set((state) => ({ ...state, isIntro: status })),
                setDevToken: (status) => set((state) => ({ ...state, devToken: status })),
                setLocal: (status) => {
                    set((state) => ({ ...state, local: status }));
                },
                setIsUpdate: (status) => set((state) => ({ ...state, isUpdate: status })),
                logout: () => {
                    console.log("tuichu")
                    set((state) => ({
                        ...state,
                        token: "",
                        user: {},
                    }));
                    // ST_Token.token = null;
                },
            },
        }),
        {

            name: "NextChoc",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => {
                return {
                    wallets: state.wallets,
                    isIntro: state.isIntro,
                    token: state.token,
                    user: state.user,
                    LoginMethod: state.loginMethod,
                };
            },
        }
    )
);


export const useToken = () => useCommonStore((state) => state.token);
export const useIsIntro = () => useCommonStore((state) => state.isIntro);
export const useFlag = () => useCommonStore((state) => state.flag);
export const useDevToken = () => useCommonStore((state) => state.devToken);
export const useIsUpdate = () => useCommonStore((state) => state.isUpdate);
export const useUser = () => useCommonStore((state) => state.user);
export const useLoginMethod = () => useCommonStore((state) => state.loginMethod);
export const useLocal = () => useCommonStore((state) => state.local);
export const useWallets = () => useCommonActions((state) => state.wallets);
// export const setWallets = ()=>useCommonActions((state)=>state.setWallets)
//actions
export const useCommonActions = () => useCommonStore((state) => state.actions);