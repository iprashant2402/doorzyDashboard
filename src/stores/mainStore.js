import { action, observable ,computed,decorate} from 'mobx';

class MainStore {
  uid = null;

  setUid(newUid) {
    //console.log("STORE.JS : inside setProperty : " + newProperty);
    this.uid = newUid;
    //console.log("STORE.JS : SUCCESS : "+ this.property);
  }

}

decorate(MainStore,{
    uid : observable,
    setUid : action
});

export const mainStore = new MainStore();
