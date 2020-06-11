// console.log('connected');
console.log(firebase);
var auth = firebase.auth();
var firestore = firebase.firestore();

var signinForm = document.querySelector('.signinForm');
var signupForm = document.querySelector('.signupForm');



//-------------------------------- signIn FOrm Function--------------------------------------------


var signinFormSubmission = async(e) => {
        e.preventDefault();
        try {
            var email = document.querySelector('.signinEmail').value;
            var password = document.querySelector('.signinPassword').value;
            //           login user
            var { user: { uid } } = await auth.signInWithEmailAndPassword(email, password);
            console.log(uid);
            // fetch user info
            var fetchUser = await firestore.collection("users").doc(uid).get();
            console.log(fetchUser.data());
            console.log('done');
        } catch (error) {
            console.log(error.message);
        }
    }
    //-------------------------------- signUP FOrm Function--------------------------------------------
var signupFormSubmission = async(e) => {
        e.preventDefault();
        try {

            var fullName = document.querySelector('.signupFullName').value;
            var email = document.querySelector('.signupEmail').value;
            var password = document.querySelector('.signupPassword').value;
            if (fullName && email && password) {
                //create user in auth section
                var { user: { uid } } = await auth.createUserWithEmailAndPassword(email, password);
                console.log(uid);

            }
        } catch (error) {
            console.log(error.message);
        }

        // store Data in firestore through user uid 
        var userInfo = {
            fullName,
            email,
            createdAt: new Date()
        }
        console.log(userInfo);
        await firestore.collection("users").doc(uid).set(userInfo);
        console.log('done');
    }
    // ---------------------------------------------------------------------------------------
signinForm.addEventListener("submit", (e) => signinFormSubmission(e));
signupForm.addEventListener("submit", (e) => signupFormSubmission(e));