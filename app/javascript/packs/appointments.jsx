import React from 'react'
import ReactDOM from 'react-dom'
import AppointmentForm from './appointment_form'
import { AppointmentsList } from './appointments_list'
import update from 'immutability-helper'

export default class Appointments extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      appointments: this.props.appointments,
      title: 'Team standup meeting',
      apt_time: 'Tomorrow at 9am'
    }
  }

  handleUserInput (obj) {
    this.setState(obj);
  }

  handleFormSubmit () {
    const appointment = { title: this.state.title, apt_time: this.state.apt_time }
    $.post('/appointments',
            { appointment: appointment }).
            done((data) => {
              this.addNewAppointment(data);
            });
  }

  addNewAppointment (appointment) {
    const appointments = update(this.state.appointments, { $push: [appointment] });
    this.setState({ appointments: appointments.sort(function(a, b) {
        return new Date(a.apt_time) - new Date(b.apt_time);
      })
    });
  }

  render () {
    return (
      <div>
        <AppointmentForm title={this.state.title}
          apt_time={this.state.apt_time}
          onUserInput={(obj) => this.handleUserInput(obj)}
          onFormSubmit={() => this.handleFormSubmit()} />
        <AppointmentsList appointments={this.state.appointments} />
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('appointments_data')
  const data = JSON.parse(node.getAttribute('data'))

  ReactDOM.render(
    <Appointments appointments={data} />,
    document.body.appendChild(document.createElement('div')),
  )
})