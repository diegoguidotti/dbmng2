/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.AutocompleteWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field_type='hidden';
    return this.theme.getInput(this.aField);
  },
  createField: function(data_val){
    var self=this;
    var el = this._super(data_val);

    var aVField = {};
    aVField.field = this.aField.field + '_view';
    aVField.classes = 'typeahead';

    var elv = this.theme.getInput(aVField);
    el.appendChild(elv);
    if( typeof Bloodhound !== 'undefined'){
      var provider = new Bloodhound({
        datumTokenizer: function (data) {
            console.log('datumToken');
            //console.log(data);
              return Bloodhound.tokenizers.whitespace('<b>'+data[1]+"</b>: "+data[3]);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          url: self.aField.url,
          wildcard: '%QUERY',
          transform: function (data){
            var label=[];
            jQuery.each(data.data, function(k,v){
              label.push(v);
            });
            return (label);
          }
        }
      });

      if( data_val !== '' && typeof data_val !== 'undefined' ) {
        if( data_val !== '' ) {
          provider.search(data_val,function(d){self.autocomplete_get(d,elv);},function(d){self.autocomplete_get(d,elv);});
        }
        console.log(data_val);
      }

      var fkey = "key";
      if( self.aField.autocomplete_key ) {
        fkey = self.aField.autocomplete_key;
      }

      var flabel = "label";
      if( self.aField.autocomplete_fieldname ) {
        flabel = self.aField.autocomplete_fieldname;
      }

      var not_found = "Not found ";
      if( self.aField.not_found ) {
        not_found = self.aField.not_found;
      }
      jQuery(elv).typeahead(
        {   hint: true,   highlight: true,   minLength: 0 },
        {
          name: self.aField.autocomplete_fieldname,
          source: provider,
          limit: 100,
          display: self.aField.autocomplete_fieldname,
          templates: {
            header: '',
            notFound: function(q){
              return not_found+' <b>'+q.query+"<b>";
            },
            suggestion: Handlebars.compile('<div>{{'+flabel+'}}</div>')
          }
        });

      jQuery(elv).bind('typeahead:select', function(ev, suggestion){
        console.log(self);
        console.log(suggestion);
        console.log(fkey);
        console.log(suggestion[fkey]);
        self.widget.value = suggestion[fkey];
      });
    }
    else {
      el.appendChild(jQuery("<div class='alert alert-danger'><strong>DBMNG2 Error!</strong><p>Bloodhound library is not loaded</p></div>")[0]);
    }
    return el;
  },

  autocomplete_get: function(val,elv){
    console.log(val);
    if(val.length>0){
      var label= val[0][this.aField.autocomplete_fieldname];
      elv.value=label;
      console.log(label);
    }
    // console.log(val[0][this.aField.autocomplete_fieldname]);
  }
});
