import { PureComponent } from 'react';
import { transition, translateX } from './../utils';

export class Events extends PureComponent {
    /* GETTERS */
    get remainder() {
        return (this.sliderList.current.clientWidth + this.state.addWidth) % this.state.slidesToShow
    }

    get sliderListWidth() {
        return this.sliderList.current.clientWidth + this.state.addWidth - this.remainder
    }

    get transformValue() {
        return - this.slideWidth * (this.countOfChildren * 2 - this.state.moveLeft + this.counter.current)
    }

    get slideWidth() {
        return this.sliderListWidth / this.state.slidesToShow
    }

    get countOfChildren() {
        return this.state.countOfChildren
    }

    get getCounter() {
        return this.counter.current
    }

    set setCounter(value) {
        this.counter.current = value
    }

    /* AUTO CONTROL */
    setHandleAutoControl = () => {
        this.prevSliderTrackStyles.current = {
            width: this.slideWidth * this.countOfChildren * 5,
            transform: translateX(this.transformValue),
            transformValue: this.transformValue,
            transition: transition()
        }

        this.setState({
            sliderListWidth: this.sliderListWidth,
            sliderTrackStyles: this.prevSliderTrackStyles.current
        })
    }

    /* SLIDE EVENT HANDLER */
    slideEventHandler = (coefficient, eventType, speed) => {
        if (this.isBlocked.current) return;
        this.isBlocked.current = true;
        this.counter.current = this.counter.current + coefficient;

        this.setState((prevState) => {
            let _TRANSFORM = eventType
                ? prevState.sliderTrackStyles.transformValue + coefficient * this.slideWidth
                : this.prevSliderTrackStyles.current.transformValue + coefficient * this.slideWidth
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
                if (this.counter.current === (coefficient > 0 ? 1 : -1) * this.countOfChildren) {
                    this.counter.current = 0;
                    this.setHandleAutoControl();
                }
                resolve()
            }, speed * 1.1);
        }).then(() => {
            this.isBlocked.current = false
        })

    }
}