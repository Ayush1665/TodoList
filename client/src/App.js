import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [theme, setTheme] = useState('light-theme');

  // Toggle between dark and light theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light-theme' ? 'dark-theme' : 'light-theme');
  };

  // Add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5500/api/item', { item: itemText });
      setListItems(prev => [...prev, res.data]);
      setItemText('');
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch all todo items from database
  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/items');
        setListItems(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getItemsList();
  }, []);

  // Delete item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5500/api/item/${id}`);
      const newListItems = listItems.filter(item => item._id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  };

  // Update item
  const updateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5500/api/item/${isUpdating}`, { item: updateItemText });
      const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating);
      listItems[updatedItemIndex].item = updateItemText;
      setUpdateItemText('');
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  };

  // Render update form
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={updateItem}>
      <input
        className="update-new-input"
        type="text"
        placeholder="New Item"
        onChange={e => setUpdateItemText(e.target.value)}
        value={updateItemText}
      />
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  );

  return (
    <div className={`App ${theme}`}>
      <button onClick={toggleTheme} className="theme-toggle-btn">
        {theme === 'light-theme' ? (
          <i className="fas fa-moon"></i> // Moon icon for light theme
        ) : (
          <i className="fas fa-sun"></i> // Sun icon for dark theme
        )}
      </button>
      <h1>Todo List</h1>
      <form className="form" onSubmit={addItem}>
        <input
          type="text"
          placeholder="Add Todo Item"
          onChange={e => setItemText(e.target.value)}
          value={itemText}
        />
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
        {listItems.map(item => (
          <div className="todo-item" key={item._id}>
            {isUpdating === item._id ? (
              renderUpdateForm()
            ) : (
              <>
                <p className="item-content">{item.item}</p>
                <button className="update-item" onClick={() => setIsUpdating(item._id)}>Update</button>
                <button className="delete-item" onClick={() => deleteItem(item._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
