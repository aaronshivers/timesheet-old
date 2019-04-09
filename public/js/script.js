// Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('/sw.js')
    .then(() => console.log(`Service Worker Registered!`))
    .catch(err => console.log(err.message))
}

// Job Class: Represents a Job
class Job {
  constructor(customer, description, date, timeIn, timeOut, id) {
    this.customer = customer
    this.description = description
    this.date = date
    this.timeIn = `2019-01-01T${ timeIn }`
    this.timeOut = `2019-01-01T${ timeOut }`
    this.id = id
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayJobs() {
    const jobs = Store.getJobs()

    jobs.forEach((job) => {
      UI.addJobToList(job)
    })
  }

  static addJobToList(job) {
    const list = document.getElementById('job-list')
    const row = document.createElement('tr')
    const data = document.createElement('td')
    const formattedDate = moment(job.date).format('MMM Do')
    const formattedTimeIn = moment(job.timeIn).format('h:mm a')
    const formattedTimeOut = moment(job.timeOut).format('h:mm a')

    // Setup the Delete Job Button
    const button = document.createElement('button')
    button.textContent = 'x'
    button.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right', 'delete')

    row.innerHTML = `
      <td>${job.customer}</td>
      <td>${job.description}</td>
      <td class="text-center">${formattedDate}</td>
      <td class="text-center">${formattedTimeIn}</td>
      <td class="text-center">${formattedTimeOut}</td>
    `

    data.appendChild(button)
    row.appendChild(data)
    list.appendChild(row)
  }

  static deleteJob(element) {
    if (element.classList.contains('delete')) {
      element.parentElement.parentElement.remove()
    }
  }

  static showAlert(message, className) {

    if (!document.getElementsByClassName('alert')[0]) {

      const div = document.createElement('div')
      div.className = `alert alert-${className} alert-dismissable fade show`
      div.setAttribute('role', 'alert')
      div.appendChild(document.createTextNode(message))

      const container = document.getElementsByClassName('container')[0]
      const form = document.getElementById('job-form')
      container.insertBefore(div, form)

      setTimeout(() => {
        document.getElementsByClassName('alert')[0].remove()
      }, 3000)
    }
  }

  static clearFields() {
    document.getElementById('customer').value = ''
    document.getElementById('description').value = ''
    document.getElementById('date').value = moment().format('YYYY-MM-DD')
    document.getElementById('timeIn').value = moment().format('HH:mm')
    document.getElementById('timeOut').value = moment().format('HH:mm')
  }
}

// Set Default Field Values on Page Load
UI.clearFields()

// Store Class: Handle Storage
class Store {

  static getJobs() {
    let jobs
    const jobsJSON = localStorage.getItem('jobs')
    return jobsJSON ? jobs = JSON.parse(jobsJSON) : jobs = []
  }

  static addJob(job) {
    const jobs = Store.getJobs()
    jobs.push(job)
    localStorage.setItem('jobs', JSON.stringify(jobs))
  }

  static removeJob(description) {
    const jobs = Store.getJobs()

    jobs.forEach((job, index) => {
      if (job.description === description) {
        jobs.splice(index, 1)
      }
    })

    localStorage.setItem('jobs', JSON.stringify(jobs))
  }
}

// Event: Display Jobs
document.addEventListener('DOMContentLoaded', UI.displayJobs)

// Event: Add a Job
document.getElementById('job-form').addEventListener('submit', (event) => {

  // Prevent submit button from actually submitting
  event.preventDefault()

  // Get form values
  const customer = document.getElementById('customer').value
  const description = document.getElementById('description').value
  const date = document.getElementById('date').value
  const timeIn = document.getElementById('timeIn').value
  const timeOut = document.getElementById('timeOut').value

  // Validate
  if (!customer || !description) {
    UI.showAlert('Please complete all fields.', 'danger')
  } else {
    // Instantiate job
    const job = new Job(customer, description, date, timeIn, timeOut, id = uuidv4())

    // Add Job to UI
    UI.addJobToList(job)

    // Add Job to Store
    Store.addJob(job)

    // Show success message
    UI.showAlert('Job Added', 'success')

    // Clear Fields
    UI.clearFields()
  }
})

// Event: Remove a Job
document.getElementById('job-list').addEventListener('click', (event) => {
  UI.deleteJob(event.target)

  // Remove Job from UI
  UI.deleteJob(event.target)

  // RemoveJob from Store
  Store.removeJob(event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent)

  // Show success message
  UI.showAlert('Job Removed', 'success')
})
