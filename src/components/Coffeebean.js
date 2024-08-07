import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { withTimeout } from '../utils/timeout';
import './Coffeebean.css';

const CoffeeBean = () => {
  const [beans, setBeans] = useState([]);
  const [name, setName] = useState('');
  const [grams, setGrams] = useState('');
  const [grinderSetting, setGrinderSetting] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeans = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching beans...');
        const beansCollection = collection(db, 'coffeeBeans');
        const beansSnapshot = await withTimeout(getDocs(beansCollection), 30000); // 30 seconds timeout
        console.log('Beans fetched:', beansSnapshot.docs);
        setBeans(beansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching beans: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBeans();
  }, []);

  const addBean = async () => {
    const newBean = {
      name,
      grams: parseInt(grams),
      grinderSetting,
      notes
    };

    setLoading(true);
    setError(null);

    try {
      console.log('Adding new bean...');
      await withTimeout(addDoc(collection(db, 'coffeeBeans'), newBean), 20000); // 20 seconds timeout
      console.log('Bean added');

      setBeans(prevBeans => [...prevBeans, newBean]);

      setName('');
      setGrams('');
      setGrinderSetting('');
      setNotes('');
    } catch (error) {
      console.error("Error adding bean: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
    }
  };

  return (
    <div className="container">
      <h1>Coffee Beans Inventory</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Grams"
        value={grams}
        onChange={e => setGrams(e.target.value)}
      />
      <input
        type="text"
        placeholder="Grinder Setting"
        value={grinderSetting}
        onChange={e => setGrinderSetting(e.target.value)}
      />
      <input
        type="text"
        placeholder="Notes"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
      <button onClick={addBean}>Add Bean</button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {beans.map((bean, index) => (
          <li key={index}>
            <strong>{bean.name}</strong> - {bean.grams}g - {bean.grinderSetting} - {bean.notes}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoffeeBean;
