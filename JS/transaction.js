var auth = firebase.auth();
var firestore = firebase.firestore();
var transactionForm = document.querySelector('.transactionForm');
var transactionTitle = document.querySelector('.title');
var transactionCost = document.querySelector('.cost');
var transactionSelect = document.querySelector('.select');
var transactionAt = document.querySelector('.transactionAt');
var TransactionId = location.hash.substring(1, location.hash.length);


//        fetchTransaction                                      function# 01

var fetchTransaction = async(TransactionId) => {


        var transactionData = await firestore.collection('transactions').doc(TransactionId).get();
        // console.log(transactions.data())
        return (transactionData.data());
    }
    // ----------------------------------------------------------------------------------------

//        updateFunction                                     function# 02
var editFormHandler = async(e, TransactionId) => {
        e.preventDefault
        var updatedTitle = transactionTitle.value;
        var updatedCost = transactionCost.value;
        var updatedSelect = transactionSelect.value;
        var updatedTransactionAt = transactionAt.value;
        var updatedTransaction = {
            title: updatedTitle,
            cost: updatedCost,
            select: updatedSelect,
            transactionAt: new Date(updatedTransactionAt)
        }
        console.log(updatedTransaction)
            // console.log(updatedTitle, updatedCost, updatedSelect, updatedTransactionAt)
    }
    // -- -- -- -- -- ---- -------------------------------------------------------------
transactionForm.addEventListener("submit", (e) => editFormHandler(e))



//                              auth listener

auth.onAuthStateChanged(async(user) => {
    if (user) {
        uid = user.uid;
        //set the intial form of transaction before update
        var { cost, select, title, transactionAt: transAt } = await fetchTransaction(TransactionId);

        //setting initial values
        transactionTitle.value = title;
        transactionCost.value = cost;
        transactionSelect.value = select;

        transactionAt.value = transAt.toDate().toISOString().split("T")[0];


        // console.log(uid);
    } else
        location.assign('./index.html');



})