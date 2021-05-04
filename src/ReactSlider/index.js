import "./styles.scss";
import React, { useEffect, useRef, useState } from 'react';
let multiplyArray = array => [...array, ...array, ...array];
let data = [1, 2, 3];

const ReactSlider = () => {
    let showItemCount = 3;
    let Items = multiplyArray(data)
    let count = data.length;
    let [trackMoveSize, setTrackMoveSize] = useState(null);
    let reactSliderInner = useRef(null);
    let reactSliderItem = useRef(null);
    let [loaded, setLoaded] = useState(false);
    let counter = useRef(0);
    let transition = useRef(`all .3s linear`);

    let onHandleLeftClick = () => {
        if (counter.current === count) {
            new Promise(resolve => {
                transition.current = `all 0s linear`
                setTrackMoveSize(-(reactSliderInner.current.clientWidth / showItemCount) * count)
                resolve()
            }).then(() => {
                transition.current = `all .3s linear`
                setTrackMoveSize(prevMove => prevMove + reactSliderInner.current.clientWidth / showItemCount)
                counter.current = 1
            })
            return
        }
        setTrackMoveSize(prevMove => prevMove + reactSliderInner.current.clientWidth / showItemCount)
        counter.current = counter.current + 1
    }

    let onHandleRightClick = () => {
        if (counter.current === -count) {
            new Promise(resolve => {
                transition.current = `all 0s linear`
                setTrackMoveSize(-(reactSliderInner.current.clientWidth / showItemCount) * count)
                resolve()
            }).then(() => {
                transition.current = `all .3s linear`
                setTrackMoveSize(prevMove => prevMove - reactSliderInner.current.clientWidth / showItemCount)
                counter.current = -1
            })
            return
        }
        setTrackMoveSize(prevMove => prevMove - reactSliderInner.current.clientWidth / showItemCount)
        counter.current = counter.current - 1
    }

    useEffect(() => {
        setTrackMoveSize(-(reactSliderInner.current.clientWidth / showItemCount) * count)
        setLoaded(true)
        window.addEventListener("resize", () => {
            console.log(reactSliderInner.current.clientWidth)
        })
    }, [showItemCount, count])

    return (
        <div className='container'>
            <div className="react-slider">
                <div className="react-slider__inner" ref={reactSliderInner} >
                    {
                        loaded && <div
                            className="react-slider__track"
                            style={{
                                width: `${reactSliderInner.current.clientWidth / showItemCount * Items.length}px`,
                                transform: `translateX(${trackMoveSize}px)`,
                                transition: transition.current
                            }}
                        >
                            {
                                Items.map((item, index) => {
                                    return <div
                                        className={`react-slider-${item}`}
                                        style={{ width: `${reactSliderInner.current.clientWidth / showItemCount}px` }}
                                        key={index}
                                        ref={reactSliderItem}
                                    >
                                        {item}
                                    </div>
                                })
                            }
                        </div>
                    }
                </div>
            </div>
            <button onClick={onHandleRightClick}>
                {"<"}
            </button>
            <button onClick={onHandleLeftClick}>
                {">"}
            </button>
        </div>
    )
}

export default ReactSlider;