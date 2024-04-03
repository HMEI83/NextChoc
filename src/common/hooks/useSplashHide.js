import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

/**
 * @description Splash预处理
 */
export default function useSplashHide() {
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    useEffect(() => {

        SplashScreen.preventAutoHideAsync().catch();
        setTimeout(()=>{
            SplashScreen.hideAsync().catch();
        },500)
        setLoadingComplete(true);

    }, []);

    return isLoadingComplete;
}
