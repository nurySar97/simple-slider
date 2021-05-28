import "./styles.scss";
import { multiplyArray } from "./utils";
import { keyGenerator } from "./utils/keyGenerator";
import { _setHandleAutoControl, _slideEventHandler } from "./functions";
import React, { Children, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    _onHandleMouseDown,
    _onHandleMouseMove,
    _onHandleMouseUp,
    _onHandleTouchEnd,
    _onHandleTouchMove,
    _onHandleTouchStart
} from "./functions/eventHandlers";

const SimpleSlider = ({
    children,
    direction = "left",
    frequency = 0
}) => {
    let freq = (frequency === 0) ? 0 : (frequency < 300) ? 300 : frequency;
    // Variables start
    const COUNT_OF_CHILDS = children?.length || 0;
    let memorizedChilds = useMemo(() => children && multiplyArray(children), [children]);
    let memorizedKeys = useMemo(() => keyGenerator(COUNT_OF_CHILDS), [COUNT_OF_CHILDS]);
    const memory = useRef({
        MOUSE_DOWN_X: 0,
        MOUSE_MOVE_X: 0,
        MOUSE_DOWN_CLIENT_X: 0
    });
    const counter = useRef(0);
    const isBlocked = useRef(false);
    const sliderCards = useRef(null);
    const sliderTrack = useRef(null);
    const prevSliderTrackStyles = useRef({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [sliderCardsWidth, setSliderCardsWidth] = useState(0);
    const [sliderTrackStyles, setSliderTrackStyles] = useState({});
    const interval = useRef(null);
    // Variables End

    // RETURN DEFAULT
    const setHandleAutoControl = useCallback(() => {
        _setHandleAutoControl(
            counter,
            sliderCards,
            COUNT_OF_CHILDS,
            setSliderCardsWidth,
            setSliderTrackStyles,
            prevSliderTrackStyles
        )
    }, [COUNT_OF_CHILDS]);

    // BUTTON HANDLER 
    const slideEventHandler = useCallback(({ type, coefficient: coef }, prevSliderTrackStyles) => {
        _slideEventHandler(
            type,
            coef,
            isBlocked,
            counter,
            setHandleAutoControl,
            setSliderTrackStyles,
            sliderCardsWidth,
            COUNT_OF_CHILDS,
            prevSliderTrackStyles
        )
    }, [COUNT_OF_CHILDS, sliderCardsWidth, setHandleAutoControl]);

    // MOUSE OUT
    const onHandleMouseOut = ({ clientX }) => {
        _onHandleMouseUp(
            clientX,
            memory,
            sliderCardsWidth,
            slideEventHandler,
            setSliderTrackStyles,
            prevSliderTrackStyles,
            sliderTrack
        )
        sliderTrack.current.onmousemove = () => null;
    }

    // MOUSE DOWN
    const onHandleMouseDown = ({ clientX }) => {
        sliderTrack.current.onmouseout = e => onHandleMouseOut(e);
        _onHandleMouseDown(
            clientX,
            prevSliderTrackStyles,
            sliderTrackStyles,
            sliderTrack,
            onHandleMouseMove,
            memory
        )
    }

    // MOUSE MOVE
    function onHandleMouseMove({ clientX }) {
        _onHandleMouseMove(clientX, setSliderTrackStyles, memory)
    }

    // MOUSE UP
    const onHandleMouseUp = useCallback(({ clientX }) => {
        sliderTrack.current.onmouseout = e => null;
        _onHandleMouseUp(
            clientX,
            memory,
            sliderCardsWidth,
            slideEventHandler,
            setSliderTrackStyles,
            prevSliderTrackStyles,
            sliderTrack
        )
    }, [slideEventHandler, sliderCardsWidth]);

    // TOUCH START
    const onHandleTouchStart = e => {
        _onHandleTouchStart(
            e,
            sliderTrack,
            onHandleTouchMove,
            memory,
            sliderTrackStyles,
            prevSliderTrackStyles
        )
    }

    // TOUCH MOVE
    function onHandleTouchMove(e) {
        _onHandleTouchMove(e, setSliderTrackStyles, memory)
    }

    // TOUCH END
    const onHandleTouchEnd = (e) => {
        _onHandleTouchEnd(
            e,
            sliderTrack,
            memory,
            sliderCardsWidth,
            slideEventHandler,
            setSliderTrackStyles,
            prevSliderTrackStyles
        )
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

    useEffect(() => {
        interval.current = setInterval(() => {
            if (freq !== 0) {
                slideEventHandler(
                    direction === "left"
                        ? ({ type: "prev", coefficient: -1 })
                        : ({ type: "next", coefficient: 1 })
                )
            }
        }, freq)

        return () => clearInterval(interval.current);
    }, [slideEventHandler, freq, direction]);

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
                                ref={sliderTrack}
                                onMouseDown={onHandleMouseDown}
                                onMouseUp={onHandleMouseUp}
                                onTouchStart={onHandleTouchStart}
                                onTouchEnd={onHandleTouchEnd}

                            >
                                {
                                    isLoaded
                                    &&
                                    Children.map(memorizedChilds, (Item, index) => {
                                        return <div
                                            className='simple-slider__card'
                                            key={memorizedKeys[index]}
                                            style={{ width: (sliderCardsWidth / 2) }}
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