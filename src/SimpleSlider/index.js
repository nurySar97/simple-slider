import './styles.scss';
import React, { createRef } from 'react';
import Slides from './components/Slides';
import { Events } from './eventClasses';
import Buttons from './components/Buttons';

class Slider extends Events {

    static getDerivedStateFromProps(props, state) {
        return { ...state, ...props }
    }

    constructor(props) {
        super(props)
        this.sliderList = createRef(null);
        this.sliderTrack = createRef(null);
        this.prevSliderTrackStyles = createRef({});
        this.isBlocked = createRef(false);
        this.counter = createRef(0);
        this.state = {
            sliderTrackStyles: {},
            sliderListWidth: 0
        };
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
                    {
                        this.state.children && <div className="simple-slider__inner">
                            <div
                                className="simple-slider__list"
                                ref={this.sliderList}
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

                                <Buttons
                                    slideEventHandler={this.slideEventHandler}
                                    state={this.state}
                                />
                            </div>
                        </div>
                    }
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
    return <Slider
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
}

export default Default;