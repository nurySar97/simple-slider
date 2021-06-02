import nextId from "react-id-generator";

export function keyGenerator(COUNT_OF_CHILDS) {
    let _keys = [];
    for (let i = 0; i < COUNT_OF_CHILDS * 5; i++) {
        _keys.push(nextId())
    }
    return _keys
}

export let multiplyArray = array => [...array, ...array, ...array, ...array, ...array];
export let transition = (s = 0) => `opacity ${s}ms ease-out, transform ${s}ms ease-out`;
export let translateX = (value = 0) => `translateX(${value}px)`;