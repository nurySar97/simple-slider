import React from 'react'

const Buttons = ({
    state: {
        slidesToShow,
        sliderListWidth,
        widthHeightAttitude,
        addWidth,
        buttons,
        speed
    },
    slideEventHandler
}) => {
    let leftRight = (sliderListWidth / slidesToShow / 2) - 80 - addWidth / 2;
    let topBottom = (sliderListWidth / slidesToShow) / (widthHeightAttitude * 2) - 12;
    return (
        <>
            <button
                className='simple-slider__btn simple-slider__btn--next'
                style={buttons ? ({ left: leftRight, top: topBottom }) : { display: "none" }
                }
                children={"<"}
                onClick={e => {
                    e.stopPropagation();
                    slideEventHandler(1, 'click', speed)
                }}
            />

            <button
                className='simple-slider__btn simple-slider__btn--prev'
                onClick={e => {
                    e.stopPropagation();
                    slideEventHandler(-1, 'click', speed)
                }}
                style={buttons ? { right: leftRight, top: topBottom } : { display: "none" }}
                children={">"}
            />
        </>
    )
}

export default Buttons;