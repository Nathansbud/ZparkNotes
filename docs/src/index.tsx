import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Helmet from 'react-helmet'

ReactDOM.render(
    <>
        <Helmet>
            <title>ZparkNotes</title>
        </Helmet>
        <App />
    </>,
    document.getElementById('root')
)

