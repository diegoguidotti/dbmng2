/////////////////////////////////////////////////////////////////////
// NumericWidget
// 12 November 2015
// 
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.NumericWidget = Dbmng.AbstractWidget.extend({
  getValue: function() {		
    var el = this._super();
		if(el===''){
			return null;
		}
		else{
			var val=	el*1;
			if(isNaN(val)){
				console.log('entered a text ('+el+') in a numeric value');
				return null;
			}
			else{
				return val;
			}
		}
  }
});

