import React, { useState, useEffect, useContext, Component } from "react";
import SignOutButton from "./SignOut";
import "../App.css";
import axios from "axios";
import ChangePassword from "./ChangePassword";
import { AuthContext } from "../firebase/Auth";
import Button from "react-bootstrap/Button";
import Navigation from "./Navigation";
import logo from "../images/icon.png";

function Account() {
  const { currentUser } = useContext(AuthContext);
  const [userHeight, setUserHeight] = useState(undefined);
  const [userWeight, setUserWeight] = useState(undefined);
  const [userTarget, setUserTarget] = useState(undefined);    //Changes for target
  const [userAge, setUserAge] = useState(undefined);    //Changes for age

  const [userName, setUserName] = useState(undefined);
  const [pageState, setPageState] = useState(false);

  const [Butstate, setButState] = useState(false);

  useEffect(() => {
    console.log("render");
    async function fetchData() {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/" + String(currentUser.email)
        );

        setUserHeight(data.height);
        setUserWeight(data.weight);
        setUserName(data.displayName);
        setUserTarget(data.targetToBeAchieved);     //Changes for target
        setUserAge(data.age);                       //Changes for age

        // console.log(userData);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [
    currentUser.email,
    userHeight,
    userWeight,
    userName,
    userTarget,
    pageState,
    userAge
  ]);           //Changes for target and age

  async function handleClickButState(e) {
    e.preventDefault();

    setButState(true);
    if (Butstate === true) {
      setButState(false);
    }
  }

  const addInforamtion = async (event) => {
    event.preventDefault();
    let information = {};
    let { weight, height, target, age } = event.target.elements;     //Changes for target and age
    if (currentUser.displayName == null) {
      information = {
        userID: currentUser.email,
        displayName: "k",
        weightData: weight.value,
        heightData: height.value,
        targetData: target.value,                                      //Changes for target
        ageData: age.value,                                             //Changes for age
      };
    }
    //deep is commenting
    else {
      information = {
        userID: currentUser.email,
        displayName: currentUser.displayName,
        weightData: weight.value,
        heightData: height.value,
        targetData: target.value,                                     //Changes for target
        ageData: age.value,                                             //Changes for age
      };
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/user/addInforamtion",
        information
      );

      alert("Value Updated!");
      setPageState(true);
      if (pageState == true) {
        setPageState(false);
      }
      this.forceUpdate();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      {userWeight === 0 ? (
        <header className="App-header">
          <a href="/">
            <img src={logo} className="App-logo" alt="logo" />
          </a>
          <p>to a healthy life</p>
        </header>
      ) : (
        <header className="App-header">
          <a href="/">
            <img src={logo} className="App-logo" alt="logo" />
          </a>
          <p>to a healthy life</p>
          <Navigation />
        </header>
      )}

      <h2>Account Page</h2>
      <form onSubmit={addInforamtion}>
        <div className="form-group">
          <label>Email : </label>
          <label> {currentUser.email}</label>
        </div>
        <div className="form-group">
          <label>Name : </label>
          <label> {userName}</label>
        </div>
        <div className="form-group">
          <label>
            Your Height (In cm):
            <input
              min="1"
              className="form-control"
              id="height"
              required
              name="height"
              type="number"
              placeholder={userHeight}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Your Weight (In Kg):
            <input
              min="1"
              className="form-control"
              id="weight"
              required
              name="weight"
              type="number"
              placeholder={userWeight}
            />
          </label>
        </div>

        {/**Changes made by Sejal */}
        <div className="form-group">
          <label>
            Age :
            <input
              className="form-control"
              id="age"
              required
              name="age"
              type="number"
              placeholder={userAge}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Your Target Calories per day :
            <input
              min="1"
              className="form-control"
              id="target"
              name="target"
              type="number"
              placeholder={userTarget}
            />
          </label>
          <br/>
          Not sure of calories? Leave it blank for now!
        </div>
        {/**-------------------------- */}
        <button id="submitButton" name="submitButton" type="submit">
          Add Information
        </button>
      </form>
      <Button
        variant="primary"
        style={{ marginBottom: "15px", marginTop: "15px" }}
        onClick={handleClickButState}
      >
        Update Password
      </Button>
      {Butstate === true ? (
        <div>
          <ChangePassword />
        </div>
      ) : (
        <p></p>
      )}
      <p>
        For security reasons (at the time) you need to add Height, Weight and
        Age everytime to change a single value
      </p>
      {/* <SignOutButton /> */}
    </div>
  );
}

export default Account;
