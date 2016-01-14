/////////////////////////////////////////////////////////////////////
// AbstractTheme
// 18 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.AbstractTheme = Class.extend({
  test: function(input){
    return input+2;
  },

  getFieldContainer: function(aField) {
    // console.log(aField);
    var el = document.createElement('div');
    el.className = 'dbmng_form_row';
    el.className = el.className + ' dbmng_form_field_' + aField.field;

    return el;
  },

  getLabel: function(aField) {
    var el=document.createElement('div');
    el.className='dbmng_form_label';

    var lb = document.createElement('label');
    lb.setAttribute('for', 'dbmng_' + aField.field);

    var txt=document.createTextNode(aField.label);
    lb.appendChild(txt);

    if( aField.nullable === false ) {
      var sp = document.createElement('span');
      sp.className='dbmng_required';

      var star=document.createTextNode('*');
      sp.appendChild(star);
      lb.appendChild(sp);
    }

    el.appendChild(lb);
    return el;
  },

  getInput: function(aField) {
    var el=document.createElement('input');
    this.assignAttributes(el, aField);

    if(aField.value) {
      el.value=aField.value;
    }
    if( aField.placeholder ) {
      el.placeholder = aField.placeholder;
    }

//     if( aField.type == 'int' || aField.type == 'bigint' || aField.type == 'float' || aField.type == 'double' ) {
//       el.type = "number";
//       el.onkeypress = function( evt ) {
//         var theEvent = evt || window.event;
//         var key = theEvent.keyCode || theEvent.which;
//         key = String.fromCharCode( key );
//         var regex = /[0-9]|\./;
//         if( !regex.test(key) ) {
//           theEvent.returnValue = false;
//           if(theEvent.preventDefault) theEvent.preventDefault();
//         }
//       };
//     }
    else {
      el.type = "text";
    }

    //if in the option there is a field_type value it will be override the previous one (if the widget is hidden and the type is int it should be hidden)
    if(aField.field_type){
      el.type = aField.field_type;
    }

    return el;
  },
