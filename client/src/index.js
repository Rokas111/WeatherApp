import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "./pages/MainPage.js";
import LoginPage from "./pages/LoginPage.js";
import SignupPage from "./pages/SignupPage.js";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Routes>
          <Route replace path="/signup"element={(<SignupPage />)} />
          <Route replace path="/login" element={(<LoginPage />)}/>
          <Route replace path="*" element={<MainPage />}/>
        </Routes>
    </BrowserRouter>
);
