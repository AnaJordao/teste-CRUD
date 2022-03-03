document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']))
    
})

document.querySelector('table tbody').addEventListener('click', function (event){
    
    if(event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.id)
    }
    if(event.target.className === "edit-row-btn"){
        handleEditRow(event.target.dataset.id)
    }
})

const updateBtn = document.querySelector('#update-row-btn')
const searchBtn = document.querySelector('#search-btn')

searchBtn.onclick = function (){
    const searchValue = document.querySelector('#search-input').value

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']))
}

function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload()
        }
    })
}

function handleEditRow(id){
    const updateSection = document.querySelector('#update-row')
    updateSection.hidden = false
    document.querySelector('#update-name-input').dataset.id = id
}

updateBtn.onclick = function(){
    const updateNameInput = document.querySelector('#update-name-input')

    console.log(updateNameInput.dataset.id);
    console.log(updateNameInput.value);

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers:{
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            ID: updateNameInput.dataset.id,
            Name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload()
        }
    })
}

const addBtn = document.querySelector('#add-btn')
addBtn.onclick = function(){
    const nameInput = document.querySelector('#name-input')
    const countryInput = document.querySelector('#country-input')
    const districtInput = document.querySelector('#district-input')
    const populationInput = document.querySelector('#population-input')

    const name = nameInput.value
    const country = countryInput.value
    const district = districtInput.value
    const population = populationInput.value

    nameInput.value = ""
    countryInput.value = ""
    districtInput.value = ""
    populationInput.value = ""

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name : name,  countryCode : country, district : district, population : population})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']))
}

function insertRowIntoTable(data){
    console.log(data)
    const table = document.querySelector('table tbody')
    const isTableData = table.querySelector('.no-data')

    let tableHtml = "<tr>"

    for (var key in data){
        if(data.hasOwnProperty(key)){
            tableHtml += `<td>${data[key]}</td>`
        }
    }
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.ID}>Delete</button></td>`
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.ID}>Edit</button></td>`

    tableHtml += "</tr>"

    if(isTableData){
        table.innerHTML = tableHtml
    } else{
        const newRow = table.insertRow()
        newRow.innerHTML = tableHtml
    }
}

function loadHTMLTable(data){
    const table = document.querySelector('table tbody')

    //console.log(data) 

    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='7'>No Data</td></tr>"
        return
    }
    
    let tableHtml = ""

    data.forEach(function({ID, Name, CountryCode, District, Population}) {
        tableHtml += "<tr>"
        tableHtml += `<td>${ID}</td>`
        tableHtml += `<td>${Name}</td>`
        tableHtml += `<td>${CountryCode}</td>`
        tableHtml += `<td>${District}</td>`
        tableHtml += `<td>${Population}</td>`
        tableHtml += `<td><button class="delete-row-btn" data-id=${ID}>Delete</button></td>`
        tableHtml += `<td><button class="edit-row-btn" data-id=${ID}>Edit</button></td>`
        tableHtml += "</tr>"
    });

    table.innerHTML = tableHtml
}