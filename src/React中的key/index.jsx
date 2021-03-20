import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';

const ListContext = React.createContext(null);

const App = () => {
  const [list, setList] = useState([]);
  const handleList = (l) => {
    setList(l);
  };

  return (
    <ListContext.Provider value={{ list, handleList }}>
      <Input />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span>key={`{value}`}.</span>
          <ListKeyIsRepeat />
        </div>
        <div>
          <span>key={`{index}`}.</span>
          <ListKeyIsUnique />
        </div>
      </div>
    </ListContext.Provider>
  );
};


const ListKeyIsRepeat = () => {
  const { list, handleList } = useContext(ListContext);

  const deleteItem = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    console.log('index', index, newList);
    handleList(newList);
  };

  return (
    <ul>
      {list.map((value, index) => (
        <li key={value}>
          <span style={{ marginRight: '5px' }}>{value}</span>
          <button
            onClick={() => {
              deleteItem(index);
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

const ListKeyIsUnique = () => {
  const { list, handleList } = useContext(ListContext);

  const deleteItem = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    console.log('index', index, newList);
    handleList(newList);
  };

  return (
    <ul>
      {list.map((value, index) => (
        <li key={index}>
          <span style={{ marginRight: '5px' }}>{value}</span>
          <button
            onClick={() => {
              deleteItem(index);
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
