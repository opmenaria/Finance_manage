import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from 'axios';

const element_style = {
  fontSize: "2.5rem",
  textAlign: "center",
};

function Income() {
  const [tableData, setTableData] = useState([]);
  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    type: "",
    date: "",
    category: "",
    description: "",
  });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/transactions/get-incomes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setTableData(response.data);
        console.log('Data retrieved successfully');
      } else {
        console.log('Failed to retrieve data');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleOnUpdate = async (id) => {
    console.log(id);
    try {
      const response = await axios.put(`http://localhost:5000/transactions/update-income/${id}`,
        {
          title: inputState.title,
          amount: inputState.amount,
          type: inputState.type,
          date: inputState.date,
          category: inputState.category,
          description: inputState.description
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        console.log("Data updated successfully");
        fetchData(); // Refresh the data after update
        setInputState({ title: "", amount: "", type: "", date: "", category: "", description: "", })
      } else {
        console.log("Failed to update data");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleOnDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/transactions/delete-income/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        console.log("Data deleted successfully");
        fetchData();
      } else {
        console.log("Failed to delete data");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleOnChange = (event) => {
    setInputState({ ...inputState, [event.target.name]: event.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          'http://localhost:5000/transactions/add-income',
          inputState,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setTableData((prev) => [inputState, ...prev]);
          console.log('Income added successfully');
          fetchData()
          setInputState({ title: "", amount: "", type: "", date: "", category: "", description: "", })
        } else {
          console.log('Income addition failed');
        }
      } catch (err) {
        console.error('Error:', err);
      }
      setInputState({
        title: "",
        amount: "",
        type: "",
        date: "",
        category: "",
        description: "",
      });
    } else {
      setShowAlert(true);
    }
  };


  const validateForm = () => {
    const { title, amount, type, category, description } = inputState;
    if (
      title.trim() === "" ||
      amount.trim() === "" ||
      type.trim() === "" ||
      category.trim() === "" ||
      description.trim() === ""
    ) {
      setShowAlert(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    let timeoutld;
    if (showAlert) {
      timeoutld = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutld);
    };
  }, [showAlert]);

  return (
    <div className="form h-full">
      {showAlert && (
        <AlertStyled>
          Please fill in all the fields before submitting!!
        </AlertStyled>
      )}
      <h1 className="mb-2 text-orange-400 shadow-lg  font-semibold" style={element_style}>
        Add Incomes
      </h1>
      <FormStyled className="shadow-lg rounded-lg" onSubmit={handleOnSubmit}
        style={{ backgroundColor: "#ffffff11" }}
      >
        <div className="form-group mx-auto">
          <label className=" text-white" htmlFor="title">Title</label>
          <input
            value={inputState.title}
            type="text"
            className="form-control w-96"
            name="title"
            id="title"
            placeholder="Title"
            onChange={handleOnChange}
          />
        </div>
        <div className="form-group mx-auto">
          <label className=" text-white" htmlFor="amount">Amount</label>
          <input
            value={inputState.amount}
            type="number"
            className="form-control w-96"
            name="amount"
            id="amount"
            placeholder="Amount"
            onChange={handleOnChange}
          />
        </div>
        <div className="form-group mx-auto">
          <label className=" text-white" htmlFor="amount">Type</label>
          <input
            value={inputState.type}
            type="text"
            className="form-control w-96"
            name="type"
            id="type"
            placeholder="Type"
            onChange={handleOnChange}
          />
        </div>
        <div className="form-group mx-auto">
          <label className=" text-white" htmlFor="date">Date</label>
          <input
            value={inputState.date}
            type="date"
            className="form-control w-96"
            name="date"
            id="date"
            placeholder="Date"
            onChange={handleOnChange}
          />
        </div>
        <div className="form-group mx-auto">
          <label className=" text-white" htmlFor="category">Category</label>
          <select
            value={inputState.category}
            className="form-control w-96"
            name="category"
            id="category"
            onChange={handleOnChange}
          >
            <option value="disabled">Select options</option>
            <option value="salary">Salary</option>
            <option value="freelancing">Freelancing</option>
            <option value="investment">Investment</option>
            <option value="bank">Bank</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group mx-auto">
          <label className=" text-white" htmlFor="textarea">Description</label>
          <textarea
            value={inputState.description}
            className="form-control w-96"
            name="description"
            id="description"
            rows="3"
            onChange={handleOnChange}
          ></textarea>
        </div>
        <button type="submit" className="mb-2 btn btn-primary border font-semibold text-lg mx-auto"> Submit
        </button>
      </FormStyled>
      <table className="table w-5/6 mx-auto  overflow-hidden  rounded-md shadow-xl">
        <thead className="thead-dark bg-gray-700 text-white">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Amount</th>
            <th scope="col">Date</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="bg-gray-400">
          {tableData.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.title}</td>
              <td>{user.amount}</td>
              <td>{new Date(user.date).toLocaleString()}</td>
              <td>{user.category}</td>
              <td>{user.description}</td>
              <td className="flex justify-between">
                <button className="btn btn-warning w-20 font-semibold" onClick={() => handleOnUpdate(user._id)}>Edit</button>
                <button className="btn btn-danger w-20 font-semibold" onClick={() => handleOnDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}
const FormStyled = styled.form`
              display: flex;
              flex-direction: column;
              max-width: 400px;
              margin: 0 auto;
              margin-bottom: 15px;
              .form-group {
                margin-bottom: 1rem;
              }
            
              .form-control {
                padding: 0.5rem 0.75rem;
                border: 1px solid #ced4da;
                border-radius: 0.25rem;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            
                &:focus {
                  outline: none;
                  border-color: #80bdff;
                  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }
              }
              .selects {
                display: flex;
                justify-content: flex-end;
                select {
                  color: rgba(34, 34, 96, 0.4);
                  &:focus,
                  &:active {
                    color: rgba(34, 34, 96, 1);
                  }
                }
              }
              .btn-primary {
                background-color: #007bff;
                border-color: #007bff;
                border-radius: 12px;
                margin-bottom: 4px;
                width: 20vh;
                &:hover {
                  background-color: #0069d9;
                  border-color: #0062cc;
                }
              }
            `;
const AlertStyled = styled.div`
              background-color: #f8d7da;
              color: #721c24;
              padding: 10px;
              margin-bottom: 10px;
              border: 1px solid #f5c6cb;
              border-radius: 4px;
            `;
export default Income;



