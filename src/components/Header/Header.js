import React, {
  Component,
  useState,
  useEffect,
  createContext,
  useContext
} from "react";
import { Toolbar, Typography, AppBar, Button } from "@material-ui/core";

const Header = () => {
  const todoLogout = () => {
    let token = sessionStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders
    };
    fetch("http://127.0.0.1:8000/api/user/logout", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          window.location.reload();
          sessionStorage.clear();
          let temp = window.location.origin;
          window.location.href = temp + "/login";
        }
      })
      .catch(error => console.log("error", error));
  };

  let logoutDiv = null;
  let isLoggedIn = sessionStorage.getItem("isLoggedIn");
  console.log(isLoggedIn);
  if (isLoggedIn === "true") {
    logoutDiv = (
      <AppBar
        position="static"
        style={{ color: "#FFFFFF", backgroundColor: "#2076D2" }}
      >
        <Toolbar style={{ display: " flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Todo App</Typography>
          <Button onClick={todoLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    );
  }

  if (isLoggedIn === null) {
    logoutDiv = (
      <AppBar
        position="static"
        style={{ color: "#FFFFFF", backgroundColor: "#2076D2" }}
      >
        <Toolbar style={{ display: " flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Todo App</Typography>
        </Toolbar>
      </AppBar>
    );
  }
  return <div>{logoutDiv}</div>;
};

export default Header;
