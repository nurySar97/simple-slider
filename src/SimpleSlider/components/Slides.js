import React, { Children, useMemo } from 'react';
import { multiplyArray } from '../utils';
import { keyGenerator } from '../utils';

const Default = ({
    state: {
        children,
        countOfChildren,
        sliderListWidth,
        slidesToShow,
        widthHeightAttitude
    }
}) => {
    let memorizedChilds = useMemo(() => children && multiplyArray(children), [children]);
    let memorizedKeys = useMemo(() => keyGenerator(countOfChildren), [countOfChildren]);
    let width = (sliderListWidth / slidesToShow)
    return (
        <>
            {
                Children.map(memorizedChilds, (Item, index) => {
                    return <div
                        className='simple-slider__slide'
                        key={memorizedKeys[index]}
                        style={{
                            width: width,
                            height: width / widthHeightAttitude
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