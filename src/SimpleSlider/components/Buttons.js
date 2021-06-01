import React from 'react'

const Buttons = ({
    state: {
        slidesToShow,
        sliderListWidth,
        widthHeightAttitude,
        addWidth,
        buttons
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
                onClick={() => slideEventHandler(1, 'click', 200)}
            />

            <button
                className='simple-slider__btn simple-slider__btn--prev'
                onClick={() => slideEventHandler(-1, 'click', 200)}
                style={buttons ? { right: leftRight, top: topBottom } : { display: "none" }}
                children={">"}
            />
        </>
    )
}

export default Buttons;