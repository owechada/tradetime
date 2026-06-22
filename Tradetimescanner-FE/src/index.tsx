import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const renderApp = () => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <GoogleOAuthProvider clientId="769518639578-de82e80rq259ie0sluku1choshhiu5r3.apps.googleusercontent.com">

          <App />
        </GoogleOAuthProvider>

      </Provider>
    </React.StrictMode>
  );
};

renderApp();

store.subscribe(() => {
  renderApp();

  console.log(store.getState());
});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

