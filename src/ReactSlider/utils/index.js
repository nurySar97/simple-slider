export let multiplyArray = array => [...array, ...array, ...array];
export let transition = (s = 0) => `all ${s}ms linear`;
export let translateX = (value = 0) => `translateX(${value}px)`;