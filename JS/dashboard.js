console.log('connected');
var firestore = firebase.firestore();
var auth = firebase.auth();
var Name = document.querySelector('.name h3');
var signOutBtn = document.querySelector('.signOutBtn');
var transactionFormAll = document.querySelector('.transactionFormAll');
var transactionList = document.querySelector('.transactionList');
// console.log(transactionFormAll);
// console.log(Name)
// console.log(firestore);
// --------------------------------------------------------------------------------------------
// fetch uid from URL
// var uid = location.hash.substring(1, location.hash.length);
var uid = null;
// var uid = null;
var fetchUserInfo = async(uid) => {
    try {
        var userInfo = await firestore.collection("users").doc(uid).get();
        // console.log(userInfo.data());
        return userInfo.data();
        // var data = userInfo.data();        store data
        // console.log(data.createdAt.toDate().toISOString().split('T')[0]);--------------> fetch proper date 


    } catch (error) {
        console.log(error.message);
    }
};
// ----------------------------------------------------------------------------------------
// fetchUserInfo(uid);
auth.onAuthStateChanged(async(user) => {
        if (user) {
            console.log('logged IN');
            // var { uid } = user;
            uid = user.uid;
            // console.log(uid);
            // var User = user.data();
            // ------------------------------> function will call here so that
            // if user is not log init can not do any sort of work <--------------------------------------
            var userInfo = await fetchUserInfo(uid);
            // console.log(userInfo);

            Name.textContent = userInfo.fullName;
            // var transArr = [{
            //     title: "abc",
            //     cost: "200",
            //     transactionType: "expense",
            //     transactionAt: "2020-9-3"
            // }, {
            //     title: "xyz",
            //     cost: "300",
            //     transactionType: "income",
            //     transactionAt: "2020-10-3"
            // }, ];
            var transactions = await fetchTransactions(uid);
            // console.log(transactions);
            rendorTransactions(transactions);

            // await fetchTransactions(uid);

        } else
            location.assign('./index.html');



    })
    // -------------------------------------------------------------------------------------------
var userSignOut = async() => {
        await auth.signOut();
    }
    //-------------------------------------------------------------------------------
var transactionFormSubmission = async(e) => {
        e.preventDefault();

        try {
            console.log('function starts')
            var title = document.querySelector('.title').value;
            var cost = document.querySelector('.cost').value;
            var select = document.querySelector('.select').value;
            var transactionAt = document.querySelector('.transactionAt').value;
            if (title && cost && select && transactionAt) {
                var transactionObj = {
                    title,
                    cost: parseInt(cost),
                    select,
                    transactionAt: new Date(transactionAt),
                    transactionBy: uid
                }
                console.log(transactionObj);
            }
            await firestore.collection("transactions").add(transactionObj);
            var transactions = await fetchTransactions(uid);
            // console.log(transactions);
            rendorTransactions(transactions);

        } catch (error) {
            console.log(error.message);
        }

    }
    //------------------------- Fetch Tranctions----------------------------

var fetchTransactions = async(uid) => {

        var transactions = [];
        var query = await firestore.collection("transactions").where("transactionBy", "==", uid).get();
        // console.log(query);
        query.forEach((doc) => {
            transactions.push({...doc.data(), transactionId: doc.id });
        })
        return transactions;
    }
    //------------------------- Rendor Tranctions----------------------------
var rendorTransactions = (transactionArr) => {
        finalCostCalculation(transactionArr);
        transactionList.innerHTML = " ";
        transactionArr.forEach((transactions, index) => {
            var { title, cost, transactionAt, transactionId } = transactions;
            transactionList.insertAdjacentHTML('beforeend', `   <div class="transactionListItem">
        <div class="rendorIndex flex itemPadding">
            <h3>${++index}</h3>
        </div>
        <div class="rendorTitle itemPadding ">
            ${transactions.title}
        </div>
        <div class="rendorCost flex itemPadding">
        ${transactions.cost}
        </div>
        <div class="rendorDate flex itemPadding">
        ${transactions.transactionAt.toDate().toISOString().split('T')[0]}
        </div>
        <div class="rendorDate flex itemPadding">
        <a href="./transaction.html#${transactionId}"> <button type="button">View</button></a>
        </div>

    </div>`)

        });


    }
    //                              setting the user curent amount
var finalCostCalculation = (transArr) => {
    var totalAmount = 0;
    transArr.forEach((transaction) => {
        var { cost, select } = transaction;
        if (select === 'income') {
            totalAmount = totalAmount + cost;
        } else {
            totalAmount = totalAmount - cost;

        }

    });
    console.log(totalAmount);
    // console.log(transaction)
}



//-------------------------------------------------------------------------------
// var transactionAddBtn = document.querySelector('.transactionAddBtn');


signOutBtn.addEventListener('click', userSignOut);
transactionFormAll.addEventListener('submit', (e) => transactionFormSubmission(e));
// transactionFormAll.addEventListener('submit', (e) => transactionFormSubmission(e));
// transactionFormAll.addEventListener('submit', (e) => transactionFormSubmission(e));