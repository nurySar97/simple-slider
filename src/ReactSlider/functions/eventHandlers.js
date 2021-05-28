import { transition, translateX } from "../utils";


export const _onHandleMouseDown = (
    clientX,
    prevSliderTrackStyles,
    sliderTrackStyles,
    sliderTrack,
    onHandleMouseMove,
    memory
) => {
    prevSliderTrackStyles.current = sliderTrackStyles;
    memory.current['MOUSE_DOWN_X'] = clientX - sliderTrackStyles.transformValue;
    memory.current['MOUSE_DOWN_CLIENT_X'] = clientX;
    sliderTrack.current.onmousemove = e => onHandleMouseMove(e);
}


export const _onHandleMouseMove = (
    clientX,
    setSliderTrackStyles,
    memory
) => {
    setSliderTrackStyles(prev => {
        return {
            ...prev,
            transform: translateX(clientX - memory.current['MOUSE_DOWN_X']),
            transformValue: clientX - memory.current['MOUSE_DOWN_X'],
            transition: transition()
        }
    })

}


export const _onHandleMouseUp = (
    clientX,
    memory,
    sliderCardsWidth,
    slideEventHandler,
    setSliderTrackStyles,
    prevSliderTrackStyles,
    sliderTrack
) => {
    const _DIFERENCE = clientX - memory.current['MOUSE_DOWN_CLIENT_X'];

    if (_DIFERENCE > 0) {
        if (_DIFERENCE > sliderCardsWidth / 4) {
            slideEventHandler({ type: "next", coefficient: 1 }, prevSliderTrackStyles);
        } else {
            setSliderTrackStyles({ ...prevSliderTrackStyles.current, transition: transition(200) });
        }
    } else {
        if (_DIFERENCE < sliderCardsWidth / 4) {
            slideEventHandler({ type: "prev", coefficient: -1 }, prevSliderTrackStyles);
        } else {
            setSliderTrackStyles({ ...prevSliderTrackStyles.current, transition: transition(200) });
        }
    }
    sliderTrack.current.onmousemove = () => null;
}


export const _onHandleTouchStart = (
    e,
    sliderTrack,
    onHandleTouchMove,
    memory,
    sliderTrackStyles
) => {
    const clientX = (e.changedTouches[0].clientX);
    sliderTrack.current.ontouchmove = e => onHandleTouchMove(e);
    memory.current['MOUSE_DOWN_X'] = clientX - sliderTrackStyles.transformValue;
}


export const _onHandleTouchMove = (
    e,
    setSliderTrackStyles,
    memory
) => {
    const clientX = (e.changedTouches[0].clientX);

    setSliderTrackStyles(prev => {
        return {
            ...prev,
            transform: translateX(Math.round(clientX) - memory.current['MOUSE_DOWN_X']),
            transformValue: Math.round(clientX) - memory.current['MOUSE_DOWN_X'],
            transition: transition()
        }
    })
}