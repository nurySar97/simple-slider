import React from 'react';
import data from './data';
import SimpleSlider from './ReactSlider';
import { useScreenSize } from './ReactSlider/utils/useScreen';

const App = () => {
  const { isSmall } = useScreenSize();
  let slidesToShow = isSmall ? 1 : 2;
  let moveLeft = isSmall ? 0 : .5;

  return (
    <div className="app">
      <SimpleSlider
        speed={400}
        frequency={3000}
        slidesToShow={slidesToShow}
        moveLeft={moveLeft}
        isSmall={isSmall}
      >
        {
          data.map(item => {
            return <div className="slider__item" key={item.id}>
              <img className='slider__img' src={item.image} alt="" />
            </div>
          })
        }
      </SimpleSlider>
    </div>
  )
}

export default App;