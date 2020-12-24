console.log('Hello World from your main file!');
/** @jsx h */
import { h, Component, render, Fragment, createContext, hydrate, toChildArray } from "preact";
import { useRef, useReducer, useMemo, useLayoutEffect, useImperativeHandle, useErrorBoundary, useDebugValue, useContext, useEffect, useCallback, useState } from 'preact/hooks';
import React from "preact/compat";
import Helmet from "preact-helmet";
import { Router } from "preact-router";
import { Link } from 'preact-router/match';
import AsyncRoute from 'preact-async-route';


//import "./styles.css";

import "milligram";

const NODE = document.body.querySelector("#root");


const Home = () => (
  <Fragment>
    <Helmet
      title="Changing My Title Hay James Yet Another Page"
      meta={[
        { name: "description", content: "Helmet application" },
        { property: "og:type", content: "article" }
      ]}
    />
    <h1>hello world</h1>
    <img srcSet={require("./images/portrait-photography-old-man.jpg?{sizes:[50,100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400], format: 'webp'}").srcSet}  alt="" />
  </Fragment>
);


const App = () => (
  <div id="root">
    <Helmet
      title="My Title"
      titleTemplate="%s | MyAwesomeWebsite.com"
    />
    <Home />
  </div>
);

render(<App />, document.body, NODE);
