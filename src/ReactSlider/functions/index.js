import { transition, translateX } from "../utils";

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
    slidesToShow
) => {

    if (isBlocked.current) return;
    isBlocked.current = true;
    setTimeout(() => { isBlocked.current = false; }, speed * 1.1)

    counter.current = counter.current + coefficient;

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

    setTimeout(() => {
        if (counter.current === coefficient * COUNT_OF_CHILDS) {
            counter.current = 0;
            setHandleAutoControl();
        }
    }, speed * 1.05)

}


export const _setHandleAutoControl = (
    counter,
    sliderCards,
    COUNT_OF_CHILDS,
    setSliderCardsWidth,
    setSliderTrackStyles,
    prevSliderTrackStyles,
    slidesToShow,
    isSmall
) => {
    let { current: {
        clientWidth: _SLIDER_CARDS_WIDTH
    } } = sliderCards;
    let MOVE_LEFT = isSmall ? 0 : 1/2
    let _TRANSFORM = _SLIDER_CARDS_WIDTH / slidesToShow * (counter.current - COUNT_OF_CHILDS * 2 + MOVE_LEFT);
    let _REMAINDER = _SLIDER_CARDS_WIDTH % slidesToShow;

    if (_REMAINDER === 0) {
        setSliderCardsWidth(_SLIDER_CARDS_WIDTH);

        prevSliderTrackStyles.current = {
            width: (_SLIDER_CARDS_WIDTH / slidesToShow) * COUNT_OF_CHILDS * 5,
            transform: translateX(_TRANSFORM),
            transformValue: _TRANSFORM,
            transition: transition()
        };

        setSliderTrackStyles(() => prevSliderTrackStyles.current);
        return
    }

    let _SLIDER_CARDS_ROUNDED_WIDTH = (_SLIDER_CARDS_WIDTH - _REMAINDER) / slidesToShow;
    _TRANSFORM = _SLIDER_CARDS_ROUNDED_WIDTH * (-COUNT_OF_CHILDS * 2 + counter.current + MOVE_LEFT);

    prevSliderTrackStyles.current = {
        width: _SLIDER_CARDS_ROUNDED_WIDTH * COUNT_OF_CHILDS * 5,
        transform: translateX(_TRANSFORM),
        transformValue: _TRANSFORM,
        transition: transition()
    }

    setSliderCardsWidth(_SLIDER_CARDS_ROUNDED_WIDTH * 2);
    setSliderTrackStyles(() => prevSliderTrackStyles.current);
}