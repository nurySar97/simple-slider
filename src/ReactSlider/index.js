import "./styles.scss";
import React, { Children, useCallback, useEffect, useRef, useState } from 'react';
import nextId from "react-id-generator";

let multiplyArray = array => [...array, ...array, ...array];
let transition = (s = 0) => `all ${s}ms linear`;
let translateX = (value = 0) => `translateX(${value}px)`;

const ReactSlider = ({ children, showItemsCount }) => {
    const counter = useRef(0);
    const isBlocked = useRef(false);
    const simpleSliderItems = useRef(null);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [sliderItemsWidth, setSliderItemsWidth] = useState(0);
    const [sliderTrackStyles, setSliderTrackStyles] = useState({});

    const setHandleWidthToItems = useCallback(() => {
        let _WHIDTH_SLIDER_ITEMS = simpleSliderItems.current.clientWidth;
        let _TRANSFORM = -_WHIDTH_SLIDER_ITEMS + counter.current * (_WHIDTH_SLIDER_ITEMS/3);

        if (_WHIDTH_SLIDER_ITEMS % 3 === 0) {
            setSliderItemsWidth(_WHIDTH_SLIDER_ITEMS);
            setSliderTrackStyles(prev => ({
                ...prev,
                width: _WHIDTH_SLIDER_ITEMS * 3,
                transform: translateX(_TRANSFORM),
                count: _TRANSFORM,
                transition: transition()
            }))
            return
        }
        _TRANSFORM = -(_WHIDTH_SLIDER_ITEMS - _WHIDTH_SLIDER_ITEMS % 3) + counter.current * (_WHIDTH_SLIDER_ITEMS - _WHIDTH_SLIDER_ITEMS % 3)/3;

        setSliderItemsWidth(_WHIDTH_SLIDER_ITEMS - _WHIDTH_SLIDER_ITEMS % 3);
        setSliderTrackStyles(prev => ({
            ...prev,
            width: (_WHIDTH_SLIDER_ITEMS - _WHIDTH_SLIDER_ITEMS % 3) * 3,
            transform: translateX(_TRANSFORM),
            count: _TRANSFORM,
            transition: transition()
        }))
    }, []);

    const slideEventHandler = (q = 1) => {
        if (isBlocked.current) return;
        isBlocked.current = true;

        setTimeout(() => {
            isBlocked.current = false;
        }, 330)

        if (counter.current === q * 3) {
            counter.current = 0;
            setHandleWidthToItems();
        }

        setTimeout(() => {
            setSliderTrackStyles(prev => ({
                ...prev,
                transform: translateX(prev.count + q * (sliderItemsWidth / 3)),
                count: prev.count + q * (sliderItemsWidth / 3),
                transition: transition(300)
            }))
            counter.current = counter.current + q
        }, 30)
    }

    useEffect(() => {
        setIsPageLoaded(() => true);
        setHandleWidthToItems();
        window.addEventListener("resize", setHandleWidthToItems);
        return () => {
            window.removeEventListener('resize', setHandleWidthToItems);
        }
    }, [setHandleWidthToItems]);

    return (
        <div className='container'>
            <section className="simple-slider">
                <div className="simple-slider__inner">

                    <button
                        className='simple-slider__btn simple-slider__bnt--next'
                        onClick={() => slideEventHandler()}
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
                        onClick={() => slideEventHandler(-1)}
                    >
                        Previous
                    </button>
                </div>
            </section>
        </div>
    )
}

export default ReactSlider;