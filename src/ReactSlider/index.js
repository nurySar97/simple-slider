import "./styles.scss";
import React, { Children, useCallback, useEffect, useRef, useState } from 'react';
import { multiplyArray, transition, translateX } from "./utils";
import nextId from "react-id-generator";


const SimpleSlider = ({ children, showItemsCount }) => {
    const COUNT_OF_CHILDS = children?.length;
    // VARIABLES HELPERS
    const counter = useRef(0);
    const isBlocked = useRef(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const sliderCards = useRef(null);
    const [sliderCardsWidth, setSliderCardsWidth] = useState(0);
    const [sliderTrackStyles, setSliderTrackStyles] = useState({});


    const setHandleAutoControl = useCallback(() => {
        let _SLIDER_CARDS_WIDTH = sliderCards.current.clientWidth;
        let _TRANSFORM = _SLIDER_CARDS_WIDTH/2 * (-COUNT_OF_CHILDS + counter.current + 1/2);
        let _REMAINDER = _SLIDER_CARDS_WIDTH % 2;

        if (_REMAINDER === 0) {
            setSliderCardsWidth(_SLIDER_CARDS_WIDTH);
            setSliderTrackStyles(prev => ({
                ...prev,
                width: (_SLIDER_CARDS_WIDTH / 2) * COUNT_OF_CHILDS * 3,
                transform: translateX(_TRANSFORM),
                count: _TRANSFORM,
                transition: transition()
            }))
            return
        }

        let _SLIDER_CARDS_ROUNDED_WIDTH = (_SLIDER_CARDS_WIDTH - _REMAINDER) / 2;
        _TRANSFORM = _SLIDER_CARDS_ROUNDED_WIDTH * (-COUNT_OF_CHILDS + counter.current + 1 / 2);

        setSliderCardsWidth(_SLIDER_CARDS_ROUNDED_WIDTH * 2);
        setSliderTrackStyles(prev => ({
            ...prev,
            width: _SLIDER_CARDS_ROUNDED_WIDTH * COUNT_OF_CHILDS * 3,
            transform: translateX(_TRANSFORM),
            count: _TRANSFORM,
            transition: transition()
        }))
    }, [COUNT_OF_CHILDS]);

    const slideEventHandler = ({ type, coefficient }) => {

        if (isBlocked.current) return;
        isBlocked.current = true;

        setTimeout(() => {
            isBlocked.current = false;
        }, 330)

        if (type === "next") {
            if (counter.current === coefficient * (COUNT_OF_CHILDS - 1)) {
                counter.current = -1;
                setHandleAutoControl();
            }
        } else {
            if (counter.current === coefficient * COUNT_OF_CHILDS) {
                counter.current = 0;
                setHandleAutoControl();
            }
        }

        setTimeout(() => {
            setSliderTrackStyles(prev => ({
                ...prev,
                transform: translateX(prev.count + coefficient * (sliderCardsWidth / 2)),
                count: prev.count + coefficient * (sliderCardsWidth / 2),
                transition: transition(250)
            }))
            counter.current = counter.current + coefficient
        }, 30)
    }

    useEffect(() => {
        if (children) {
            setIsLoaded(() => true);
            setHandleAutoControl();
            window.addEventListener("resize", setHandleAutoControl);
            return () => {
                window.removeEventListener('resize', setHandleAutoControl);
            }
        }
    }, [setHandleAutoControl, children]);

    return (
        <div className='container'>
            {
                children
                &&
                <section className="simple-slider">
                    <div className="simple-slider__inner">

                        <button
                            className='simple-slider__btn simple-slider__bnt--next'
                            onClick={() => slideEventHandler({ type: "next", coefficient: 1 })}
                        >
                            Next
                        </button>

                        <div
                            className="simple-slider__cards"
                            ref={sliderCards}
                        >
                            <div
                                style={sliderTrackStyles}
                                className="simple-slider__track"
                            >
                                {
                                    isLoaded
                                    &&
                                    Children.map(multiplyArray(children), Item => {
                                        return <div
                                            className='simple-slider__item'
                                            key={nextId()}
                                            style={{
                                                width: (sliderCardsWidth / 2)
                                            }}
                                        >
                                            {Item}
                                        </div>
                                    })
                                }
                            </div>
                        </div>

                        <button
                            className='simple-slider__bnt simple-slider__bnt--prev'
                            onClick={() => slideEventHandler({ type: "prev", coefficient: -1 })}
                        >
                            Previous
                        </button>

                    </div>
                </section>
            }
        </div>
    )
}

export default SimpleSlider;