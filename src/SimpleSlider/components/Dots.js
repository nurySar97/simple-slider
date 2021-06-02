import React, { Children } from 'react'

const Dots = ({
    state: {
        children,
        countOfChildren,
        dots
    },
    counter,
    onHandleDotClick
}) => {
    return dots && (
        <div className="simple-slider__dots">
            {
                Children.map(children, (_, index) => {
                    let _isActive = index === (counter <= 0 ? Math.abs(counter) : countOfChildren - counter);
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