

function add(a, b){
	return a+b;
}


function getVal(sel){
		console.log(jQuery('#'+sel));
		console.log(jQuery('#'+sel).html());
		return (jQuery('#'+sel).html());
		//return "aaa";
}


function Dbmng(idt , p) {
  this.id_table = idt;
  this.aData = {'records': new Array()};
	//setup parameters
  this.aParam = p;
}


/////////////////////////////////////////////////////////////////////////////
// Dbmng.prototype.start
// ======================
/// search for the data to the server and, if founded, create the table
/**
*/
Dbmng.prototype.getParam = function()
{
	return this.aParam;
}
