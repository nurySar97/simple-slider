export let multiplyArray = array => [...array, ...array, ...array, ...array, ...array];
export let transition = (s = 0) => `opacity ${s}ms linear, transform ${s}ms linear`;
export let translateX = (value = 0) => `translateX(${value}px)`;