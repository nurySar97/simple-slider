export function Divider(count, divider) {
    let _newArray = [], counter = 1;
    [...new Array(count)].forEach(_ => {
        if (counter <= divider) {
            _newArray.push(counter++)
            return
        }
        counter = 1
        _newArray.push(counter++)
    })
    return _newArray
}
