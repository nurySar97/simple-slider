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
    const COUNT_OF_CHILDS = children?.length;


    const setHandleWidthToItems = useCallback(() => {
        let _SLIDER_ITEMS_WIDTH = simpleSliderItems.current.clientWidth;
        let _TRANSFORM = -(_SLIDER_ITEMS_WIDTH/2) * COUNT_OF_CHILDS + counter.current * (_SLIDER_ITEMS_WIDTH/2);

        if (_SLIDER_ITEMS_WIDTH % 2 === 0) {
            setSliderItemsWidth(_SLIDER_ITEMS_WIDTH);
            setSliderTrackStyles(prev => ({
                ...prev,
                width: (_SLIDER_ITEMS_WIDTH/2) * COUNT_OF_CHILDS * 3,
                transform: translateX(_TRANSFORM),
                count: _TRANSFORM,
                transition: transition()
            }))
            return
        }

        _TRANSFORM = -(_SLIDER_ITEMS_WIDTH - _SLIDER_ITEMS_WIDTH % 2)/2 * COUNT_OF_CHILDS + counter.current * (_SLIDER_ITEMS_WIDTH - _SLIDER_ITEMS_WIDTH % 2)/2;

        setSliderItemsWidth(_SLIDER_ITEMS_WIDTH - _SLIDER_ITEMS_WIDTH % 2);
        setSliderTrackStyles(prev => ({
            ...prev,
            width: ((_SLIDER_ITEMS_WIDTH - _SLIDER_ITEMS_WIDTH % 2)/2) * COUNT_OF_CHILDS * 3,
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

        if (counter.current === q * COUNT_OF_CHILDS) {
            counter.current = 0;
            setHandleWidthToItems();
        }

        setTimeout(() => {
            setSliderTrackStyles(prev => ({
                ...prev,
                transform: translateX(prev.count + q * (sliderItemsWidth / 2)),
                count: prev.count + q * (sliderItemsWidth / 2),
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
                                            width: (sliderItemsWidth / 2)
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