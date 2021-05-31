import { transition, translateX } from "../utils";

export const _setHandleAutoControl = (
    counter,
    sliderCards,
    COUNT_OF_CHILDS,
    prevSliderTrackStyles,
    setSliderCardsWidth,
    setSliderTrackStyles,
    slidesToShow,
    moveLeft
) => {
    let { current: {
        clientWidth: _SLIDER_CARDS_WIDTH
    } } = sliderCards;

    let _TRANS_COEF = counter.current - COUNT_OF_CHILDS * 2 + moveLeft
    let _TRANSFORM = (_SLIDER_CARDS_WIDTH) / slidesToShow * _TRANS_COEF;
    let _REMAINDER = _SLIDER_CARDS_WIDTH % slidesToShow;

    if (_REMAINDER === 0) {
        setSliderCardsWidth(_SLIDER_CARDS_WIDTH);

        prevSliderTrackStyles.current = {
            width: (_SLIDER_CARDS_WIDTH / slidesToShow) * COUNT_OF_CHILDS * 5,
            transform: translateX(_TRANSFORM),
            transformValue: _TRANSFORM,
            transition: transition()
        };

        setSliderTrackStyles(prevSliderTrackStyles.current);
        return
    }

    let _SLIDER_CARDS_ROUNDED_WIDTH = (_SLIDER_CARDS_WIDTH - _REMAINDER) / slidesToShow;
    _TRANSFORM = _SLIDER_CARDS_ROUNDED_WIDTH * _TRANS_COEF;

    prevSliderTrackStyles.current = {
        width: _SLIDER_CARDS_ROUNDED_WIDTH * COUNT_OF_CHILDS * 5,
        transform: translateX(_TRANSFORM),
        transformValue: _TRANSFORM,
        transition: transition()
    }

    setSliderCardsWidth(_SLIDER_CARDS_ROUNDED_WIDTH * 2);
    setSliderTrackStyles(prevSliderTrackStyles.current);
}


export const _slideEventHandler = (
    coefficient,
    isBlocked,
    counter,
    setHandleAutoControl,
    setSliderTrackStyles,
    sliderCardsWidth,
    COUNT_OF_CHILDS,
    prevSliderTrackStyles,
    speed,
    slidesToShow,
    beforeChange
) => {
    if (isBlocked.current) return;
    isBlocked.current = true;
    counter.current = counter.current + coefficient;

    new Promise(r => {
        let _arg = Math.abs(counter.current) === COUNT_OF_CHILDS ? 0 : (counter.current <= 0 ? Math.abs(counter.current) : COUNT_OF_CHILDS - counter.current);
        !!beforeChange && beforeChange(_arg);
        setTimeout(r, 0)
    }).then(() => {

        setSliderTrackStyles(prev => {
            let _TRANSFORM = prevSliderTrackStyles
                ? prevSliderTrackStyles.current.transformValue + coefficient * (sliderCardsWidth / slidesToShow)
                : prev.transformValue + coefficient * (sliderCardsWidth / slidesToShow)

            return {
                ...prev,
                transform: translateX(_TRANSFORM),
                transformValue: _TRANSFORM,
                transition: transition(speed)
            }
        });

        new Promise(resolve => {
            setTimeout(() => {
                if (counter.current === (coefficient > 0 ? 1 : -1) * COUNT_OF_CHILDS) {
                    counter.current = 0;
                    setHandleAutoControl();
                }
                resolve()
            }, speed * 1.1);
        }).then(() => {
            isBlocked.current = false
        })
    })

}


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
    sliderTrack.current.onmousemove = e => {
        e.preventDefault()
        onHandleMouseMove(e)
    };
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