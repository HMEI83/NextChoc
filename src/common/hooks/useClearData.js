import React, {useEffect} from 'react'

export function useClearData(clearFc) {

    useEffect(()=>{
        return ()=>clearFc()
    },[])
}