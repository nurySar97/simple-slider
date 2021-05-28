import nextId from "react-id-generator";

export function keyGenerator(COUNT_OF_CHILDS) {
    let _keys = [];
    for (let i = 0; i < COUNT_OF_CHILDS * 5; i++) {
        _keys.push(nextId())
    }
    return _keys
}