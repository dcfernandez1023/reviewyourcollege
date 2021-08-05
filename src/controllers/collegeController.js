const DB = require('../firebase/db.js');

const getAllColleges = (callback, callbackOnError) => {
  try {
    return DB.getAll("colleges", callback, callbackOnError).limit(10);
  }
  catch(error) {
    callbackOnError(error);
  }
}

const getTopHundredMostReviewed = (callbackOnError) => {
  return DB.getQuery("colleges", callbackOnError)
    .orderBy("numReviews", "desc")
    .where("numReviews", "!=", 0)
    .limit(5);
}

const searchColleges = (start, callbackOnError) => {
  if(start) {
    const end = start.replace(
      /.$/, c => String.fromCharCode(c.charCodeAt(0) + 1),
    )
  return DB.getQuery("colleges", callbackOnError)
    .orderBy("name")
    .where("name", ">=", start)
    .where("name", "<", end);
  }
  return null;
}

const listenOnCollegeTable = (callbackOnError) => {
  return DB.getQuery("colleges", callbackOnError);
}

const listenOnCollegeDoc = (id, callbackOnError) => {
  return DB.getQueryWithFilter("id", id, "colleges", callbackOnError);
}

const writeCollege = (college, callback, callbackOnError) => {
  college.numReviews = college.reviews.length;
  DB.writeOne(college.id, college, "colleges", callback, callbackOnError);
}

export {
  getAllColleges,
  getTopHundredMostReviewed,
  searchColleges,
  listenOnCollegeTable,
  listenOnCollegeDoc,
  writeCollege
}
