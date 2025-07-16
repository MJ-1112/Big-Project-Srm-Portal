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

2. Convert Array of Arrays to Worksheet
```
const worksheet = XLSX.utils.aoa_to_sheet(excelData);

```
* Purpose: Converts a two-dimensional array (excelData) into a worksheet object.

* Details: Each sub-array in excelData represents a row in the Excel sheet. For example, [['Name', 'Age'], ['Alice', 30]] would create a worksheet with a header row and one data row.

3. Craete a new Workbook
```
const workbook = XLSX.utils.book_new();

```

* Details: A workbook is like an Excel file that can contain multiple worksheets (tabs).

4. Appennd Worksheet in WORKBOOK

```
XLSX.utils.book_append_sheet(workbook, worksheet, "Updates");

```
* Purpose: Adds the worksheet to the workbook and names the sheet "Updates".

Commit change