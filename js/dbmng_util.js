var DBMNG_DEBUG=true;

if(typeof window.console == 'undefined') { window.console = {log: function (msg) {} }; }

function dbmng_log(d){
	if(DBMNG_DEBUG){
		console.log(d);
	}	
}

function t(txt){
	return txt;
}

