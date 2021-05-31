import React, { Children, useMemo } from 'react';
import { multiplyArray } from '../utils';
import { keyGenerator } from '../utils/keyGenerator';

const Default = ({
    sliderCardsWidth,
    slidesToShow,
    onHandleMouseDown,
    onHandleMouseUp,
    onHandleTouchStart,
    onHandleTouchEnd,
    setIsIntervalBlocked,
    children,
    COUNT_OF_CHILDS
}) => {
    let memorizedChilds = useMemo(() => children && multiplyArray(children), [children]);
    let memorizedKeys = useMemo(() => keyGenerator(COUNT_OF_CHILDS), [COUNT_OF_CHILDS]);
    return (
        <>
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
        </>
    )
}

export default Default;