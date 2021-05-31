import React from 'react'

const Buttons = ({
    slideEventHandler,
    setIsIntervalBlocked,
    isSmall,
    sliderCardsWidth,
    slidesToShow,
    speed
}) => {
    return (
        <>
            <button
                className='simple-slider__btn simple-slider__btn--next'
                onClick={e => {
                    e.stopPropagation();
                    slideEventHandler(1, null, speed);
                }}
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsIntervalBlocked(true)
                }}
                style={isSmall ? { display: "none" } : ({
                    left: sliderCardsWidth / slidesToShow / 2 - 80,
                    top: sliderCardsWidth / slidesToShow / 4 - 12
                })}

            >
                {"<"}
            </button>

            <button
                className='simple-slider__btn simple-slider__btn--prev'
                onClick={e => {
                    e.stopPropagation();
                    slideEventHandler(-1, null, speed);
                }}
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsIntervalBlocked(true)
                }}
                style={isSmall ? { display: "none" } : {
                    right: sliderCardsWidth / slidesToShow / 2 - 80,
                    top: sliderCardsWidth / slidesToShow / 4 - 12
                }}
            >
                {">"}
            </button>
        </>
    )
}

export default Buttons;