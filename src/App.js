import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photo: '',
    error: '',
    success: false
  })
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const facebookProvider = new firebase.auth.FacebookAuthProvider();
  
  const handleFacebookSignIn = () => {
    firebase.auth().signInWithPopup(facebookProvider)
    .then((result) => {
      var user = result.user;
      // var accessToken = result.credential.accessToken;

      console.log(user);

    })
    .catch((error) => {
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // var email = error.email;
      // var credential = error.credential;
      console.log(error.message);
    });
  }

  const handleSignIn = () => {
    firebase.auth()
    .signInWithPopup(googleProvider)
    .then((result) => {
      // var credential = result.credential;
      // var token = credential.accessToken;
      console.log(result);
      const {displayName, photoURL, email} = result.user;
      const signInUser = {
        isSignIn: true,
        name: displayName,
        photo: photoURL,
        email: email
      }
      setUser(signInUser);
    })
    .catch((err) => {
      console.log(err);
      console.log(err.massage);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(result => {
      const signOutUser = {
        isSignIn: false,
        name: '',
        email: '',
        password: '',
        photo: ''
      }
      setUser(signOutUser);
    })
    .catch((err) => {
      console.log(err);
      console.log(err.massage);
    })
  }

  const handleSubmit = (event) => {
    if(newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        console.log(res);
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch((error) => {
        const newUserInfo = {...user};
        var errorMessage = error.message;
        newUserInfo.success = false;
        newUserInfo.error = errorMessage;
        setUser(newUserInfo);
      });
    }
    if(!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        console.log(res);
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
      })
      .catch((error) => {
        const newUserInfo = {...user};
        var errorMessage = error.message;
        newUserInfo.success = false;
        newUserInfo.error = errorMessage;
        setUser(newUserInfo);
      });
    }
    event.preventDefault();
  }
  const handleBlur = (event) => {
    let isFieldValid = true;

    if(event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if(event.target.name === 'password'){
      isFieldValid =  /((?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,})/.test(event.target.value);
      // /((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{8,})/ ===>>> number, upperCase, lowerCase, specialCharacter, minimumLength-8
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
    
  }
  const updateUserName = (name) => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: ""
    }).then(res => {
      console.log('User updated successfully');
    }).catch(error => {
      console.log(error);
    });
  }

  return (
    <div className="App">
      {
        user.isSignIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In Using Google</button>
      }
      <button onClick={handleFacebookSignIn}>Sign In Using Facebook</button>
      {
        user.isSignIn && 
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="Minhaz"/>
        </div>
      }

      <br/>
      <br/>

      <h1>Our Own Authentication</h1>

      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="newUser"/>
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit}>
        {
          newUser && <input type="text" onBlur={handleBlur} name="name" placeholder="Name" required/>
        }
        <br/>
        <input type="email" onBlur={handleBlur} name="email" placeholder="Email" required/>
        <br/>
        <input type="password" onBlur={handleBlur} name="password" placeholder="Password" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
      </form>

      <p style={{color: "red"}}>{user.error}</p>
      {
        user.success && <p style={{color: "green"}}>User {newUser ? 'Created':'Logged In' } Successfully</p>
      }
    </div>
  );
}

export default App;
