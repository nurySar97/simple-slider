import { transition, translateX } from "../utils";

export const _slideEventHandler = (
    type,
    coef,
    isBlocked,
    counter,
    setHandleAutoControl,
    setSliderTrackStyles,
    sliderCardsWidth,
    COUNT_OF_CHILDS,
    prevSliderTrackStyles) => {

    if (isBlocked.current) return;
    isBlocked.current = true;
    setTimeout(() => { isBlocked.current = false; }, 220)

    counter.current = counter.current + coef;

    setSliderTrackStyles(prev => {
        let _TRANSFORM = prevSliderTrackStyles
            ? prevSliderTrackStyles.current.transformValue + coef * (sliderCardsWidth / 2)
            : prev.transformValue + coef * (sliderCardsWidth / 2)

        return {
            ...prev,
            transform: translateX(_TRANSFORM),
            transformValue: _TRANSFORM,
            transition: transition(200)
        }
    });

    setTimeout(() => {
        if (type === "next") {
            if (counter.current === coef * (COUNT_OF_CHILDS)) {
                counter.current = 0;
                setHandleAutoControl();
            }
        } else {
            if (counter.current === coef * COUNT_OF_CHILDS) {
                counter.current = 0;
                setHandleAutoControl();
            }
        }
    }, 210)

}


export const _setHandleAutoControl = (
    counter,
    sliderCards,
    COUNT_OF_CHILDS,
    setSliderCardsWidth,
    setSliderTrackStyles,
    prevSliderTrackStyles
) => {
    let { current: {
        clientWidth: _SLIDER_CARDS_WIDTH
    } } = sliderCards;
    let _TRANSFORM = _SLIDER_CARDS_WIDTH / 2 * (counter.current + 1 / 2 - COUNT_OF_CHILDS * 2);
    let _REMAINDER = _SLIDER_CARDS_WIDTH % 2;

    if (_REMAINDER === 0) {
        setSliderCardsWidth(_SLIDER_CARDS_WIDTH);

        prevSliderTrackStyles.current = {
            width: (_SLIDER_CARDS_WIDTH / 2) * COUNT_OF_CHILDS * 5,
            transform: translateX(_TRANSFORM),
            transformValue: _TRANSFORM,
            transition: transition()
        };

        setSliderTrackStyles(() => prevSliderTrackStyles.current);
        return
    }

    let _SLIDER_CARDS_ROUNDED_WIDTH = (_SLIDER_CARDS_WIDTH - _REMAINDER) / 2;
    _TRANSFORM = _SLIDER_CARDS_ROUNDED_WIDTH * (-COUNT_OF_CHILDS * 2 + counter.current + 1 / 2);

    prevSliderTrackStyles.current = {
        width: _SLIDER_CARDS_ROUNDED_WIDTH * COUNT_OF_CHILDS * 5,
        transform: translateX(_TRANSFORM),
        transformValue: _TRANSFORM,
        transition: transition()
    }

    setSliderCardsWidth(_SLIDER_CARDS_ROUNDED_WIDTH * 2);
    setSliderTrackStyles(() => prevSliderTrackStyles.current);
}