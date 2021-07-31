// firebase app object
const firebaseApp = require('./firebaseApp.js');
// firestore object
const DBFS = firebaseApp.app.firestore();

/*
  * Writes/updates one piece of data to a specified collection.
  * @param id - the id of the document to write/update
  * @param data - the data that will be written/updated
  * @param collectionName - the name of the desired database collection
  * @param callback - callback function to be fired on success
  * @param callbackOnError - callback function to be fired on error
  *
**/
const writeOne = (id, data, collectionName, callback, callbackOnError) => {
	try {
		DBFS.collection(collectionName).doc(id).set(data)
			.then((res) => {callback(data)});
	}
	catch(error) {
		callbackOnError(error);
	}
}

/*
  * Deletes one document within the specified collection.
  * @param id - the id of the document to delete
  * @param collectionName - the name of the database collection to delete from
  * @param callback - callback function to be fired on success
  * @param callbackOnError - callback function to be fired on error
  *
**/
const deleteOne = (id, collectionName, callback, callbackOnError) => {
	try {
		var doc = DBFS.collection(collectionName).doc(id);
		doc.delete()
			.then(() => {callback(id)})
			.catch((error) => {
				callbackOnError(error);
			});
	}
	catch(error) {
		callbackOnError(error);
	}
}

/*
  * Returns a firebase Query object that can be enabled to listen to changes
    in multiple documents within the specified collection.
  * @param filterName - the field to filter the documents by
  * @param filterValue - the value of the filter; documents containing this
                         value will be queried
  * @param collectionName - the name of the database collection to query from
  * @param callbackOnError - callback function to be fired on error
**/
const getQueryWithFilter = (filterName, filterValue, collectionName, callbackOnError) => {
	try {
		return DBFS.collection(collectionName).where(filterName, "==", filterValue);
	}
	catch(error) {
		callbackOnError(error);
	}
}

/*
  * Returns a firebase Query object that can be enabled to listen to changes
    in multiple documents within the specified collection.
  * @param collectionName - the name of the database collection to query from
  * @param callbackOnError - callback function to be fired on error
**/
const getQuery = (collectionName, callbackOnError) => {
	try {
		return DBFS.collection(collectionName);
	}
	catch(error) {
		callbackOnError(error);
	}
}

/*
	* Returns all documents within the specified collection
	* @param collectionName - the name of the database collection to query from
	* @param callback - callback function to be fired on success
	* @param callbackOnError - callback function to be fired on error
**/
const getAll = (collectionName, callback, callbackOnError) => {
	try {
		DBFS.collection(collectionName).get()
			.then((querySnapshot) => {
				let all = [];
				querySnapshot.forEach((doc) => {
					all.push(doc.data());
				})
				callback(all);
			})
			.catch((error) => {
				callbackOnError(error);
			});
	}
	catch(error) {
		callbackOnError(error);
	}
}

export { writeOne, deleteOne, getQuery, getQueryWithFilter, getAll }
