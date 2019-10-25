import firebase from 'firebase';
import {mainStore} from '.././stores/mainStore';

function validateInput(email,password){
    if(email === '' || password === ''){
        return false;
      }
      var emailReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      var passReg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if(!emailReg.test(email)){
        return false;
      }
      if(!passReg.test(password)){
        return false;
      }
      else{
          return true;
      }
}

export const proceedLogin = (email,password) => {
    if(validateInput){
        firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => console.log(error));
        return true;
    }
    else{
        return false;
    } 
}

export const logout = () => {
    firebase.auth().signOut().then(function(){
        return true;
    }).catch(err=>console.log(err));
    return false;
}