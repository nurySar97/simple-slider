import "./styles.scss";
import React, {
    Children,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    _setHandleAutoControl,
    _slideEventHandler
} from "./functions";
import { multiplyArray, transition, translateX } from "./utils";
import nextId from "react-id-generator";


const SimpleSlider = ({ children, showItemsCount }) => {
    // Variables start
    const COUNT_OF_CHILDS = children?.length;
    const memory = useRef({
        MOUSE_DOWN_X: 0,
        MOUSE_MOVE_X: 0,
        MOUSE_DOWN_CLIENT_X: 0
    });
    const counter = useRef(0);
    const isBlocked = useRef(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const sliderCards = useRef(null);
    const sliderTrack = useRef(null);
    const [sliderCardsWidth, setSliderCardsWidth] = useState(0);
    const [sliderTrackStyles, setSliderTrackStyles] = useState({});
    // Variables End

    const setHandleAutoControl = useCallback(() => {
        _setHandleAutoControl(
            counter,
            sliderCards,
            COUNT_OF_CHILDS,
            setSliderCardsWidth,
            setSliderTrackStyles
        )
    }, [COUNT_OF_CHILDS]);


    const slideEventHandler = useCallback(({ type, coefficient: coef }) => {
        _slideEventHandler(
            type,
            coef,
            isBlocked,
            counter,
            setHandleAutoControl,
            setSliderTrackStyles,
            sliderCardsWidth,
            COUNT_OF_CHILDS
        )
    })


    const onHandleMouseMove = ({ clientX }) => {
        setSliderTrackStyles(prev => {
            return {
                ...prev,
                transform: translateX(clientX - memory.current['MOUSE_DOWN_X']),
                transformValue: clientX - memory.current['MOUSE_DOWN_X'],
                transition: transition()
            }
        })

    }


    const onHandleMouseOut = () => {
        sliderTrack.current.onmousemove = () => null;
    }


    const onHandleMouseDown = ({ clientX }) => {
        sliderTrack.current.onmousemove = e => onHandleMouseMove(e);


        memory.current['MOUSE_DOWN_X'] = clientX - sliderTrackStyles.transformValue;
        memory.current['MOUSE_DOWN_CLIENT_X'] = clientX;
    }


    const onHandleMouseUp = () => {
        sliderTrack.current.onmousemove = () => null;
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
                                ref={sliderTrack}
                                onMouseDown={onHandleMouseDown}
                                onMouseUp={onHandleMouseUp}
                                onMouseOut={onHandleMouseOut}
                            >
                                {
                                    isLoaded
                                    &&
                                    Children.map(multiplyArray(children), Item => {
                                        return <div
                                            className='simple-slider__card'
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