# asteroid-db
Server-less NoSQL Database

```javascript
const AsteroidDB = require('./../index')
```

**Set Development**

```javascript
AsteroidDB.set_development(true)
```

**Test Connection**

```javascript
AsteroidDB.test()
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


bool mdb.create_catalogue(par_1, par_2, par_3, par_4))


// ----------- Example ----------------
if(mdb.create_catalogue("my_db", "secure", "private", { "data" : { "username" : "hello", "password" : "world" }})){
	console.log("Success")
}
else{
	console.log("Failed")
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


[false/array] mdb.read_catalogue(par_1, par_2, par_3, par_4))


// ----------- Example ----------------
var ret_data = mdb.read_catalogue("my_db", "secure", "private")
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


bool mdb.update_catalogue(par_1, par_2, par_3, par_4))


// ----------- Example ----------------
if(mdb.update_catalogue("my_db", "secure", "private", { "filter" : { "username" : "hello" }, "data" : { "password" : "myworld" }})){
	console.log("Success")
}
else{
	console.log("Failed")
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


bool mdb.delete_catalogue(par_1, par_2, par_3, par_4))


// ----------- Example ----------------
if(mdb.delete_catalogue("my_db", "secure", "private", { "filter" : { "username" : "hello" }})){
	console.log("Success")
}
else{
	console.log("Failed")
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


bool mdb.replace_catalogue(par_1, par_2, par_3, par_4))


// ----------- Example ----------------
if(mdb.replace_catalogue("my_db", "secure", "private", { "filter" : { "username" : "hello" }, "data" : { "userid" : "hi buddy" }})){
	console.log("Success")
}
else{
	console.log("Failed")
}
// ---------- Example Ends -------------
```