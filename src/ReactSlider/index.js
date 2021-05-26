import "./styles.scss";
import React, { Children, useCallback, useEffect, useRef, useState } from 'react';
import nextId from "react-id-generator";

let multiplyArray = array => [...array, ...array, ...array];

let transition = (s = 0) => `all ${s}ms linear`;
let translateX = (value = 0) => `translateX(${value}px)`;

const ReactSlider = ({ children }) => {
    const counter = useRef(0);
    const isBlocked = useRef(false);
    const simpleSliderItems = useRef(null);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [sliderItemsWidth, setSliderItemsWidth] = useState(0);
    const [sliderTrackStyles, setSliderTrackStyles] = useState({});

    const setHandleWidthToItems = useCallback(() => {
        let _WIDTH = simpleSliderItems.current.clientWidth;

        if (_WIDTH % 3 === 0) {
            setSliderItemsWidth(_WIDTH);
            setSliderTrackStyles(prev => ({
                ...prev,
                width: _WIDTH * 3,
                transform: translateX(-_WIDTH),
                count: -_WIDTH,
                transition: transition()
            }))
        } else {
            setSliderItemsWidth(_WIDTH - _WIDTH % 3);
            setSliderTrackStyles(prev => ({
                ...prev,
                width: (_WIDTH - _WIDTH % 3) * 3,
                transform: translateX(-(_WIDTH - _WIDTH % 3)),
                count: -(_WIDTH - _WIDTH % 3),
                transition: transition()
            }))
        }
    }, []);

    const onNextHandleClick = () => {
        if (isBlocked.current) return;
        isBlocked.current = true

        setTimeout(() => {
            isBlocked.current = false
        }, 350)

        if (counter.current === 3) {
            setHandleWidthToItems();
            counter.current = 0;
        }

        setTimeout(() => {
            setSliderTrackStyles(prev => ({
                ...prev,
                transform: translateX(prev.count + (sliderItemsWidth / 3)),
                count: prev.count + (sliderItemsWidth / 3),
                transition: transition(200)
            }))
            ++counter.current
        }, 0)
    }

    const onPrevHandleClick = () => {
        if (isBlocked.current) return;
        isBlocked.current = true

        setTimeout(() => {
            isBlocked.current = false
        }, 350)

        if (counter.current === -3) {
            setHandleWidthToItems();
            counter.current = 0;
        }

        setTimeout(() => {
            setSliderTrackStyles(prev => ({
                ...prev,
                transform: translateX(prev.count - (sliderItemsWidth / 3)),
                count: prev.count - (sliderItemsWidth / 3),
                transition: transition(200)
            }))
            --counter.current
        }, 0)
    }

    useEffect(() => {
        setIsPageLoaded(() => true);
        setHandleWidthToItems()

        window.addEventListener("resize", setHandleWidthToItems);
        return () => {
            window.removeEventListener('resize', setHandleWidthToItems)
        }
    }, [setHandleWidthToItems]);

    return (
        <div className='container'>
            <div className="simple-slider">
                {sliderItemsWidth}
                <div className="simple-slider__inner">

                    <button
                        className='simple-slider__btn simple-slider__bnt--next'
                        onClick={onNextHandleClick}
                    >
                        Next
                    </button>

                    <div
                        className="simple-slider__items"
                        ref={simpleSliderItems}
                    >
                        <div
                            style={sliderTrackStyles}
                            className="simple-slider__track"
                        >
                            {
                                isPageLoaded
                                &&
                                Children.map(multiplyArray(children), Item => {
                                    return <div
                                        className='simple-slider__item'
                                        key={nextId()}
                                        style={{
                                            width: (sliderItemsWidth / 3)
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
                        onClick={onPrevHandleClick}
                    >
                        Previous
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReactSlider;