var fs = require('fs')
var isSubset = require('is-subset')
var makeDir = require('make-dir')
const outputFileSync = require('output-file-sync');
var canonical_path = require('canonical-path')

class AsteroidDB{

	constructor(path=__dirname, dev=false){
		this.db_path = path
		this.development = dev
		this.DATABASE = "AsteroidDB"
	}

	// ================= PRIVATE METHODS ==========================

	is_exists(path){
		if(fs.existsSync(path)){
			return(true)
		}
		else{
			return(false)
		}
	}

	is_subset(json1, json2){
		if(isSubset(json1, json2)){
			return(true)
		}
		else{
			return(false)
		}
	}

	recursive_keys_validity_check(json){
		var keys = Object.keys(json)
		for(var i=0; i<keys.length; i++){
			if((keys[i].split(".")).length != 1 )
				return false
			if(typeof(json[keys[i]]) == "object"){
				if(!(this.recursive_keys_validity_check(json[keys[i]])))
					return false
			}
		}
		return true
	}

	// ---------------- CREATE METHODS -------------------------


	create_db(db_name){
		var path1 = this.db_path+"/"+this.DATABASE
		var path2 = this.db_path+"/"+this.DATABASE+"/"+db_name;
		if(!(this.is_exists(path1))){
			makeDir.sync(path1)
			if(!(this.is_exists(path1))){
				if(this.development)
					console.log("[ERROR]-[Creating Master Folder Failed]")
				return(false)
			}
		}
		if(!(this.is_exists(path2))){
			makeDir.sync(path2)
			if(!(this.is_exists(path2))){
				if(this.development)
					console.log("[ERROR]-[Creating Database Folder Failed]")
				return(false)
			}
		}
		return(true)
	}

	create_exclusive(db_name, exclusive_name){
		if(!(this.create_db(db_name))){
			return(false)
		}
		var path1 = this.db_path+"/"+this.DATABASE+"/"+db_name+"/"+exclusive_name
		if(!(this.is_exists(path1))){
			makeDir.sync(path1)
			if(!(this.is_exists(path1))){
				if(this.development)
					console.log("[ERROR]-[Creating Exclusive Folder Failed]")
				return(false)
			}
		}
		return(true)
	}

	create_catalogue_type(db_name, exclusive_name, cat_type){
		if(!(this.create_exclusive(db_name, exclusive_name))){
			return(false)
		}
		var file_name = cat_type+".json"
		var path1 = this.db_path+"/"+this.DATABASE+"/"+db_name+"/"+exclusive_name
		if(!(this.is_exists(path1+"/"+file_name))){
			var json = [];
			outputFileSync(path1+"/"+file_name, JSON.stringify(json), 'utf-8');
		}
		return(true)
	}

	// ----------------- CREATE METHODS ENDS -------------------


	// ---------------- USE METHODS ----------------------------

	use_catalogue_type(db_name, exclusive_name, cat_type){
		var file_name = cat_type+".json"
		var path1 = this.db_path+"/"+this.DATABASE+"/"+db_name+"/"+exclusive_name
		if(!(this.is_exists(path1))){
			return(false)
		}
		else{
			return(true)
		}
	}

	// ----------------- USE METHODS ENDS ----------------------



	// ================= PRIVATE METHODS ENDS =====================


	// ===================== PUBLIC METHODS ============================

	test(){
		if(this.development == true){
			console.log("[SUCCESS]-[Connection to Database Successful]")
		}
		return(true)
	}

	set_db_path(path){
		// CHECK FOR VALID FILE PATHS
		this.db_path = path
	}

	set_development(value){
		// CHECK FOR THE BOOLEAN VALUE
		this.development = value
		return(true)
	}

