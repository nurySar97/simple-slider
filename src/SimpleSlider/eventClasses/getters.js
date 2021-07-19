import { PureComponent } from 'react';

export class Getters extends PureComponent {
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
}