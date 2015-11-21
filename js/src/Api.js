/////////////////////////////////////////////////////////////////////
// Api The class manage the http call to the DBMNG web services
// 21 November 2015
// 
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.Api = Class.extend({
  //class constructor	
  init: function( options ) {
    this.aForm  = options.aForm;
		this.url=options.url;
		this.user=options.user;
		this.password=options.password;
  },
	getHeaders(){
		return {
				"Authorization": "Basic " + btoa(this.user + ":" + this.password)
			}
	},
  select: function(onSuccess, onFail) {		
		jQuery.ajax({
			url: this.url,
			dataType:'json',
			headers: this.getHeaders(),
			success: function(data){
				if(typeof onSuccess=='function'){
					onSuccess(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof onFail=='function'){
					onFail(data);
				}
				console.log(exc);
			}
		});
    //var ret={};
    //return ret;
  },
  insert: function() {
		throw "Function to be completed"; 
  },
  update: function(key, payload, onSuccess) {
		jQuery.ajax({
			url: this.url+'/'+key,
			dataType:'json',
			method:'PUT',
			data: JSON.stringify(payload),
			headers: this.getHeaders(),
			success: function(data){
				if(typeof onSuccess=='function'){
					onSuccess(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof onFail=='function'){
					onFail(data);
				}
				console.log(exc);
			}
		});
				
  },
  delete: function() {
		throw "Function to be completed"; 
  },
  
});
