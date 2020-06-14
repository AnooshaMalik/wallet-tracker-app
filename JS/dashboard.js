console.log('connected');
var firestore = firebase.firestore();
var auth = firebase.auth();
var Name = document.querySelector('.name h3');
var signOutBtn = document.querySelector('.signOutBtn');
var transactionFormAll = document.querySelector('.transactionFormAll');
console.log(transactionFormAll);
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
            console.log(userInfo);

            Name.textContent = userInfo.fullName;

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
                cost,
                select,
                transactionAt: new Date(transactionAt),
                transactionBy: uid
            }
            console.log(transactionObj);
        }
        await firestore.collection("transactions").add(transactionObj);

    } catch (error) {
        console.log(error.message);
    }

}



//-------------------------------------------------------------------------------
// var transactionAddBtn = document.querySelector('.transactionAddBtn');


signOutBtn.addEventListener('click', userSignOut);
transactionFormAll.addEventListener('submit', (e) => transactionFormSubmission(e));