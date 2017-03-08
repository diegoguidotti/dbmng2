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
    var el, opt;

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
        for (opt in self.aField.voc_val) {
          o = document.createElement('option');
          o.value = opt;
          o.text = self.aField.voc_val[opt];
          if( self.aField.value ) {
            if( typeof self.aField.value[0] == 'number') {
              opt = parseInt(opt);
            }
            if( self.aField.value.indexOf(opt) > -1 ) {
              o.selected = true;
            }
          }
          el.options.add(o);
        }
      }
    }
    else if( out_type == 'checkbox' ) {
      //console.log(options);
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
          console.log("change:"+txt_search.target.value);
        };
        el.appendChild(s);

      }

      self.theme.addClass(ul, 'dbmng_checkbox_ul');
      //self.theme.assignAttributes(el, self.aField);

      for (opt in self.aField.voc_val) {
        var li = document.createElement('li');

        var fk=opt;
        var fvalue=self.aField.voc_val[opt];
        var sel_values=this.aField.value;

        var checked=false;
        if(sel_values.indexOf(fk)>-1){
          checked=true;
        }
        var opt_checkbox={'checked':checked, 'value':fk, 'label':fvalue, 'exclude_attribute':true};

        li.appendChild(this.theme.getCheckbox(opt_checkbox));

        var txt = document.createTextNode(fvalue);
        li.appendChild(txt);
        ul.appendChild(li);
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
        ret+="<span class='dbmng_select_nm_item'>"+self.aField.voc_val[v]+"</span>";
      });
      return jQuery("<div>"+ret+"</div>")[0];
    }
  },
  getValue: function(){
    var aVal, aRet;
    console.log(this.aField);
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
          aVal.push(parseInt(v.value));
        }
      });
      aRet = aVal;
    }
    console.log(aRet);
    return aRet;
  }
});
