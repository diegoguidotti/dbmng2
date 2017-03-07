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
    var el;

    var out_type = "select";
    if( self.aField.out_type == 'checkbox' ) {
      out_type = "checkbox";
    }
    if( out_type == 'select' ) {
      // el = document.createElement('select');
      // el.multiple = true;
      //
      // this.assignAttributes(el, aField);
      //
      // if(aField.voc_val) {
      //   o = document.createElement('option');
      //
      //   if( aField.placeholder ) {
      //     o.text = aField.label;
      //     o.disabled = 'disabled';
      //   }
      //
      //   el.options.add(o);
      //   for (opt in aField.voc_val) {
      //     o = document.createElement('option');
      //     o.value = opt;
      //     o.text = aField.voc_val[opt];
      //     if( aField.value ) {
      //       if( typeof aField.value[0] == 'number') {
      //         opt = parseInt(opt);
      //       }
      //       if( aField.value.indexOf(opt) > -1 ) {
      //         o.selected = true;
      //       }
      //     }
      //     el.options.add(o);
      //   }
      // }
    }
    else if( out_type == 'checkbox' ) {
      //console.log(options);
      el = document.createElement('ul');

      self.theme.addClass(el, 'dbmng_checkbox_ul');
      //self.theme.assignAttributes(el, self.aField);

      for (var opt in self.aField.voc_val) {
        var li = document.createElement('li');

        var fk=opt;
        var fvalue=self.aField.voc_val[opt];
        var sel_values=this.aField.value;

        // var aCB = {type: 'int', widget:'checkbox', theme:this}; // , theme:theme_boot ??
        // o = new Dbmng.CheckboxWidget({field:aField.field, aField:aCB});
        // o.createField(opt);
        //
        // li.appendChild(o.widget);
        var checked=false;
        if(sel_values.indexOf(fk)>-1){
          checked=true;
        }
        var opt_checkbox={'checked':checked, 'value':fk, 'label':fvalue};

        li.appendChild(this.theme.getCheckbox(opt_checkbox));

        var txt = document.createTextNode(fvalue);//"FK:|"+fk+"|"+fvalue+"|"+sel_values+"|");
        li.appendChild(txt);
        el.appendChild(li);
      }
    }



    // return this.theme.getSelectNM(this.aField);
    return el;
  },
  convert2html: function(val) {
    var self=this;
    var sep="<span class='dbmng_select_nm_sep'>,</span>&nbsp;";
    var ret="";
    var first=true;
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
      var cb = jQuery(this.widget).children('li').children();
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
