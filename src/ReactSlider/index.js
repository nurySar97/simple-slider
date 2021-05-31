import "./styles.scss";
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Cards from './components/Cards';
import Dots from "./components/Dots";
import Buttons from "./components/Buttons";
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
    isSmall = false,
    beforeChange
}) => {
    /* Variables start */
    const COUNT_OF_CHILDS = children?.length || 0;
    let FREQUENCY = frequency === 0 ? 0 : (frequency < 300) ? 300 : frequency;
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
    /* Variables End */

    /* RETURN DEFAULT */
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

    /* BUTTON HANDLER */
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
            slidesToShow,
            beforeChange
        )
    }, [COUNT_OF_CHILDS, sliderCardsWidth, setHandleAutoControl, slidesToShow, beforeChange]);

    /* MOUSE OUT */
    const onHandleMouseOut = ({ clientX }) => {
        if (isBlocked.current) return;
        onHandleMouseUp({ clientX: clientX });
        sliderTrack.current.onmousemove = () => null;
    }

    /* MOUSE DOWN */
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

    /* MOUSE MOVE */
    function onHandleMouseMove({ clientX }) {
        if (isBlocked.current) return;
        _onHandleMouseMove(clientX, setSliderTrackStyles, memory)
    }

    /* MOUSE UP */
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

    /* TOUCH END */
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

    /* DOT CLICK */
    const onHandleDotClick = (index) => {
        if (isBlocked.current) return;
        let _active_key = (counter.current <= 0 ? Math.abs(counter.current) : COUNT_OF_CHILDS - counter.current);
        slideEventHandler(_active_key - index, null, speed);
    }

    /* EFFECT FOR INIT */
    useEffect(() => {
        if (children) {
            setHandleAutoControl();
            window.addEventListener("resize", setHandleAutoControl);

            return () => {
                window.removeEventListener('resize', setHandleAutoControl);
            }
        }
    }, [setHandleAutoControl, children]);

    /* EFFECT FOR AUTO SLIDE */
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
                                <Cards
                                    sliderCardsWidth={sliderCardsWidth}
                                    slidesToShow={slidesToShow}
                                    onHandleMouseDown={onHandleMouseDown}
                                    onHandleMouseUp={onHandleMouseUp}
                                    onHandleTouchStart={onHandleTouchStart}
                                    onHandleTouchEnd={onHandleTouchEnd}
                                    setIsIntervalBlocked={setIsIntervalBlocked}
                                    children={children}
                                    COUNT_OF_CHILDS={COUNT_OF_CHILDS}
                                />
                            </div>
                        </div>

                        <Dots
                            children={children}
                            counter={counter}
                            COUNT_OF_CHILDS={COUNT_OF_CHILDS}
                            onHandleDotClick={onHandleDotClick}
                        />

                        <Buttons
                            slideEventHandler={slideEventHandler}
                            setIsIntervalBlocked={setIsIntervalBlocked}
                            isSmall={isSmall}
                            sliderCardsWidth={sliderCardsWidth}
                            slidesToShow={slidesToShow}
                            speed={speed}
                        />
                    </div>
                </section>
            }
        </div>
    )
})

export default SimpleSlider;