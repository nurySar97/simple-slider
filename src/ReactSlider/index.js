import "./styles.scss";
import { multiplyArray } from "./utils";
import { keyGenerator } from "./utils/keyGenerator";
import React, { Children, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    _setHandleAutoControl,
    _slideEventHandler,
    _onHandleMouseDown,
    _onHandleMouseMove,
    _onHandleMouseUp,
    _onHandleTouchEnd,
    _onHandleTouchMove,
    _onHandleTouchStart
} from "./handlers/eventHandlers";

const SimpleSlider = memo(({
    children,
    direction = "left",
    frequency = 0,
    speed = 200,
    slidesToShow = 1,
    moveLeft = 0,
    isSmall = false
}) => {
    // Variables start
    const COUNT_OF_CHILDS = children?.length || 0;
    let FREQUENCY = frequency === 0 ? 0 : (frequency < 300) ? 300 : frequency;
    let memorizedChilds = useMemo(() => children && multiplyArray(children), [children]);
    let memorizedKeys = useMemo(() => keyGenerator(COUNT_OF_CHILDS), [COUNT_OF_CHILDS]);
    const memory = useRef({
        MOUSE_DOWN_X: 0,
        MOUSE_MOVE_X: 0,
        MOUSE_DOWN_CLIENT_X: 0
    });
    const counter = useRef(0);
    const interval = useRef(null);
    const isBlocked = useRef(false);
    const sliderCards = useRef(null);
    const sliderTrack = useRef(null);
    const prevSliderTrackStyles = useRef({});
    const [sliderCardsWidth, setSliderCardsWidth] = useState(0);
    const [sliderTrackStyles, setSliderTrackStyles] = useState({});
    const [isIntervalBlocked, setIsIntervalBlocked] = useState(false);
    // Variables End

    // RETURN DEFAULT
    const setHandleAutoControl = useCallback(() => {
        _setHandleAutoControl(
            counter,
            sliderCards,
            COUNT_OF_CHILDS,
            prevSliderTrackStyles,
            setSliderCardsWidth,
            setSliderTrackStyles,
            slidesToShow,
            moveLeft
        )
    }, [COUNT_OF_CHILDS, slidesToShow, moveLeft]);

    // BUTTON HANDLER 
    const slideEventHandler = useCallback((coefficient, prevSliderTrackStyles, speed) => {
        if (isBlocked.current) return;
        _slideEventHandler(
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
        )
    }, [COUNT_OF_CHILDS, sliderCardsWidth, setHandleAutoControl, slidesToShow]);

    // MOUSE OUT
    const onHandleMouseOut = ({ clientX }) => {
        if (isBlocked.current) return;
        onHandleMouseUp({ clientX: clientX });
        sliderTrack.current.onmousemove = () => null;
    }

    // MOUSE DOWN
    const onHandleMouseDown = ({ clientX }) => {
        if (isBlocked.current) return;
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
        if (isBlocked.current) return;
        _onHandleMouseMove(clientX, setSliderTrackStyles, memory)
    }

    // MOUSE UP
    const onHandleMouseUp = useCallback(({ clientX }) => {
        if (isBlocked.current) return;
        sliderTrack.current.onmouseout = () => null;
        _onHandleMouseUp(
            clientX,
            memory,
            sliderCardsWidth,
            slideEventHandler,
            setSliderTrackStyles,
            prevSliderTrackStyles,
            sliderTrack,
            200
        );
    }, [slideEventHandler, sliderCardsWidth]);

    // TOUCH START
    const onHandleTouchStart = e => {
        if (isBlocked.current) return;
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
        if (isBlocked.current) return;
        _onHandleTouchMove(e, setSliderTrackStyles, memory)
    }

    // TOUCH END
    const onHandleTouchEnd = (e) => {
        if (isBlocked.current) return;
        _onHandleTouchEnd(
            e,
            sliderTrack,
            memory,
            sliderCardsWidth,
            slideEventHandler,
            setSliderTrackStyles,
            prevSliderTrackStyles,
            200
        )
    }

    const onHandleDotClick = (index) => {
        let _active_key = (counter.current <= 0 ? Math.abs(counter.current) : COUNT_OF_CHILDS - counter.current);
        slideEventHandler(_active_key - index, null, speed);
    }

    useEffect(() => {
        if (children) {
            setHandleAutoControl();
            window.addEventListener("resize", setHandleAutoControl);

            return () => {
                window.removeEventListener('resize', setHandleAutoControl);
            }
        }
    }, [setHandleAutoControl, children]);

    useEffect(() => {
        interval.current = setInterval(() => {
            if (isIntervalBlocked) return;
            FREQUENCY !== 0 && slideEventHandler(direction === "left" ? -1 : 1, null, speed);
        }, FREQUENCY);

        return () => clearInterval(interval.current);
    }, [slideEventHandler, FREQUENCY, direction, speed, isIntervalBlocked]);

    return (
        <div className='container'>
            {
                children
                &&
                <section className="simple-slider">
                    <div className="simple-slider__inner">
                        <div
                            className="simple-slider__cards"
                            ref={sliderCards}
                        >
                            <div
                                className="simple-slider__track"
                                style={sliderTrackStyles}
                                ref={sliderTrack}
                            >
                                {
                                    Children.map(memorizedChilds, (Item, index) => {
                                        return <div
                                            className='simple-slider__card'
                                            key={memorizedKeys[index]}
                                            style={{
                                                width: sliderCardsWidth / slidesToShow,
                                                height: sliderCardsWidth / (slidesToShow) / 2
                                            }}
                                            onMouseDown={e => {
                                                e.preventDefault()
                                                onHandleMouseDown(e)
                                            }}
                                            onMouseUp={e => {
                                                e.preventDefault()
                                                onHandleMouseUp(e)
                                            }}
                                            onTouchStart={onHandleTouchStart}
                                            onTouchEnd={onHandleTouchEnd}
                                            onMouseLeave={e => {
                                                e.stopPropagation();
                                                setIsIntervalBlocked(false)
                                            }}
                                            onMouseEnter={e => {
                                                e.stopPropagation()
                                                setIsIntervalBlocked(true)
                                            }}
                                        >
                                            {Item}
                                        </div>
                                    })
                                }
                            </div>
                        </div>

                        <div className="simple-slider__dots">
                            {
                                Children.map(children, (_, index) => {
                                    return (
                                        <div
                                            className={`simple-slider__dots-item${index === (counter.current <= 0 ? Math.abs(counter.current) : COUNT_OF_CHILDS - counter.current) ? ' active' : ``}`}
                                            onClick={() => onHandleDotClick(index)}
                                        />
                                    )
                                })
                            }
                        </div>

                        <button
                            className='simple-slider__btn simple-slider__btn--next'
                            onClick={e => {
                                e.stopPropagation();
                                slideEventHandler(1, null, speed);
                            }}
                            onMouseEnter={e => {
                                e.stopPropagation()
                                setIsIntervalBlocked(true)
                            }}
                            style={isSmall ? { display: "none" } : ({
                                left: sliderCardsWidth / slidesToShow / 2 - 80,
                                top: sliderCardsWidth / slidesToShow / 4 - 12
                            })}

                        >
                            {"<"}
                        </button>

                        <button
                            className='simple-slider__btn simple-slider__btn--prev'
                            onClick={e => {
                                e.stopPropagation();
                                slideEventHandler(-1, null, speed);
                            }}
                            onMouseEnter={e => {
                                e.stopPropagation()
                                setIsIntervalBlocked(true)
                            }}
                            style={isSmall ? { display: "none" } : {
                                right: sliderCardsWidth / slidesToShow / 2 - 80,
                                top: sliderCardsWidth / slidesToShow / 4 - 12
                            }}
                        >
                            {">"}
                        </button>
                    </div>
                </section>
            }
        </div>
    )
})

export default SimpleSlider;