/*
  getPassword: function(aField) {
    var el=document.createElement('input');
    this.assignAttributes(el, aField);
    // console.log(aField);
    el.type = "password";
    if(aField.value) {
      el.value=aField.value;
    }

    if( aField.placeholder ) {
      el.placeholder = aField.label;
    }

    return el;
  },
  */
  getCheckbox: function(aField) {
    var el=document.createElement('input');
    this.assignAttributes(el, aField);
    // console.log(aField);
    el.type = "checkbox";
    if(aField.value == 1 ) {
      el.checked = true;
    }

    //console.log(aField);
    if( aField.placeholder ) {
      el.placeholder = aField.label;
    }

    return el;
  },

  getSelect: function(aField) {
    var el=document.createElement('select');

    this.assignAttributes(el, aField);
    if(aField.voc_val) {
      var o=document.createElement('option');

      if( aField.placeholder ) {
        o.text=aField.label;
        o.disabled = 'disabled';
      }

      el.options.add(o);
      for (var opt in aField.voc_val) {
        o=document.createElement('option');
        o.value = opt;
        o.text=aField.voc_val[opt];
        if( aField.value ) {
					//console.log(aField.value+" "+ opt);
          if( aField.value == opt ) {
            o.selected = true;
          }
        }
        el.options.add(o);
      }
    }
    return el;
  },

  getSelectNM: function(aField) {
    //console.log(aField);
    var out_type = "select";
    var el, o, opt;
    if( aField.out_type == 'checkbox' ) {
      out_type = "checkbox";
    }

    if( out_type == 'select' ) {
      el = document.createElement('select');
      el.multiple = true;

      this.assignAttributes(el, aField);

      if(aField.voc_val) {
        o = document.createElement('option');

        if( aField.placeholder ) {
          o.text = aField.label;
          o.disabled = 'disabled';
        }

        el.options.add(o);
        for (opt in aField.voc_val) {
          o = document.createElement('option');
          o.value = opt;
          o.text = aField.voc_val[opt];
          if( aField.value ) {
            if( typeof aField.value[0] == 'number') {
              opt = parseInt(opt);
            }
            if( aField.value.indexOf(opt) > -1 ) {
              o.selected = true;
            }
          }
          el.options.add(o);
        }
      }
    }
    else if( out_type == 'checkbox' ) {
      console.log(options);
      el = document.createElement('ul');

      this.assignAttributes(el, aField);

      for (opt in aField.voc_val) {
        var li = document.createElement('li');

        var aCB = {type: 'int', widget:'checkbox', theme:this}; // , theme:theme_boot ??
        o = new Dbmng.CheckboxWidget({field:aField.field, aField:aCB});
        o.createField(opt);

        li.appendChild(o.widget);

        var txt = document.createTextNode(aField.voc_val[opt]);
        li.appendChild(txt);
        el.appendChild(li);
      }
    }
    return el;
  },

  assignAttributes: function(el, aField) {
    //console.log(aField);
    //el.setAttribute('id', 'dbmng_' + aField.field);
    if( aField.field ) {
      el.name = aField.field;
    }
    if( aField.nullable === false ) {
      el.required = true;
    }
    if( aField.readonly == 1 ) {
      el.disabled = 'disabled';
    }
    if( aField.classes ) {
			this.addClass(el, aField.classes);
			/*
      var space = "";
      if( el.className.lenght > 0 ) {
        space = " ";
      }
      el.className = el.className + space + ;
			*/
    }

  },
	addClass: function(el, className){
      var space = "";
      if(el.className){
        if( el.className.length > 0 ) {
          space = " ";
        }
      }
      else{
        el.className ="";
      }
      el.className = el.className + space + className;
	},
  addTitle: function(el, title){
      el.title = title;
  },
  getForm: function(opt) {
    var el = document.createElement('form');
    return el;
  },
  getTable: function(opt) {
    var div = document.createElement('div');
    var el = document.createElement('table');
		if( opt.aParam ) {
      if( opt.aParam.ui ) {
        if( opt.aParam.ui.table_class ) {
          this.addClass(el, opt.aParam.ui.table_class);
        }
      }
    }
    if(opt.data){
			el.appendChild(this.getTableHeader(opt));
			var tbody=document.createElement('tbody');
			for(var i=0; i<opt.data.length; i++){
				var row=this.getTableRow({data: opt.data[i], rawData: opt.rawData[i], options:opt.options });
				if(opt.options){
					if(opt.options.assignClass){
						this.addClass(row, "dbmng_row dbmng_row_"+i);
					}
					if(typeof opt.options.addColumn=='function'){
						row.appendChild(opt.options.addColumn({data: opt.data[i], rawData: opt.rawData[i], options:opt.options }));
					}
				}
				tbody.appendChild(row);
			}
			el.appendChild(tbody);
		}
    if(!opt.rawData){
      opt.rawData=opt.data;
    }
		div.appendChild(el);
    return div;
  },
	getTableHeader: function(opt) {
		var el = document.createElement('thead');
		var tr = document.createElement('tr');
		if(opt.header){
				for(var i=0; i<opt.header.length; i++){
					tr.appendChild(this.getTableHCell({content: opt.header[i], options:opt.options}));
				}
		}
		else if(opt.data){
			if(opt.data.length>0){
				for(var key in opt.data[0]){
					tr.appendChild(this.getTableHCell({content: key, options:opt.options}));
				}
			}
		}
		el.appendChild(tr);
		return el;
	},
  getTableRow: function(opt) {
		var el = document.createElement('tr');
		if(opt.data){
			for (var key in opt.data) {
				var cell=this.getTableCell({content: opt.data[key], options:opt.options});
				if(opt.options){
					if(opt.options.assignClass){
						this.addClass(cell, "dbmng_cell dbmng_col_"+key);
					}
					if(typeof opt.options.setIDRow=='function'){
						el.id=opt.options.setIDRow(opt.rawData);
					}
				}
				el.appendChild(cell);
			}
		}
		return el;
	},
  getTableHCell: function(opt) {
		if(!opt){
			opt={};
		}
		var el = document.createElement('th');
		if(opt.content){
				el.appendChild(document.createTextNode(opt.content));
		}
		return el;
	},
  getTableCell: function(opt) {
		if(!opt){
			opt={};
		}
		var el = document.createElement('td');
		if(opt.content){
				el.appendChild(document.createTextNode(opt.content));
		}
		return el;
	},
	getButton: function(text, opt) {
    if( !opt ) {
      opt = {};
    }
    var type='button';
    if(opt.type){
      type=opt.type;
    }

		var el = document.createElement(type);
    if(opt.class){
      this.addClass(el, opt.class);
    }


    if(opt.icon){
      // if( jQuery('i.fa').css('font').indexOf('Awesome')>-1 ) { ... }
      var icn = document.createElement('i');
      this.addClass(icn,opt.icon);
      this.addTitle(icn, text);
      el.appendChild(icn);

      if(opt.label_file){
        var span=document.createElement('span');
        span.appendChild(document.createTextNode(" "+opt.label_file));
        el.appendChild(span);
      }
    }
    else{
      el.appendChild(document.createTextNode(text));
    }
		return el;
	},
  alertMessage: function(text) {
    var el = document.createElement('div');
    this.addClass(el, 'dbmng_alert');
    el.appendChild(document.createTextNode(text));
    return el;
  },
  createFormUpload: function(elv, label, opt){

    //var el = document.createElement('button');
    //this.addClass(el,'fileinput-button');
    if(!opt){
      opt={};
    }
    if(!opt.class){
      opt.class="";
    }
    var el=this.getButton(label,opt);
    this.addClass(el,"fileinput-button");
    el.appendChild(elv);

    return el;


  },
  createProgressBar: function(opt){


    if(!opt){
      opt={};
    }
    if(!opt.class){
      opt.class="";
    }
    var el = document.createElement('div');
    this.addClass(el,opt.class);

    var pr= document.createElement('div');
    this.addClass(pr,"progress-bar progress-bar-success");
    //pr.style.cssText="width:100%";
    el.appendChild(pr);

    return el;


  }


});
