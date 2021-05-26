import React from 'react';
import ReactSlider from './ReactSlider';

let data = [
  { id: 1, image: "https://mediumrare.imgix.net/d7f44d827ca3824ec58930b8b2ebff0197cb26d2926068695386cfa5b456a9f7?auto=compress&q=30&w=720&dpr=2" },
  { id: 2, image: "https://mediumrare.imgix.net/ec524542538231432741801a0877a447af93c643d26ce9028705564ddb48db3d?auto=compress&q=30&w=720&dpr=2" },
  { id: 3, image: "https://mediumrare.imgix.net/50caaf40a9c41a8a1bdcac1571f901fceb4faad1efc29badcae647d56269c09f?auto=compress&q=30&w=720&dpr=2" },
  { id: 4, image: "https://mediumrare.imgix.net/4cd735f00e498513b1bfad2e66543995a97211c1ce0d300cafd937c79dd26db6?auto=compress&q=30&w=720&dpr=2" },
  { id: 5, image: "https://mediumrare.imgix.net/29accf806f194840c94f80507d9132842f4d9223d551114ca92996a2eb713670?auto=compress&q=30&w=720&dpr=2" },
]

const App = () => {
  return (
    <div className="App">
      <ReactSlider>
        {
          data.map(item => {
            return <div key={item.id}>
              <img className='slider__img' src={item.image} alt="" />
            </div>
          })
        }
      </ReactSlider>
    </div>
  )
}

export default App;