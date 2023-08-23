//INITIALIZING VARIABLES
const mainContainer = document.querySelector('.main-list-container');
const itemToBeAdded = document.querySelector('[data-item]');
const addItemToList = document.querySelector('[data-add-item]');
const deleteItem = document.querySelectorAll('[data-delete-row]');
const updateItem = document.querySelectorAll('[data-update-row]');
const updateItemSuccessfull = document.querySelector('[data-update-success]');
const cancelUpdate = document.querySelector('[data-cancel-update]');


const itemArrayList = [];
let toBeUpdatedContainer;

//FUNCTIONS
function cancelMyUpdate () {
    toBeUpdatedContainer = null;
    let updateWindow = document.querySelector('.update-container');
    updateWindow.style.display = 'none';
}

function passUpdatedData (content) {
    let containerValue = toBeUpdatedContainer.querySelector('[data-item-transferred]');
    let priorIndexBeforeChange = itemArrayList.indexOf(containerValue.innerText);

    itemArrayList.map(item => {
        if(containerValue.innerText === item) {
            itemArrayList[priorIndexBeforeChange] = content;
            containerValue.innerText = content;
        }
    })

    let updateWindow = document.querySelector('.update-container');
    updateWindow.style.display = 'none';

    saveData()
}

function finishUpdate (e) {
    let updateButton = e.target;
    let updateContainer = updateButton.parentElement.parentElement;
    let updatedContent = updateContainer.querySelector('[data-item-received]').value;

    passUpdatedData(updatedContent);


}

function setWindowUpdate () {
    let container = this.parentElement.parentElement;
    let containerContent = container.querySelector('[data-item-transferred]').innerText;

    let updateWindow = document.querySelector('.update-container');
    updateWindow.style.display = 'flex';
    let toBeEdittedText = updateWindow.querySelector('[data-item-received]');
    toBeEdittedText.value = containerContent;

    toBeUpdatedContainer = this.parentElement.parentElement;
}

function deleteRow() {
    let container = this.parentElement.parentElement;
    let itemInside = container.querySelector('[data-item-transferred]').innerText;
    itemArrayList.map((item) => {
        if(itemInside === item) {
            let newIndex = itemArrayList.indexOf(item)
            itemArrayList.splice(newIndex, 1)
        }
    })
    container.remove();

    saveData()
}

function updateDisplayList (arrayList) {
    let divContainer = document.querySelector('.main-list-container');

    let newListContainer = document.createElement('div');
    newListContainer.classList.add('list-container');
    newListContainer.classList.add('container');

    let newItemFromArray;
    for(let i = 0; i < arrayList.length; i++) {
        newItemFromArray = arrayList[i];
    }
    let newListContainerContent = `
        <span class="list-text" data-item-transferred>${newItemFromArray}</span>
        <span class="edit-item">
            <button class="button update-button" data-update-row>UPDATE</button>
            <button class="button delete-button" data-delete-row>DELETE</button>
        </span>`
    newListContainer.innerHTML = newListContainerContent;
    
    divContainer.append(newListContainer)
    newListContainer.querySelector('[data-delete-row]').addEventListener('click', deleteRow)
    newListContainer.querySelector('[data-update-row]').addEventListener('click', setWindowUpdate)

    saveData()
}

function getInformation () {
    let item = itemToBeAdded.value;
    if(item === null || item === '') return
    itemArrayList.push(item);

    itemToBeAdded.value = '';
    updateDisplayList(itemArrayList);

}

//EVENTLISTENERS
addItemToList.addEventListener('click', getInformation)
itemToBeAdded.addEventListener('keypress', (event) => {
    if(event.key === "Enter") {
        event.preventDefault();
        addItemToList.click();
    }
})


deleteItem.forEach(button => {
    button.addEventListener('click', deleteRow)
})

updateItem.forEach(button =>  {
    button.addEventListener('click', setWindowUpdate)
})

updateItemSuccessfull.addEventListener('click', finishUpdate)

cancelUpdate.addEventListener('click', cancelMyUpdate)

//SAVE DATA TO LOCAL STORAGE
function saveData () {
    localStorage.setItem('data', mainContainer.innerHTML);
    localStorage.setItem('arrayList', itemArrayList);
}

// FUNCTION FOR GETTING THE STORED DATA AND ARRAY AFTER THE REFRESH, COPY AND SPLIT THE ARRAY IN ORDER TO SAVE THE DATA AND IF THE ARRAY HAS NOW NO ITEM, PUSH THE SAVED ARRAYLIST TO SAVE IT
function showData () {
    mainContainer.innerHTML = localStorage.getItem('data');
    let listContainer = document.querySelectorAll('.list-container');
    listContainer.forEach(container => {
        container.querySelector('[data-update-row]').addEventListener('click', setWindowUpdate);
        container.querySelector('[data-delete-row]').addEventListener('click', deleteRow)
    })
    let arrayCopy = localStorage.getItem('arrayList');
    let newArray = arrayCopy.split(',');
    console.log(newArray)
    if(itemArrayList.length === 0) {
        itemArrayList.push(...newArray);
    }
}

//AFTER REFRESHING RUN THIS FUNCTION
window.addEventListener('load', () => {
    if(!mainContainer.hasChildNodes()) return
    showData();
})

// showData()



