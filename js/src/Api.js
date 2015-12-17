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
    // this.aForm  = options.aForm;
		this.url=options.url;
		this.user=options.user;
		this.password=options.password;
  },
	getHeaders: function(){
		return {
				"Authorization": "Basic " + btoa(this.user + ":" + this.password)
			};
	},
  select: function(options) {
		jQuery.ajax({
			url: this.url,
			dataType:'json',
			headers: this.getHeaders(),
			success: function(data){
				if(typeof options.success=='function'){
					options.success(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof options.error=='function'){
					options.error(exc);
				}
				console.log(exc);
			}
		});
    //var ret={};
    //return ret;
  },
  transaction: function(options) {
		jQuery.ajax({
			url: this.url+"/transaction",
			dataType:'json',
			method:'POST',
			data: JSON.stringify(options.data),
			headers: this.getHeaders(),
			success: function(data){
				if(typeof options.success=='function'){
					options.success(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof options.error=='function'){
					options.error(exc);
				}
				console.log(exc);
			}
		});
  },insert: function(options) {
		jQuery.ajax({
			url: this.url,
			dataType:'json',
			method:'POST',
			data: JSON.stringify(options.data),
			headers: this.getHeaders(),
			success: function(data){
				if(typeof options.success=='function'){
					options.success(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof options.error=='function'){
					options.error(exc);
				}
				console.log(exc);
			}
		});
  },
  update: function(options) {
    console.log(options.data);
		jQuery.ajax({
			url: this.url+'/'+options.key,
			dataType:'json',
			method:'PUT',
			data: JSON.stringify(options.data),
			headers: this.getHeaders(),
			success: function(data){
				if(typeof options.success=='function'){
					options.success(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof options.error=='function'){
					options.error(exc);
				}
				console.log(exc);
			}
		});
				
  },
  delete: function(options) {
		jQuery.ajax({
			url: this.url+'/'+options.key,
			dataType:'json',
			method:'DELETE',
			headers: this.getHeaders(),
			success: function(data){
				if(typeof options.success=='function'){
					options.success(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof options.error=='function'){
					options.error(exc);
				}
				console.log(exc);
			}
		});
  }
  
});
