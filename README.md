# asteroid-db
Server-less NoSQL Database

```javascript
const AsteroidDB = require('asteroid-db')

var adb = new AsteroidDB()
```

**Set Development**

```javascript
adb.set_development(true)
```

**Test Connection**

```javascript
adb.test()
```

**Data Manipulation**

*First Parameter ( par_1 ) - Database Name*

*Second Parameter ( par_2 ) - Catalogue Name*

*Third Parameter ( par_3 ) - Catalogue Type*

*Fourth Parameter ( par_4 ) - Catalogue Itself*

 - **Create Catalogue**

```javascript

// Create Catalogue 'par_4' Object Format [ Required ]
// {
//     "data" : {
//         "key1" : "val1",
//         "key2" : "val2"
//     }
// }


bool adb.create_catalogue(par_1, par_2, par_3, par_4))


// ----------- Example ----------------
if(adb.create_catalogue("my_db", "secure", "private", { "data" : { "username" : "hello", "password" : "world" }})){
	console.log("Catalogue Creation Successful")
}
else{
	console.log("Catalogue Creation Failed")
}
// ---------- Example Ends -------------
```


 - **Read Catalogue**

```javascript

// Read Catalogue 'par_4' Object Format [ Optional ]
// {
//     "filter" : {
//         "key1" : "val1",
//         "key2" : "val2"
//     }
// }


[false/array] adb.read_catalogue(par_1, par_2, par_3, par_4))


// ----------- Example ----------------
var ret_data = adb.read_catalogue("my_db", "secure", "private")
console.log(ret_data)
// ---------- Example Ends -------------
```

 - **Update Catalogue**

```javascript

// Update Catalogue 'par_4' Object Format [ Required ]
// {
//     "filter" : {
//         "key1" : "val1"
//     },
//		"data" : {
//			"key2" : "val2"
//		}
// }


bool adb.update_catalogue(par_1, par_2, par_3, par_4))


// ----------- Example ----------------
if(adb.update_catalogue("my_db", "secure", "private", { "filter" : { "username" : "hello" }, "data" : { "password" : "myworld" }})){
	console.log("Catalogue Update Successful")
}
else{
	console.log("Catalogue Update Failed")
}
// ---------- Example Ends -------------
```

 - **Delete Catalogue**

```javascript

// Delete Catalogue 'par_4' Object Format [ Required ]
// {
//     "filter" : {
//         "key1" : "val1"
//     }
// }


bool adb.delete_catalogue(par_1, par_2, par_3, par_4))


// ----------- Example ----------------
if(adb.delete_catalogue("my_db", "secure", "private", { "filter" : { "username" : "hello" }})){
	console.log("Catalogue Deletion Successful")
}
else{
	console.log("Catalogue Deletion Failed")
}
// ---------- Example Ends -------------
```

 - **Replace Catalogue**

```javascript

// Replace Catalogue 'par_4' Object Format [ Required ]
// {
//     "filter" : {
//         "key1" : "val1"
//     },
//		"data" : {
//			"key2" : "val2"
//		}
// }


bool adb.replace_catalogue(par_1, par_2, par_3, par_4))


// ----------- Example ----------------
if(adb.replace_catalogue("my_db", "secure", "private", { "filter" : { "username" : "hello" }, "data" : { "userid" : "hi buddy" }})){
	console.log("Catalogue Replace Successful")
}
else{
	console.log("Catalogue Replace Failed")
}
// ---------- Example Ends -------------
```