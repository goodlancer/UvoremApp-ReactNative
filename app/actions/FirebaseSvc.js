import firebase from 'firebase';
import { firebaseConfig } from "@config";
import * as Utils from "@utils";
import { store } from "@store";
import md5 from 'md5';

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }
  parse = snapshot => {
    const { createdAt: numberStamp, text, type, typeid, replyMsg, agree, disagree, user, image, file, audio, tags } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    return { id, _id, timestamp, text, type, typeid, replyMsg, agree, disagree, user: { _id: user._id }, image, file, audio, tags };
  };
  myOpinion = (id, agree, type, typeid, result) => {
    let db = `${type}/${typeid}/${id}`;
    if (parseInt(result) == 1) {
      this.agree(db, !agree).once('value')
        .then(snapshot => {
          this.agree(db, !agree).set(snapshot.val() - 1);
        });
    }
    this.agree(db, agree).once('value')
      .then(snapshot => {
        this.agree(db, agree).set(snapshot.val() + 1);
      });
  }
  refOnTactics = (id, callback) => {
    this.tactics(id)
      .on('value', snapshot => {
        callback(snapshot.val());
      });
  }
  refOnNutritions = (id, agree, callback) => {
    this.nutrition(id, agree)
      .on('value', snapshot => {
        callback(snapshot.val());
      });
  }
  refOnChatAgree = (id, agree, callback) => {
    this.agree(id, agree)
      .on('value', snapshot => {
        callback(snapshot.val());
      });
  }
  refOnNewsAgree = (id, agree, callback) => {
    this.news(id, agree)
      .on('value', snapshot => {
        callback(snapshot.val());
      });
  }
  refOnCommentsAgree = (id, agree, callback) => {
    this.comments(id, agree)
      .on('value', snapshot => {
        callback(snapshot.val());
      });
  }
  agree(db, agree) {
    if (agree)
      return this.ref(`Messages/${db}/agree`);
    else
      return this.ref(`Messages/${db}/disagree`);
  }
  news(db, agree) {
    if (agree)
      return this.ref(`News/${db}/agree`);
    else
      return this.ref(`News/${db}/disagree`);
  }
  comments(db, agree) {
    if (agree)
      return this.ref(`Comments/${db}/agree`);
    else
      return this.ref(`Comments/${db}/disagree`);
  }
  tactics(db) {
    return this.ref(`Tactics/${db}`);
  }
  nutrition(db, agree) {
    if (agree)
      return this.ref(`Nutrition/${db}/agree`);
    else
      return this.ref(`Nutrition/${db}/disagree`);
  }
  refOnMsg = (db, callback) => {
    this.ref(`Messages/${db}`)
      .limitToLast(Utils.MSG_SHOW_COUNT)
      .on('child_added', snapshot => { callback(this.parse(snapshot)) });
  }
  refMsgs = (db, callback) => {
    this.ref(`Messages/${db}`)
      .once('value', snapshot => { callback(snapshot) });
  }
  refOnRoom = callback => {
    this.ref(`Messages/Room`)
      .on('child_added', snapshot => { callback(snapshot) });
  }
  refOnRoomClosed = (key, callback) => {
    this.ref(`Messages/Room/${key}/deleted`)
      .on('value', snapshot => {
        callback(snapshot.val());
      });
  }
  refOnAlarm = (callback) => {
    this.ref("Alarm")
      .on('child_added', snapshot => { callback(snapshot) });
  }
  forceRefresh = () => {
    let key = this.ref("Refresh").push(md5(`user${store.getState().auth.login.data.user.id}`)).key;
    setTimeout(() => {
      this.ref(`Refresh/${key}`).remove();
    }, 1500);
  }
  refOnRefresh = (callback) => {
    this.ref("Refresh")
      .on('child_added', snapshot => { snapshot.val() == md5(`user${store.getState().auth.login.data.user.id}`) && callback() });
  }

  refOnNotification = (db, callback) => {
    this.ref(`Notification/${db}`)
      .on('value', snapshot => { callback(snapshot) });
  }
  refOnPushNotificationInit = (token) => {
    this.ref("PushNotification")
      .child(token)
      .remove();
  }
  refOnPushNotification = (token, callback) => {
    this.ref("PushNotification")
      .child(token)
      .on('child_added', snapshot => { callback(snapshot.val()) });
  }
  refOnPrivateChat = (db, callback) => {
    this.ref(`Notification`)
      .child(db)
      .on('value', snapshot => { callback(snapshot) });
  }
  readNotification = (db) => {
    this.ref(`Notification/${db}`)
      .remove();
  }
  remove = (db) => {
    this.ref(`Alarm/${db}`).remove();
  }
  ref(database) {
    return firebase.database().ref(database);
  }
  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = (messages, type, typeid, tags, receiver_user_id) => {
    if (type == Utils.CHAT_TYPE.PRIVATE && !typeid) return;

    if (parseInt(type) > 0) type = `${Utils.CHAT_TYPE.TEAM}`;

    let agree = 0;
    let disagree = 0;
    // for (let i = 0; i < messages.length; i++) {
    const { text, user, image, gif, file, audio, replyMsg } = messages;
    let message = {
      text,
      user,
      agree,
      disagree,
      createdAt: this.timestamp,
    };
    if (image) message = { ...message, image };

    if (file) message = { ...message, file };

    if (gif) message = { ...message, image: gif };

    if (audio) message = { ...message, audio };


    if (!Utils.isObjEmpty(messages.reply)) message = { ...message, replyMsg: { user: reply.user, text: reply.text } }
    if (tags) message = { ...message, tags }
    // }

    this.ref(`Messages/${type}/${typeid}`).push(message);
    if (type == Utils.CHAT_TYPE.PRIVATE || type == Utils.CHAT_TYPE.TEAM) {
      this.ref(`Notification/${type}/${receiver_user_id}`).transaction(function (current_value) {
        return (current_value || 0) + 1;
      });
    }
  };
  uploadToFirebase = (blob, name, type) => {
    return new Promise((resolve, reject) => {
      this.storage.child(`uploads/chat/${name}`).put(blob, {
        contentType: type
      }).then((snapshot) => {
        blob.close();
        resolve(snapshot);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  get storage() {
    return firebase.storage().ref();
  }
  refOff(db) {
    this.ref(`Messages/${db}`).off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
