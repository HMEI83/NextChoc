function throttle(fn,ms){
    let timer=null;
    return function(...arg){
        if(timer) return;
        timer=setTimeout(()=>{
           fn(...arg);
           timer=null;
        },ms)
    }
}

const useThrottle=(fn,ms)=>{
    return throttle(fn,ms);
}

export default useThrottle;