	create_catalogue(db_name, exclusive_name, cat_type, command){
		if(!(this.create_catalogue_type(db_name, exclusive_name, cat_type))){
			if(this.development)
				console.log("[ERROR]-[CREATE_CATALOGUE]-[CREATING CATALOGUE FAILED]")
			return(false)
		}

		if(!(command)){
			if(this.development)
				console.log("[ERROR]-[CREATE_CATALOGUE]-[COMMAND NOT FOUND]")
			return(false)
		}

		if("filter" in command){
			if(this.development)
				console.log("[WARNING]-[CREATE_CATALOGUE]-['filter' PROVIDED IN COMMAND WHICH IS NOT USED]")
		}

		if(!("data" in command)){
			if(this.development)
				console.log("[ERROR]-[CREATE_CATALOGUE]-['data' NOT FOUND IN COMMAND WHICH IS MANDATORY]")
			return(false)
		}

		if(typeof(command["data"]) != "object"){
			if(this.development)
				console.log("[ERROR]-[CREATE_CATALOGUE]-['data' IS NOT AN OBJECT]")
			return(false)
		}

		if(!(this.recursive_keys_validity_check(command["data"]))){
			if(this.development)
				console.log("[ERROR]-[CREATE_CATALOGUE]-['data' OBJECT CONTAINS 'dot(.)' IN KEYS WHICH IS NOT ALLOWED]")
			return(false)
		}
		
		var path = this.db_path+"/"+this.DATABASE+"/"+db_name+"/"+exclusive_name+"/"+cat_type+".json"
		var can_db_path = canonical_path.normalize(this.db_path)
		var can_path = canonical_path.normalize(path)
		if(!(can_path.includes(can_db_path))){
			if(this.development){
				console.log("[ERROR]-[CREATE_CATALOGUE]-[TRYING TO ACCESS FILES BEHIND THE DB PATH]")
			}
			return(false)
		}
		

		var json = JSON.parse(fs.readFileSync(path, 'utf8'));
		json.push(command["data"])

		outputFileSync(path, JSON.stringify(json), 'utf-8');
		return(true);
	}

	read_catalogue(db_name, exclusive_name, cat_type, command=null){
		if(!(this.use_catalogue_type(db_name, exclusive_name, cat_type))){
			if(this.development){
				console.log("[ERROR]-[READ_CATALOGUE]-[CATALOGUE TYPE NOT FOUND]")
			}
			return(false)
		}

		var path = this.db_path+"/"+this.DATABASE+"/"+db_name+"/"+exclusive_name+"/"+cat_type+".json"
		var can_db_path = canonical_path.normalize(this.db_path)
		var can_path = canonical_path.normalize(path)
		if(!(can_path.includes(can_db_path))){
			if(this.development){
				console.log("[ERROR]-[READ_CATALOGUE]-[TRYING TO ACCESS FILES BEHIND THE DB PATH]")
			}
			return(false)
		}
		
		if( (command == null) || (command == {}) || (command["filter"] == undefined) ){
			return(JSON.parse(fs.readFileSync(path, 'utf8')))
		}

		if("data" in command){
			if(this.development){
				console.log("[WARNING]-['data' is not required in command but passed. Ignoring]")
			}
		}

		if("filter" in command){
			var json = JSON.parse(fs.readFileSync(path, 'utf8'))
			var ret_json = []
			for(var i=0; i<json.length; i++){
				if(this.is_subset(json[i], command["filter"])){
					ret_json.push(json[i])
				}
			}
			return(ret_json)
		}
	}

	update_catalogue(db_name, exclusive_name, cat_type, command){
		if(!(this.use_catalogue_type(db_name, exclusive_name, cat_type))){
			if(this.development){
				console.log("[ERROR]-[UPDATE_CATALOGUE]-[CATALOGUE TYPE NOT FOUND]")
			}
			return(false)
		}

		var path = this.db_path+"/"+this.DATABASE+"/"+db_name+"/"+exclusive_name+"/"+cat_type+".json"
		var can_db_path = canonical_path.normalize(this.db_path)
		var can_path = canonical_path.normalize(path)
		if(!(can_path.includes(can_db_path))){
			if(this.development){
				console.log("[ERROR]-[UPDATE_CATALOGUE]-[TRYING TO ACCESS FILES BEHIND THE DB PATH]")
			}
			return(false)
		}

		if( (command == null) || (command == {}) ){
			if(this.development){
				console.log("[ERROR]-[UPDATE_CATALOGUE]-[COMMAND NOT FOUND]")
			}
			return(false)
		}
		
		if(command["filter"] == undefined){
			if(this.development){
				console.log("[ERROR]-[UPDATE_CATALOGUE]-['filter' NOT FOUND IN COMMAND]")
			}
			return(false)
		}

		if(command["data"] == undefined){
			if(this.development){
				console.log("[ERROR]-[UPDATE_CATALOGUE]-['data' NOT FOUND IN COMMAND]")
			}
			return(false)
		}

		var json = JSON.parse(fs.readFileSync(path, 'utf8'))
		var updated = 0
		for(var i=0; i<json.length; i++){
			if(this.is_subset(json[i], command["filter"])){
				json[i] = {...json[i], ...command["data"]}
				updated += 1
			}
		}

		if(this.development){
			console.log("[SUCCESS]-[UPDATE_CATALOGUE]-[UPDATED "+updated+" CATALOGUE/S]")
		}

		outputFileSync(path, JSON.stringify(json), 'utf-8');
		return(true)
	}

