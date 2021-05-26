import React from 'react';
import data from './data';
import SimpleSlider from './ReactSlider';

const App = () => {
  return (
    <div className="app">
      <SimpleSlider>
        {
          data.map(item => {
            return <div key={item.id}>
              <img className='slider__img' src={item.image} alt="" />
            </div>
          })
        }
      </SimpleSlider>
    </div>
  )
}

export default App;