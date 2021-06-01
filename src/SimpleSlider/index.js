import './styles.scss';
import React, { createRef } from 'react';
import Slides from './components/Slides';
import { Events } from './eventClasses';
import Buttons from './components/Buttons';

class Slider extends Events {
    state = {
        sliderTrackStyles: {},
        sliderListWidth: 0
    };
    sliderList = createRef(null);
    sliderTrack = createRef(null);
    prevSliderTrackStyles = {};
    isBlocked = false;
    counter = 0;
    memoryCoords = {
        MOUSE_DOWN_X: 0,
        MOUSE_MOVE_X: 0,
        MOUSE_DOWN_CLIENT_X: 0
    }

    static getDerivedStateFromProps(props, state) {
        return { ...state, ...props }
    }

    componentDidMount() {
        this.setHandleAutoControl();
        window.addEventListener("resize", this.setHandleAutoControl)
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.setHandleAutoControl)
    };

    render() {
        return (
            <div className='container'>
                <section className="simple-slider">
                    <div className="simple-slider__inner">
                        <div
                            className="simple-slider__list"
                            ref={this.sliderList}
                            onMouseDown={this.onHandleMouseDown.bind(this)}
                            onMouseUp={this.onHandleMouseUp.bind(this)}
                            onTouchStart={this.onHandleTouchStart.bind(this)}
                            onTouchEnd={this.onHandleTouchEnd.bind(this)}
                        >
                            <div
                                className="simple-slider__track"
                                style={this.state.sliderTrackStyles}
                                ref={this.sliderTrack}
                            >
                                <Slides
                                    state={this.state}
                                />
                            </div>
                        </div>
                        <Buttons
                            slideEventHandler={this.slideEventHandler}
                            state={this.state}
                        />
                    </div>
                </section>
            </div>
        )
    }
}

const Default = ({
    children,
    direction = "left",
    frequency = 0,
    speed = 250,
    slidesToShow = 2,
    moveLeft = 0,
    buttons = true,
    addWidth = 0,
    dots = null,
    initPosition = 1,
    widthHeightAttitude = 2
}) => {
    const COUNT_OF_CHILDS = children ? children.length : 0
    return children ? <Slider
        children={children}
        direction={direction}
        frequency={frequency === 0 ? 0 : (frequency < 300) ? 300 : frequency}
        speed={speed}
        slidesToShow={slidesToShow}
        moveLeft={moveLeft}
        buttons={buttons}
        addWidth={addWidth}
        dots={dots}
        initPosition={initPosition === COUNT_OF_CHILDS ? 0 : (initPosition <= 0 ? Math.abs(initPosition) : COUNT_OF_CHILDS - initPosition)}
        widthHeightAttitude={widthHeightAttitude}
        countOfChildren={COUNT_OF_CHILDS}

    />
        :
        null
}

export default Default;