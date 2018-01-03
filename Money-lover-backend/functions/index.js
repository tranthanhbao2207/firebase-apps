const functions = require('firebase-functions');
const createUser = require('./create_user');
const admin = require('firebase-admin');
const requestOneTimePassword = require('./request_one_time_password');
const serviceAccount = require('./service_account.json');
const verifyOneTimePassword = require('./verify_one_time_password');
const R = require('ramda');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://one-time-password-2f2b1.firebaseio.com"
});

const getCurrentUid = (tokenId) => {
  return '84902866135';
}

const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

const snapshotToObject = snapshot => {
  let item = {};

  snapshot.forEach(childSnapshot => {
    item = childSnapshot.val();
    item.key = childSnapshot.key;
  });

  return item;
};
const isValid = val => val.deleted === false;
const filterByUid = R.compose(R.filter(val => val.uid === getCurrentUid()), snapshotToArray);

const createWallet = (req, res) => {
  // verify uid
  if (!req.body.name) {
    return res.status(422).send({
      error: ' wallet name is required !'
    });
  }
  req.body.description = req.body.description || '';
  const walletId = admin.database().ref().child('trasactions').push().key;
  const wallet = R.merge(req.body,{uid: getCurrentUid(),deleted: false})
  admin.database().ref('trasactions/' + walletId).set(wallet, () => {
    res.send('Created wallet ' + req.body.name);
  });
};

const updateWallet = (req, res) => {
  if (!req.query.id) {
    return res.status(422).send({
      error: ' wallet id is required !'
    });
  }
  var postData = {
    'test4' : 'test4'
  };
  admin.database().ref(`wallets/${req.query.id}`).once('value', snapshot => {
      res.send(R.merge(snapshotToObject(snapshot), postData));
  });
  // var updates = {};
  // updates['wallets/' + req.query.id] = postData;

  // admin.database().ref().update(updates, () => res.send('updated '))
  // .catch( (err) => res.send(err));
}

const deleteWallet = (req, res) => {

}

const getWallets = (req, res) => {
  // verify uid
  admin.database().ref('wallets/').once('value', (snapshot) => {
    res.send(R.filter(isValid,filterByUid(snapshot)));
  }).catch((err) => res.send('err : ', err));
};

const getAllWallet = (req, res) => {
  // verify uid
  admin.database().ref('wallets/').once('value', (snapshot) => {
    res.send(snapshot);
  }).catch((err) => res.send('err : ', err));
};


const createTransaction = (req, res) => {
  // verify uid
  if (!req.body.type) {
    return res.status(422).send({
      error: 'Yeu cau : Thu hoac chi (0 hoac 1)'
    });
  }

  if (!req.body.walletId) {
    return res.status(422).send({
      error: 'Yeu cau : walletId (id cua vi - co dang "-L1mKfRjwZuZLLQoKyqL")'
    });
  }
  const transactionId = admin.database().ref().child('transactions').push().key;
  const transaction = R.merge(body, {uid: getCurrentUid(), deleted: false})
  admin.database().ref('transactions/' + transactionId).set(transaction, () => {
    res.send('Created new transaction !!');
  }).catch((err) => res.send(err));
};

const getTransactions = (req, res) => {
  admin.database().ref('transactions/').once('value', (snapshot) => {
    res.send(filterByUid(snapshot));
  }).catch((err) => res.send('err : ', err));
  
}

const getAllTransaction = (req, res) => {
  admin.database().ref('transactions/').once('value', (snapshot) => {
    res.send(snapshot);
  }).catch((err) => res.send('err : ', err));
  
}

exports.createWallet = functions.https.onRequest(createWallet);
exports.getWallets = functions.https.onRequest(getWallets);
exports.getAllWallet = functions.https.onRequest(getAllWallet);
exports.deleteWallet = functions.https.onRequest(deleteWallet);
exports.updateWallet = functions.https.onRequest(updateWallet);

exports.createTransaction = functions.https.onRequest(createTransaction);
exports.getTransactions = functions.https.onRequest(getTransactions);
exports.getAllTransaction = functions.https.onRequest(getAllTransaction);

exports.createUser = functions.https.onRequest(createUser);
exports.requestOneTimePassword = functions.https.onRequest(requestOneTimePassword);
exports.verifyOneTimePassword = functions.https.onRequest(verifyOneTimePassword);