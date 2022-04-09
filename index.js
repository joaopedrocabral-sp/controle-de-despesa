// Essas variáveis estão armazenando elementos do DOM que serão necessários manipular para a aplicação funcionar
const transactionsUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")
const transactionType = document.querySelector("#transactionType")

const alertMessage = document.querySelector("#alert")

const localStorageTransactions = JSON.parse(localStorage
    .getItem("transactions")) 
let transactions = localStorage
    .getItem("transactions") !== null ? localStorageTransactions : []


const removeTransaction = ID => {
    transactions = transactions.filter(transaction => 
        transaction.id !== ID)
    init()
    updateLocalStorage()
}

const addTransactionIntoDOM = ({amount, name, id}) => {
    const operator = amount < 0 ? "-" : "+"
    const CSSClass = amount < 0 ? "minus" : "plus"
    const amountWithoutOperator = Math.abs(amount).toFixed(2)
    const amountNumber = parseFloat(amountWithoutOperator)
    const amountReal = amountNumber.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    const li = document.createElement("li")
    li.classList.add(CSSClass)
    li.innerHTML = `
        ${name} <span> ${operator} ${amountReal} </span>
        <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionsUl.prepend(li)
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncomes = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({amount}) => amount)

    const total = parseFloat(getTotal(transactionsAmounts)).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    const incomes = parseFloat(getIncomes(transactionsAmounts)).toLocaleString('pt-br', {minimumFractionDigits: 2}) 
    const expenses = parseFloat(getExpenses(transactionsAmounts)).toLocaleString('pt-br', {minimumFractionDigits: 2})
    
        balanceDisplay.textContent = `${total}`
        incomeDisplay.textContent = `${incomes}`
        expenseDisplay.textContent = `${expenses}`
}

const init = () => {
    transactionsUl.innerHTML = ""
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: parseFloat(transactionAmount) 
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ""
    inputTransactionAmount.value = ""
}

const handleFormSubmit = event => {
    event.preventDefault()
  
    const transactionTypeSelected = transactionType.options[transactionType.selectedIndex].value
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = transactionTypeSelected == "cashOut" ? -inputTransactionAmount.value.trim() : inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === "" || transactionAmount === ""
  
    if (isSomeInputEmpty) {
      const message = document.createElement("div");
      message.classList.add("message");
      message.innerText = "Por favor, escreva tanto o valor quanto o nome da transação!";
      alertMessage.appendChild(message)

      setTimeout(() =>{
        message.style.display = "none"
    }, 3000);
      return;
    }

    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
}
  
form.addEventListener("submit", handleFormSubmit)