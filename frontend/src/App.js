import React from 'react'
import './App.css'
import AddUser from './components/user-form-component/user-form-component'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div>
      <Router>
        <Route path='/addUser' exact component={AddUser}/>
      </Router>
    </div>
  )
}

export default App
