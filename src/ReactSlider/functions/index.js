import { transition, translateX } from "../utils";

export const _slideEventHandler = (
    type,
    coef,
    isBlocked,
    counter,
    setHandleAutoControl,
    setSliderTrackStyles,
    sliderCardsWidth,
    COUNT_OF_CHILDS) => {

    if (isBlocked.current) return;
    isBlocked.current = true;
    setTimeout(() => { isBlocked.current = false; }, 330)

    if (type === "next") {
        if (counter.current === coef * (COUNT_OF_CHILDS - 1)) {
            counter.current = -1;
            setHandleAutoControl();
        }
    } else {
        if (counter.current === coef * COUNT_OF_CHILDS) {
            counter.current = 0;
            setHandleAutoControl();
        }
    }

    setTimeout(() => {
        setSliderTrackStyles(prev => ({
            ...prev,
            transform: translateX(prev.transformValue + coef * (sliderCardsWidth / 2)),
            transformValue: prev.transformValue + coef * (sliderCardsWidth / 2),
            transition: transition(250)
        }))
        counter.current = counter.current + coef
    }, 30)

}


export const _setHandleAutoControl = (
    counter,
    sliderCards,
    COUNT_OF_CHILDS,
    setSliderCardsWidth,
    setSliderTrackStyles
) => {
    let _SLIDER_CARDS_WIDTH = sliderCards.current.clientWidth;
    let _TRANSFORM = _SLIDER_CARDS_WIDTH / 2 * (-COUNT_OF_CHILDS * 2 + counter.current + 1 / 2);
    let _REMAINDER = _SLIDER_CARDS_WIDTH % 2;

    if (_REMAINDER === 0) {
        setSliderCardsWidth(_SLIDER_CARDS_WIDTH);
        setSliderTrackStyles(prev => ({
            ...prev,
            width: (_SLIDER_CARDS_WIDTH / 2) * COUNT_OF_CHILDS * 5,
            transform: translateX(_TRANSFORM),
            transformValue: _TRANSFORM,
            transition: transition()
        }))
        return
    }

    let _SLIDER_CARDS_ROUNDED_WIDTH = (_SLIDER_CARDS_WIDTH - _REMAINDER) / 2;
    _TRANSFORM = _SLIDER_CARDS_ROUNDED_WIDTH * (-COUNT_OF_CHILDS * 2 + counter.current + 1 / 2);

    setSliderCardsWidth(_SLIDER_CARDS_ROUNDED_WIDTH * 2);
    setSliderTrackStyles(prev => ({
        ...prev,
        width: _SLIDER_CARDS_ROUNDED_WIDTH * COUNT_OF_CHILDS * 5,
        transform: translateX(_TRANSFORM),
        transformValue: _TRANSFORM,
        transition: transition()
    }))
}