import React, { Children } from 'react'

const Dots = ({
    children,
    counter,
    COUNT_OF_CHILDS,
    onHandleDotClick,
    dots
}) => {
    return dots && (
        <div className="simple-slider__dots">
            {
                Children.map(children, (_, index) => {
                    let _isActive = index === (counter.current <= 0 ? Math.abs(counter.current) : COUNT_OF_CHILDS - counter.current);
                    return (
                        <div
                            className={`simple-slider__dots-item${_isActive ? ' active' : ``}`}
                            onClick={() => onHandleDotClick(index)}
                        />
                    )
                })
            }
        </div>
    )
}

export default Dots;