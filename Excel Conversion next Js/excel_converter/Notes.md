## Notes 
1. Snippet for the :

To collect all unique field names that exist inside the updates object of every document in your Firebase collection.
These field names will become the column headers in your Excel export.
``` 
const allFieldsSet = new Set();
```
* Creates a new Set called allFieldsSet.

* A Set is a special JavaScript object that only stores unique values (no duplicates).

* This will be used to store all the unique field names found in the updates objects.

```
Object.values(firebaseData)
```
 
* firebaseData is an object where each key is a document ID and each value is an object like { updates: { ... } }.

* Object.values(firebaseData) gives you an array of all the document objects (ignoring the document IDs for now).

```
.forEach(doc => ...)
```

* Loops over each document object in the array.

```
Object.keys(doc.updates)
```
* For each document, doc.updates is an object containing the fields you want.
* Object.keys(doc.updates) gives you an array of all the field names (keys) in that updates object.

```
.forEach(field => allFieldsSet.add(field))
```
* For each field name in the current document’s updates object, add it to the allFieldsSet
* If a field name appears in multiple documents, the Set will only keep one copy (ensuring uniqueness).
