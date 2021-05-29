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
        let _TRANSFORM = clientX - memory.current['MOUSE_DOWN_X'];
        return {
            ...prev,
            transform: translateX(_TRANSFORM),
            transformValue: _TRANSFORM,
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
    sliderTrack,
    speed
) => {
    const _DIFERENCE = clientX - memory.current['MOUSE_DOWN_CLIENT_X'];

    _autoTouchAndMoveController(
        _DIFERENCE,
        sliderCardsWidth,
        slideEventHandler,
        () => _setTransition(setSliderTrackStyles, prevSliderTrackStyles, speed),
        prevSliderTrackStyles,
        speed
    )
    sliderTrack.current.onmousemove = () => null;
}


export const _onHandleTouchStart = (
    e,
    sliderTrack,
    onHandleTouchMove,
    memory,
    sliderTrackStyles,
    prevSliderTrackStyles
) => {
    prevSliderTrackStyles.current = sliderTrackStyles;
    const clientX = (e.changedTouches[0].clientX);
    memory.current['MOUSE_DOWN_X'] = clientX - sliderTrackStyles.transformValue;
    memory.current['MOUSE_DOWN_CLIENT_X'] = clientX;
    sliderTrack.current.ontouchmove = e => onHandleTouchMove(e);
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


export const _onHandleTouchEnd = (
    e,
    sliderTrack,
    memory,
    sliderCardsWidth,
    slideEventHandler,
    setSliderTrackStyles,
    prevSliderTrackStyles,
    speed
) => {
    const clientX = (e.changedTouches[0].clientX);
    const _DIFERENCE = clientX - memory.current['MOUSE_DOWN_CLIENT_X'];

    _autoTouchAndMoveController(
        _DIFERENCE,
        sliderCardsWidth,
        slideEventHandler,
        () => _setTransition(setSliderTrackStyles, prevSliderTrackStyles, speed),
        prevSliderTrackStyles,
        speed
    )

    sliderTrack.current.ontouchmove = () => null;
}


function _autoTouchAndMoveController(
    _DIFERENCE,
    sliderCardsWidth,
    slideEventHandler,
    setTransition,
    prevSliderTrackStyles,
    speed
) {
    (_DIFERENCE > 0
        ?
        _DIFERENCE > sliderCardsWidth / 4
            ? slideEventHandler(1, prevSliderTrackStyles, speed)
            : setTransition()

        :
        _DIFERENCE < -sliderCardsWidth / 4
            ? slideEventHandler(-1, prevSliderTrackStyles, speed)
            : setTransition()
    );
}


function _setTransition(
    setSliderTrackStyles,
    prevSliderTrackStyles,
    speed
) {
    setSliderTrackStyles({
        ...prevSliderTrackStyles.current,
        transition: transition(speed)
    })
}