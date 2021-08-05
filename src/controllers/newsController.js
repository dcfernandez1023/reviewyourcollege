const DB = require('../firebase/db.js');


const listenOnNewsTable = (callbackOnError) => {
  return DB.getQuery("news", callbackOnError);
}

export { listenOnNewsTable };
