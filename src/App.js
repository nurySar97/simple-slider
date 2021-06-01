import React from 'react';
import data from './data';
import SimpleSlider from './SimpleSlider';
// import ReactSlider from './ReactSlider';
import { useScreenSize } from './ReactSlider/utils/useScreen';

const App = () => {
  const { isSmall } = useScreenSize();
  let slidesToShow = isSmall ? 1 : 2;
  let moveLeft = isSmall ? 0 : .5;
  let addWidth = isSmall ? 0 : 230;

  return (
    <div className="app">
      <SimpleSlider
        slidesToShow={slidesToShow}
        moveLeft={moveLeft}
        addWidth={addWidth}
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