	delete_catalogue(db_name, exclusive_name, cat_type, command){
		if(!(this.use_catalogue_type(db_name, exclusive_name, cat_type))){
			if(this.development){
				console.log("[ERROR]-[DELETE_CATALOGUE]-[CATALOGUE TYPE NOT FOUND]")
			}
			return(false)
		}

		var path = this.db_path+"/"+this.DATABASE+"/"+db_name+"/"+exclusive_name+"/"+cat_type+".json"
		var can_db_path = canonical_path.normalize(this.db_path)
		var can_path = canonical_path.normalize(path)
		if(!(can_path.includes(can_db_path))){
			if(this.development){
				console.log("[ERROR]-[DELETE_CATALOGUE]-[TRYING TO ACCESS FILES BEHIND THE DB PATH]")
			}
			return(false)
		}

		if( (command == null) || (command == {}) ){
			if(this.development){
				console.log("[ERROR]-[DELETE_CATALOGUE]-[COMMAND NOT FOUND]")
			}
			return(false)
		}
		
		if(command["filter"] == undefined){
			if(this.development){
				console.log("[ERROR]-[DELETE_CATALOGUE]-['filter' NOT FOUND IN COMMAND]")
			}
			return(false)
		}

		if("data" in command){
			if(this.development){
				console.log("[WARNING]-[DELETE_CATALOGUE]-['data' IN COMMAND FOUND WHICH IS NOT USEFUL]")
			}
		}

		var json = JSON.parse(fs.readFileSync(path, 'utf8'))
		var deleted = 0
		var ret_json = []
		for(var i=0; i<json.length; i++){
			if(this.is_subset(json[i], command["filter"])){
				deleted += 1
			}
			else{
				ret_json.push(json[i])
			}
		}

		if(this.development){
			console.log("[SUCCESS]-[DELETE_CATALOGUE]-[DELETED "+deleted+" CATALOGUE/S]")
		}

		outputFileSync(path, JSON.stringify(ret_json), 'utf-8');
		return(true);
	}

	replace_catalogue(db_name, exclusive_name, cat_type, command){
		if(!(this.use_catalogue_type(db_name, exclusive_name, cat_type))){
			if(this.development){
				console.log("[ERROR]-[REPLACE_CATALOGUE]-[CATALOGUE TYPE NOT FOUND]")
			}
			return(false)
		}

		var path = this.db_path+"/"+this.DATABASE+"/"+db_name+"/"+exclusive_name+"/"+cat_type+".json"
		var can_db_path = canonical_path.normalize(this.db_path)
		var can_path = canonical_path.normalize(path)
		if(!(can_path.includes(can_db_path))){
			if(this.development){
				console.log("[ERROR]-[REPLACE_CATALOGUE]-[TRYING TO ACCESS FILES BEHIND THE DB PATH]")
			}
			return(false)
		}

		if( (command == null) || (command == {}) ){
			if(this.development){
				console.log("[ERROR]-[REPLACE_CATALOGUE]-[COMMAND NOT FOUND]")
			}
			return(false)
		}
		
		if(command["filter"] == undefined){
			if(this.development){
				console.log("[ERROR]-[REPLACE_CATALOGUE]-['filter' NOT FOUND IN COMMAND]")
			}
			return(false)
		}

		if(command["data"] == undefined){
			if(this.development){
				console.log("[ERROR]-[REPLACE_CATALOGUE]-['data' NOT FOUND IN COMMAND]")
			}
			return(false)
		}

		var json = JSON.parse(fs.readFileSync(path, 'utf8'))
		var replaced = 0
		for(var i=0; i<json.length; i++){
			if(this.is_subset(json[i], command["filter"])){
				json[i] = command["data"]
				replaced += 1
			}
		}

		if(this.development){
			console.log("[SUCCESS]-[REPLACE_CATALOGUE]-[REPLACED "+replaced+" CATALOGUE/S]")
		}

		outputFileSync(path, JSON.stringify(json), 'utf-8');
		return(true)
	}

	// =================== PUBLIC METHODS ENDS =========================


}

module.exports = AsteroidDB