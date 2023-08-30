let sortOrderAsc = true;
let transactionsData = []; // Stores the initially fetched data
dados();

function dados() {
    firebase.firestore()
        .collection('transactions')
        .orderBy('date', 'desc')
        .get()
        .then(snapshot => {
            transactionsData = snapshot.docs.map(doc => doc.data());
            addTransactionsToScreen(transactionsData); // Display initial data
        });
}

function ordNome() {
    clearTransactionList();

    const sortOrder = sortOrderAsc ? 'asc' : 'desc';

    const sortedTransactions = [...transactionsData];

    sortedTransactions.sort((a, b) => {
        return sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });

    addTransactionsToScreen(sortedTransactions);

    sortOrderAsc = !sortOrderAsc; // Toggle sorting order
}

function ordSetor() {
    clearTransactionList();

    const sortOrder = sortOrderAsc ? 'asc' : 'desc';

    firebase.firestore()
        .collection('transactions')
        .orderBy('money', sortOrder)
        .get()
        .then(snapshot => {
            const transactions = snapshot.docs.map(doc => doc.data());
            addTransactionsToScreen(transactions);
        });

    sortOrderAsc = !sortOrderAsc; // Inverte o estado da ordenação
}

function clearTransactionList() {
    const orderedList = document.getElementById('transactions');
    while (orderedList.firstChild) {
        orderedList.removeChild(orderedList.firstChild);
    }
}

function realizarFiltragem() {
    const nomeFiltro = document.getElementById('inputNome').value.toLowerCase();
    const setorFiltro = document.getElementById('inputSetor').value.toLowerCase();

    const transactions = document.querySelectorAll('#transactions li');

    transactions.forEach(transaction => {
        const nome = transaction.querySelector('.transaction-nome').textContent.toLowerCase();
        const setor = transaction.querySelector('.transaction-setor').textContent.toLowerCase();

        if ((nomeFiltro === '' || nome.includes(nomeFiltro)) && (setorFiltro === '' || setor.includes(setorFiltro))) {
            transaction.style.display = 'flex';
        } else {
            transaction.style.display = 'none';
        }
    });
}

function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById('transactions');

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add(transaction.type);
        li.id = transaction.uid;

        const date = document.createElement('p');
        date.innerHTML = transaction.date;
        date.classList.add('transaction-nome', 'content'); // Adicione essa classe

        li.appendChild(date);

        const money = document.createElement('p');
        money.classList.add('transaction-setor', 'width', 'content'); // Adicione essa classe

        money.innerHTML = formatMoney(transaction.money);
        li.appendChild(money);

        const type = document.createElement('p');
        type.classList.add('width', 'none', 'content');

        type.classList.add('tamanho');

        type.innerHTML = transaction.transactionType;
        li.appendChild(type);

        orderedList.appendChild(li);
    });
}

function imprimir() {
    window.print();
}

function formatMoney(money) {
    return `${money.currency} ${money.value}`;
}

// Chame as funções de ordenação ao carregar a página
