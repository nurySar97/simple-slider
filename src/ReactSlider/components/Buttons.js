import React from 'react'

const Buttons = ({
    slideEventHandler,
    setIsIntervalBlocked,
    sliderCardsWidth,
    slidesToShow,
    speed,
    addWidth,
    buttons,
    widthHeightAttitude
}) => {
    let leftRight = (sliderCardsWidth / slidesToShow / 2) - 80 - addWidth / 2;
    let topBottom = (sliderCardsWidth / slidesToShow) / (widthHeightAttitude *2) - 12;
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
                style={buttons ? ({
                    left: leftRight,
                    top: topBottom
                }) : { display: "none" }
                }

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
                style={buttons ? {
                    right: leftRight,
                    top: topBottom
                } : { display: "none" }
                }
            >
                {">"}
            </button>
        </>
    )
}

export default Buttons;