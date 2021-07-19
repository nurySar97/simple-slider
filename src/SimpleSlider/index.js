import './styles.scss';
import React, { createRef } from 'react';
import Slides from './components/Slides';
import SuperClass from './eventClasses';
import Buttons from './components/Buttons';
import Dots from './components/Dots';

class Slider extends SuperClass {
    state = {
        sliderTrackStyles: {},
        sliderListWidth: 0,
        isMouseEnter: false
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
    observerSliderList = null;

    static getDerivedStateFromProps = (props, state) => ({ ...state, ...props });

    componentDidUpdate(prevProps, prevState) {
        if (this.props.frequency !== 0) {
            if ((
                this.props.frequency !== 0
                &&
                this.props.frequency !== prevProps.frequency
            )
                ||
                (
                    !this.state.isMouseEnter
                    && prevState.isMouseEnter !== this.state.isMouseEnter
                )) {
                this.interval = setInterval(() => {
                    this.slideEventHandler(-1, 'click', 200)
                }, this.state.frequency)
            } else if ((
                this.props.frequency === 0
                &&
                this.props.frequency !== prevProps.frequency
            )
                ||
                (
                    this.state.isMouseEnter
                    &&
                    prevState.isMouseEnter !== this.state.isMouseEnter
                )) {
                clearInterval(this.interval)
            }
        }

    }

    componentDidMount() {
        this.observerSliderList = new ResizeObserver(this.setHandleAutoControl)
            .observe(this.sliderList.current);

        if (this.state.frequency !== 0) {
            this.interval = setInterval(() => {
                this.slideEventHandler(-1, 'click', 200)
            }, this.state.frequency)
        }
    };

    componentWillUnmount() {
        this.observerSliderList?.disconnect(this.sliderList.current);
        clearInterval(this.interval)
    };

    render() {
        return (
            <div className='container'>
                <section className="simple-slider">
                    <div className="simple-slider__inner"
                        onMouseEnter={() => this.setState({ isMouseEnter: true })}
                        onMouseLeave={() => this.setState({ isMouseEnter: false })}
                    >
                        <div
                            className="simple-slider__list"
                            ref={e => !!e && (this.sliderList.current = e)}
                            onMouseDown={this.onHandleMouseDown.bind(this)}
                            onTouchStart={this.onHandleTouchStart.bind(this)}
                        >
                            <div
                                className="simple-slider__track"
                                style={this.state.sliderTrackStyles}
                                ref={e => !!e && (this.sliderTrack.current = e)}
                            >
                                <Slides
                                    state={this.state}
                                />
                            </div>
                        </div>

                        <Dots onHandleDotClick={this.onHandleDotClick.bind(this)} counter={this.counter} state={this.state} />

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
    speed = 500,
    slidesToShow = 2,
    moveLeft = 0,
    buttons = true,
    addWidth = 0,
    dots = null,
    initPosition = 1,
    widthHeightAttitude = 2,
    beforeChange = null
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
        beforeChange={beforeChange}
    />
        :
        null
}

export default Default;