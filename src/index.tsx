import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { map, delay, switchMap, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { composeWithDevTools } from "redux-devtools-extension";
import App from "./App";
import { of } from "rxjs";
import { ofType, createEpicMiddleware } from "redux-observable";

/*
Author: Marcin Romanowicz
URL: http://konkretny.pl/
License: MIT
Version: 1.0.0
*/

//reducer
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, counter: state.counter + 1 };
    case "ASSYNC_ACTION":
      return { ...state, title: action.payload };
    case "DECREMENT":
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};

//epic assync action
const epic = (action$: any) =>
  action$.pipe(
    ofType("INCREMENT"),
    delay(1000),
    switchMap(() => {
      return ajax.getJSON("https://jsonplaceholder.typicode.com/todos/1").pipe(
        map((response: any) => {
          return { type: "ASSYNC_ACTION", payload: response.title };
        }),
        catchError((error: any) => {
          console.log("error: ", error);
          return of(error);
        })
      );
    })
  );

//initial global state
const initialState = {
  counter: 0,
  title: "I haven't got any title yet from REST API"
};

//epic connect
const epicMiddleware = createEpicMiddleware();

//create global store
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(compose(applyMiddleware(epicMiddleware)))
);

//epic enable
epicMiddleware.run(epic);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
