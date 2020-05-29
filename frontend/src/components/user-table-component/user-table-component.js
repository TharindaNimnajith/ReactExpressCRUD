import React, {Component} from 'react'
import Table from 'react-bootstrap/Table'
import './user-table-styles.sass'

class UserList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      phoneNo: '',
      email: '',
      nic: ''
    }
  }

  render() {
    return (
      <div>
        <Table responsive striped bordered hover variant='dark'>
          <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone No</th>
            <th>Email</th>
            <th>NIC</th>
            <th/>
            <th/>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>1</td>
            <td>Harry</td>
            <td>Potter</td>
            <td>0123654789</td>
            <td>harry@gmail.com</td>
            <td>123456789V</td>
            <td>Edit</td>
            <td>Delete</td>
          </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}

export default UserList
