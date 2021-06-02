import { PureComponent } from 'react';
import { transition, translateX } from './../utils';

export class Events extends PureComponent {
    /* GETTERS */
    get getSliderTrack() {
        return this.sliderTrack.current
    }

    get getSliderTrackStyles() {
        return this.state.sliderTrackStyles
    }

    get getSliderListWidth() {
        return this.sliderList.current.clientWidth + this.state.addWidth - this.getRemainder
    }

    get getSlideWidth() {
        return this.getSliderListWidth / this.state.slidesToShow
    }

    get getTransformValue() {
        return - this.getSlideWidth * (this.getCountOfChildren * 2 - this.state.moveLeft - this.counter) - this.state.addWidth / 2
    }

    get getRemainder() {
        return (this.sliderList.current.clientWidth + this.state.addWidth) % this.state.slidesToShow
    }

    get getCountOfChildren() {
        return this.state.countOfChildren
    }

    /* AUTO CONTROL */
    setHandleAutoControl = () => {
        this.prevSliderTrackStyles = {
            width: this.getSlideWidth * this.getCountOfChildren * 5,
            transform: translateX(this.getTransformValue),
            transformValue: this.getTransformValue,
            transition: transition()
        }

        this.setState({
            sliderListWidth: this.getSliderListWidth,
            sliderTrackStyles: this.prevSliderTrackStyles
        })
    }

    /* SLIDE EVENT HANDLER */
    slideEventHandler = (coefficient, eventType, speed) => {
        if (this.isBlocked) return;

        this.isBlocked = true;
        this.counter = this.counter + coefficient

        new Promise(r => {
            let _arg = Math.abs(this.counter) === this.getCountOfChildren
                ? 0
                : (this.counter <= 0 ? Math.abs(this.counter)
                    : this.getCountOfChildren - this.counter);
            this.state.beforeChange && this.state.beforeChange(_arg);
            setTimeout(r, 0)
        }).then(() => {
            this.setState((prevState) => {
                let _TRANSFORM = eventType
                    ? prevState.sliderTrackStyles.transformValue + coefficient * this.getSlideWidth
                    : this.prevSliderTrackStyles.transformValue + coefficient * this.getSlideWidth
                return {
                    ...prevState,
                    sliderTrackStyles: {
                        ...prevState.sliderTrackStyles,
                        transform: translateX(_TRANSFORM),
                        transformValue: _TRANSFORM,
                        transition: transition(speed)
                    }
                }
            })

            new Promise(resolve => {
                setTimeout(() => {
                    if (this.counter === (coefficient > 0 ? 1 : -1) * this.getCountOfChildren) {
                        this.counter = 0
                        this.setHandleAutoControl();
                    }
                    resolve(false)
                }, speed * 1.2);
            }).then(isBlocked => {
                this.isBlocked = isBlocked
            })
        })
    }

    /* DOT CLICK */
    onHandleDotClick(index) {
        let _active_key = (this.counter <= 0 ? Math.abs(this.counter) : this.getCountOfChildren - this.counter);
        this.slideEventHandler(_active_key - index, 'click', this.state.speed)
    }

    /* ON MOUSE DOWN */
    onHandleMouseDown = (e) => {
        e.preventDefault()
        if (this.isBlocked) return;
        this.getSliderTrack.onmousemove = e => this.onHandleMouseMove(e);
        this.getSliderTrack.onmouseleave = e => this.onHandleMouseOut(e);
        this.getSliderTrack.onmouseup = e => this.onHandleMouseUp(e)
        this.prevSliderTrackStyles = this.getSliderTrackStyles;
        this.memoryCoords['MOUSE_DOWN_X'] = e.clientX - this.getSliderTrackStyles.transformValue;
        this.memoryCoords['MOUSE_DOWN_CLIENT_X'] = e.clientX;

    }

    /* ON MOUSE MOVE */
    onHandleMouseMove = ({ clientX }) => {
        if (this.isBlocked) return;
        this.setState(prevState => {
            let _TRANSFORM = clientX - this.memoryCoords['MOUSE_DOWN_X'];
            return {
                ...prevState,
                sliderTrackStyles: {
                    ...prevState.sliderTrackStyles,
                    transform: translateX(_TRANSFORM),
                    transformValue: _TRANSFORM,
                    transition: transition(0)
                }
            }
        })
    }

    /* ON MOUSE UP */
    onHandleMouseUp = (e) => {
        if (this.isBlocked) return;
        this.getSliderTrack.onmousemove = () => null;
        this.getSliderTrack.onmouseleave = () => null;
        this.getSliderTrack.onmouseup = () => null;

        const _DIFERENCE = e.clientX - this.memoryCoords['MOUSE_DOWN_CLIENT_X'];
        this.autoTouchAndMoveController(_DIFERENCE)
    }

    /* ON MOUSE OUT */
    onHandleMouseOut = ({ clientX }) => {
        if (this.isBlocked) return;
        this.onHandleMouseUp({ clientX })
        this.getSliderTrack.onmouseup = e => null
        this.getSliderTrack.onmousemove = () => null;
        this.getSliderTrack.onmouseleave = () => null;
    }

    // TOUCH START
    onHandleTouchStart = (e) => {
        if (this.isBlocked) {
            this.getSliderTrack.ontouchend = () => null
            return
        };
        this.getSliderTrack.ontouchmove = e => this.onHandleTouchMove(e);
        this.getSliderTrack.ontouchend = e => this.onHandleTouchEnd(e)
        const clientX = (e.changedTouches[0].clientX);
        this.prevSliderTrackStyles = this.getSliderTrackStyles;
        this.memoryCoords['MOUSE_DOWN_X'] = clientX - this.getSliderTrackStyles.transformValue;
        this.memoryCoords['MOUSE_DOWN_CLIENT_X'] = clientX;

    }

    // TOUCH MOVE
    onHandleTouchMove = (e) => {
        if (this.isBlocked) return;
        const clientX = (e.changedTouches[0].clientX);
        this.setState(prevState => {
            let _TRANSFORM = clientX - this.memoryCoords['MOUSE_DOWN_X'];
            return {
                ...prevState,
                sliderTrackStyles: {
                    ...prevState.sliderTrackStyles,
                    transform: translateX(_TRANSFORM),
                    transformValue: _TRANSFORM,
                    transition: transition(0)
                }
            }
        })
    }

    /* TOUCH END */
    onHandleTouchEnd = (e) => {
        e.stopPropagation();
        if (this.isBlocked) return;
        this.getSliderTrack.ontouchmove = e => null;
        const clientX = (e.changedTouches[0].clientX);
        const _DIFERENCE = clientX - this.memoryCoords['MOUSE_DOWN_CLIENT_X'];
        this.autoTouchAndMoveController(_DIFERENCE)
        this.getSliderTrack.onHandleTouchEnd = () => null;
    }

    autoTouchAndMoveController(difference) {
        if (difference !== 0) {
            if (difference > 0) {
                if (difference > this.getSlideWidth / 10) {
                    this.slideEventHandler(1, null, 500)
                } else {
                    this.returnSliderPrevPosition()
                }
            } else {
                if (difference < -this.getSlideWidth / 10) {
                    this.slideEventHandler(-1, null, 500)
                } else {
                    this.returnSliderPrevPosition()
                }
            }
        } else {
            this.setState({ isGrabbing: false })
        }
    }

    returnSliderPrevPosition() {
        this.setState(prevState => {
            return {
                ...prevState,
                sliderTrackStyles: {
                    ...this.prevSliderTrackStyles,
                    transition: transition(200)
                }
            }
        })
    }
}