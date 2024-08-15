import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Import Firestore instance
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"; // Import Firestore functions
import "./Coffeebean.css";
import headerLogo from '../assets/headerLogo.png'

const CoffeeBean = () => {
  const [beans, setBeans] = useState([]);
  const [name, setName] = useState("");
  const [roastery, setRoastery] = useState("");
  const [grams, setGrams] = useState("");
  const [grinderSetting, setGrinderSetting] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null); // Track which bean is being edited
  const [editValues, setEditValues] = useState({}); // Track edit values
  const [decrementAmounts, setDecrementAmounts] = useState({}); // Track decrement amounts for each bean

  useEffect(() => {
    const fetchBeans = async () => {
      setLoading(true);
      setError(null);
      try {
        const beansCollection = collection(db, "coffeeBeans"); // Ensure correct Firestore instance is used
        const beansSnapshot = await getDocs(beansCollection);
        setBeans(
          beansSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
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
    if (!name || !roastery || !grams || !grinderSetting || !notes) {
      setError("Please fill in all fields");
      return;
    }

    const newBean = {
      name,
      roastery,
      grams: parseInt(grams),
      grinderSetting,
      notes,
    };

    setLoading(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, "coffeeBeans"), newBean); // Ensure correct Firestore instance is used
      setBeans((prevBeans) => [...prevBeans, { id: docRef.id, ...newBean }]);

      setName("");
      setRoastery("");
      setGrams("");
      setGrinderSetting("");
      setNotes("");
    } catch (error) {
      console.error("Error adding bean: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditValues({ ...editValues, [field]: value });
  };

  const saveEdit = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const beanDoc = doc(db, "coffeeBeans", id); // Ensure correct Firestore instance is used
      await updateDoc(beanDoc, editValues);
      setBeans((prevBeans) =>
        prevBeans.map((bean) =>
          bean.id === id ? { ...bean, ...editValues } : bean
        )
      );
      setEditMode(null);
      setEditValues({});
    } catch (error) {
      console.error("Error updating bean: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBean = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const beanDoc = doc(db, "coffeeBeans", id); // Ensure correct Firestore instance is used
      await deleteDoc(beanDoc);
      setBeans((prevBeans) => prevBeans.filter((bean) => bean.id !== id));
    } catch (error) {
      console.error("Error deleting bean: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrementChange = (id, value) => {
    setDecrementAmounts({ ...decrementAmounts, [id]: value });
  };

  const decrementGrams = async (id, currentGrams) => {
    const decrementAmount = parseInt(decrementAmounts[id]);

    if (
      !decrementAmount ||
      decrementAmount <= 0 ||
      decrementAmount > currentGrams
    ) {
      alert("Invalid decrement amount");
      return;
    }

    const newGrams = currentGrams - decrementAmount;

    setLoading(true);
    setError(null);

    try {
      const beanDoc = doc(db, "coffeeBeans", id); // Ensure correct Firestore instance is used
      await updateDoc(beanDoc, { grams: newGrams });
      setBeans((prevBeans) =>
        prevBeans.map((bean) =>
          bean.id === id ? { ...bean, grams: newGrams } : bean
        )
      );
      setDecrementAmounts({ ...decrementAmounts, [id]: "" }); // Reset input field after decrement
    } catch (error) {
      console.error("Error updating grams: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <img src={headerLogo} alt="BeanVault" className="header-image"/>
      <div className="add-bean">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Roastery"
          value={roastery}
          onChange={(e) => setRoastery(e.target.value)}
        />
        <input
          type="number"
          placeholder="Grams"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
        />
        <input
          type="text"
          placeholder="Grinder Setting"
          value={grinderSetting}
          onChange={(e) => setGrinderSetting(e.target.value)}
        />
        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button className="add-bean-button" onClick={addBean}>
          Add Bean
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="bean-list">
        {beans.map((bean, index) => (
          <div key={index} className="card">
            {editMode === bean.id ? (
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={editValues.name || bean.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Roastery"
                  value={editValues.roastery || bean.roastery}
                  onChange={(e) => handleEditChange("roastery", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Grams"
                  value={editValues.grams || bean.grams}
                  onChange={(e) => handleEditChange("grams", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Grinder Setting"
                  value={editValues.grinderSetting || bean.grinderSetting}
                  onChange={(e) =>
                    handleEditChange("grinderSetting", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Notes"
                  value={editValues.notes || bean.notes}
                  onChange={(e) => handleEditChange("notes", e.target.value)}
                />
                <div className="card-actions">
                  <button onClick={() => saveEdit(bean.id)}>Save</button>
                  <button onClick={() => setEditMode(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h3>{bean.name}</h3>
                <p>
                  <strong>Roastery:</strong> {bean.roastery}
                </p>
                <p>
                  <strong>Grams Left:</strong> {bean.grams}g
                </p>
                <p>
                  <strong>Grinder Setting:</strong> {bean.grinderSetting}
                </p>
                <p>
                  <strong>Notes:</strong> {bean.notes}
                </p>
                <div className="card-actions">
                  <input
                    type="number"
                    className="decrement-input"
                    placeholder="Enter amount of coffee consumed (g)"
                    value={decrementAmounts[bean.id] || ""}
                    onChange={(e) =>
                      handleDecrementChange(bean.id, e.target.value)
                    }
                  />
                  <button onClick={() => decrementGrams(bean.id, bean.grams)}>
                    Use
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(bean.id);
                      setEditValues({
                        name: bean.name,
                        roastery: bean.roastery,
                        grams: bean.grams,
                        grinderSetting: bean.grinderSetting,
                        notes: bean.notes,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteBean(bean.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoffeeBean;
