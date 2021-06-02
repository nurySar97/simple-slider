import React, { useState } from 'react';
import SimpleSlider from './SimpleSlider';
import data from './SimpleSlider/data';
import { transition } from './SimpleSlider/utils';
import { useScreenSize } from './SimpleSlider/utils/useScreen';

const App = () => {
  const { isSmall } = useScreenSize();
  let slidesToShow = isSmall ? 1 : 2;
  let moveLeft = isSmall ? 0 : .5;
  let addWidth = isSmall ? 0 : 230;
  let [counter, setCounter] = useState(0);

  return (
    <div className="app">
      <SimpleSlider
        slidesToShow={slidesToShow}
        moveLeft={moveLeft}
        addWidth={addWidth}
        buttons={!isSmall}
        beforeChange={index => setCounter(index)}
        widthHeightAttitude={isSmall ? 1.7 : 2}
        dots={true}
      >
        {
          data.map((item, index) => {
            return <div style={{
              opacity: counter === index ? 1 : .5,
              transition: transition(200)
            }} className="slider__item" key={item.id}>
              <img className='slider__img' src={item.image} alt="" />
            </div>
          })
        }
      </SimpleSlider>
    </div>
  )
}

export default App;