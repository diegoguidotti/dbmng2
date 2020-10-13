/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 18 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.SelectNMWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    var self=this;

    this.aField.value = this.getFieldValue();
    this.aField.field = this.field;
    var el, fk;

    var out_type = "select";
    if( self.aField.out_type == 'checkbox' ) {
      out_type = "checkbox";
    }

    if( out_type == 'select' ) {

      el = document.createElement('select');
      el.multiple = true;

      self.theme.assignAttributes(el, self.aField);

      if(self.aField.voc_val) {
        var o = document.createElement('option');

        if( self.aField.placeholder ) {
          o.text = self.aField.label;
          o.disabled = 'disabled';
        }

        el.options.add(o);
        for ( fk in self.aField.voc_val) {
          o = document.createElement('option');

          var text_label="";
          var foreign_key="";
          if( typeof self.aField.voc_val[0] == 'object' ) {
            var object=self.aField.voc_val[fk];
            for (var k in object) {
              foreign_key=k;
              text_label=object[k];
              break;
            }
          }
          else{
              foreign_key=fk;
              text_label=self.aField.voc_val[fk];
          }

          o.value = foreign_key;
          o.text = text_label;
          if( self.aField.value ) {
            if( typeof self.aField.value[0] == 'number') {
              foreign_key = parseInt(foreign_key);
            }
            if( self.aField.value.indexOf(foreign_key) > -1 ) {
              o.selected = true;
            }
          }
          el.options.add(o);
        }
      }
    }
    else if( out_type == 'checkbox' ) {
      el = document.createElement('div');
      var ul = document.createElement('ul');
      ul.id = "ul_"+self.aField.field;

      var search_nm = false;
      if( typeof self.aField.search_nm !== 'undefined' ) {
        var placeholder = "";
        if( typeof self.aField.search_nm_placeholder !== 'undefined' ) {
          placeholder = self.aField.search_nm_placeholder;
        }
        var s = document.createElement('input');
        self.theme.addClass(s, 'dbmng_search_nm');
        self.theme.assignAttributes(s, self.aField);
        s.placeholder = placeholder;

        s.onkeyup = function(txt_search){
          var aRow = jQuery('#ul_'+self.aField.field+' li');
          var txt = txt_search.target.value.toLowerCase();
          if( txt.length > 1){
            jQuery.each(aRow, function(k,row){
              var rowText = jQuery(row).text().toLowerCase();
              if( rowText.search(txt) > -1 ) {
                jQuery(row).show();
              }
              else {
                jQuery(row).hide();
              }
            });
          }
          else {
            jQuery(aRow).show();
          }
        };
        el.appendChild(s);

      }

      self.theme.addClass(ul, 'dbmng_checkbox_ul');
      //self.theme.assignAttributes(el, self.aField);
      if( typeof self.aField.voc_val[0] == 'object' ) {
        jQuery.each(self.aField.voc_val, function(k,v){
          jQuery.each(v, function(index, el) {
            fk = index;
            var li = document.createElement('li');

            var checked=false;
            if( self.aField.value ) {
              if( typeof self.aField.value[0] == 'number') {
                fk = parseInt(index);
              }
              if( self.aField.value.indexOf(fk) > -1 ) {
                checked=true;
              }
            }
            var fvalue=el;
            var opt_checkbox={'checked':checked, 'value':fk, 'label':fvalue, 'exclude_attribute':true};
            li.appendChild(self.theme.getCheckbox(opt_checkbox));

            var txt = document.createTextNode(fvalue);
            li.appendChild(txt);
            ul.appendChild(li);
          });
        });
      }
      else {
        for ( fk in self.aField.voc_val) {
          var li = document.createElement('li');

          var checked=false;
          if( self.aField.value ) {
            if( typeof self.aField.value[0] == 'number') {
              fk = parseInt(fk);
            }
            if( self.aField.value.indexOf(fk) > -1 ) {
              checked=true;
            }
          }
          var fvalue=self.aField.voc_val[fk];

          var opt_checkbox={'checked':checked, 'value':fk, 'label':fvalue, 'exclude_attribute':true};

          li.appendChild(this.theme.getCheckbox(opt_checkbox));

          var txt = document.createTextNode(fvalue);
          li.appendChild(txt);
          ul.appendChild(li);
        }

      }
      el.appendChild(ul);
    }



    // return this.theme.getSelectNM(this.aField);
    return el;
  },
  convert2html: function(val) {
    var self=this;
    var sep="<span class='dbmng_select_nm_sep'>,</span>&nbsp;";
    var ret="";
    var first=true;
    if( typeof val !== 'undefined' ) {
      jQuery.each(val,function(k,v){
        if(!first){
          ret+=sep;
        }
        else{
          first=false;
        }
        if( typeof self.aField.voc_val[0] == 'object' ) {
          jQuery.each(self.aField.voc_val, function(j, obj){
            if( typeof obj == 'object' ) {
              jQuery.each(obj, function(key, value){
                if( key == v ) {
                  ret+="<span class='dbmng_select_nm_item'>"+value+"</span>";
                }
              });
            }
          });
        }
        else {
          ret+="<span class='dbmng_select_nm_item'>"+self.aField.voc_val[v]+"</span>";
        }
      });
      return jQuery("<div>"+ret+"</div>")[0];
    }
  },
  getValue: function(){
    var aVal, aRet;
    var self=this;


    var out_type = "select";
    if( this.aField.out_type == 'checkbox' ) {
      out_type = "checkbox";
    }

    if( out_type == "select" ) {
      if( this.aField.type == 'int' ) {
        aVal = [].concat(jQuery(this.widget).val());

        aRet = [];
        aVal.forEach(function(entry) {
          aRet.push(parseInt(entry));
        });
      }
      else {
        aRet = jQuery(this.widget).val();
      }
    }
    else if( out_type == "checkbox" ) {
      var cb = jQuery(this.widget).find('input[type=checkbox]');
      aVal = [];
      cb.each(function(k,v){
        if( v.checked ) {
          console.log(v.value);
          if(self.aField.type == 'int'){
            aVal.push(parseInt(v.value));
          }
          else{
            aVal.push((v.value));
          }
        }
      });
      aRet = aVal;
    }
    console.log(aRet);
    return aRet;
  }
});
