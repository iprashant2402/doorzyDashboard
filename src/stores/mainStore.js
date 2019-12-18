import { action, observable ,computed,decorate} from 'mobx';

class MainStore {
  uid = null;
  num_users = 0;
  setUid(newUid) {
    //console.log("STORE.JS : inside setProperty : " + newProperty);
    this.uid = newUid;
    //console.log("STORE.JS : SUCCESS : "+ this.property);
  }
  setNumUsers(x) {
    this.num_users = x;
  }

}

decorate(MainStore,{
    uid : observable,
    num_users : observable,
    setUid : action,
    setNumUsers : action
});

export const mainStore = new MainStore();
