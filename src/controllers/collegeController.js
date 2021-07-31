const DB = require('../firebase/db.js');

const getAllColleges = (callback, callbackOnError) => {
  try {
    return DB.getAll("colleges", callback, callbackOnError);
  }
  catch(error) {
    callbackOnError(error);
  }
}

const listenOnCollegeTable = (callbackOnError) => {
  return DB.getQuery("colleges", callbackOnError);
}

const listenOnCollegeDoc = (id, callbackOnError) => {
  return DB.getQueryWithFilter("id", id, "colleges", callbackOnError);
}

export { getAllColleges, listenOnCollegeTable, listenOnCollegeDoc }
