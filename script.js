import data from './titanic-data.js'

const portColor = { S: '#99708C', 
                    C: '#6A70B4', 
                    Q: '#628DA7',
                    undefined: '#605856',
                    total: '#594157'}


// Init Default Sort
function defaultSort() {
  data.sort((a,b) => {
    return a.fields.passengerid - b.fields.passengerid
  })
}
defaultSort()


// ---------------------- Passenger Grid ----------------------

// Get a reference to the #titanic
const titanic = document.querySelector('#titanic')


// Map over the data and make a new element for each passenger
const passengers = data.map(p => {
  const el = document.createElement('div')
  titanic.appendChild(el)
  return el
})


// Let's loop over each passenger and set some styles 
function renderPassengers() {
  passengers.forEach((p, i) => {
    p.classList.add('passenger')
    p.dataset.id = i
  
    const { sex, survived, embarked } = data[i].fields
  
    p.style.width = '20px'
    p.style.height = '20px'
    p.style.opacity = survived === 'Yes' ? '100%' : '50%' 
    p.style.backgroundColor = '#000'
    p.style.border = '1px solid black'
    p.style.borderRadius = sex === 'female' ? '50%' : 0
    p.style.backgroundColor = portColor[embarked]
  })
}

renderPassengers()


// ---------------------- Passenger Details ----------------------

const passengerDetails = document.querySelector('#passenger-details')

document.body.addEventListener('mouseover', (e) => {
  if (e.target.matches('.passenger')) {

    const id = e.target.dataset.id
    const fields = data[id].fields

    passengerDetails.style.display = 'block'
    passengerDetails.style.position = 'absolute'
    passengerDetails.style.left = `${e.pageX + 5}px`
    passengerDetails.style.top = `${e.pageY + 5}px`
    passengerDetails.style.backgroundColor = '#fff'
    passengerDetails.style.border = '1px solid'
    passengerDetails.style.padding = '0.5em'

    passengerDetails.innerHTML = `
    <strong>${fields.name}</strong>
    <ul>
      <li>Age: ${fields.age} </li>
      <li>Fare: $${fields.fare.toFixed(2)} </li>
      <li>id: ${fields.passengerid} </li>
      <li>Embarked From: ${fields.embarked} </li>
    </ul>
    `
  }
})

document.body.addEventListener('mouseout', (e) => {
  if (e.target.matches('.passenger')) {
    passengerDetails.style.display = 'none'
  }
})

// ---------------------- Sorting Buttons ----------------------

function sortEmbarked() {
  data.sort((a, b) => {
    const x = a.fields.embarked !== undefined ? a.fields.embarked.charCodeAt(0) : 0
    const y = b.fields.embarked !== undefined ? b.fields.embarked.charCodeAt(0) : 0
    return x - y
  })
}

function sortAge() {
  data.sort((a,b) => {
    if (a.fields.age === undefined && b.fields.age === undefined) {
      return 0
    } else if (a.fields.age === undefined) {
      return 1
    } else if (b.fields.age === undefined) {
      return -1
    }
    return a.fields.age - b.fields.age
  })
}

function sortFare() {
  data.sort((a,b) => {
    return a.fields.fare - b.fields.fare
  })
}

function sortSurvived() {
  data.sort((a, b) => {
    if (a.fields.survived === 'Yes') {
      return -1
    }
    return 1
  })
}

function sortGender() {
  data.sort((a, b) => {
    if (a.fields.sex === 'female') {
      return 1
    }
    return -1
  })
}


document.body.addEventListener('click', (e) => {
  if (e.target.matches('.sort-by-age')) {
    sortAge()
    renderPassengers()
  } else if (e.target.matches('.sort-by-fare')) {
    sortFare()
    renderPassengers()
  } else if (e.target.matches('.sort-by-embarked')) {
    sortEmbarked()
    renderPassengers()
  } else if (e.target.matches('.sort-by-survived')) {
    sortSurvived()
    renderPassengers()
  } else if (e.target.matches('.sort-by-gender')) {
    sortGender()
    renderPassengers()
  } else if (e.target.matches('.sort-clear')) {
    defaultSort()
    renderPassengers()
  }
})


// ---------------------- Embarked Graph ----------------------


const titanticEmbarked = document.querySelector('#titanic-embarked')

const embarkedCounts = data.reduce((acc, pass) => {
  if (acc[pass.fields.embarked] === undefined) {
    acc[pass.fields.embarked] = 1
  } else {
    acc[pass.fields.embarked] += 1
  }

  return acc
}, {})

embarkedCounts.total = data.length

const embarkedKeys = Object.keys(embarkedCounts)


embarkedKeys.forEach(e => {
  const el = document.createElement('div')
  titanticEmbarked.appendChild(el)
  el.style.width = '30px'

  const count = embarkedCounts[e]
  const percent = count / data.length * 100

  el.style.height = `${percent}%`
  el.style.backgroundColor = portColor[e]
  el.style.margin = '1px'
})
