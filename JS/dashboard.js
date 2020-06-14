console.log('connected');
var firestore = firebase.firestore();
var auth = firebase.auth();
var Name = document.querySelector('.name h3');
console.log(Name)
    // console.log(firestore);
    // fetch uid from URL
var uid = location.hash.substring(1, location.hash.length);
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
// fetchUserInfo(uid);
auth.onAuthStateChanged(async(user) => {
    if (user) {
        console.log('logged IN');
        var { uid } = user;
        // console.log(uid);

        // var User = user.data();
        // ------------------------------> function will call here so that
        // if user is not log init can not do any sort of work <--------------------------------------
        var userInfo = await fetchUserInfo(uid);
        console.log(userInfo);

        Name.textContent = userInfo.fullName;

    } else
        console.log('logged out');

})