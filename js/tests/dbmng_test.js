


jQuery(function(){

  test('basic test', function() {
    expect(1);
    ok(true, 'this had better work.');
  });

  
  test('AbstractTheme',4, function(){
    var theme=new Dbmng.AbstractTheme();
    equal(theme.test(2),4, "Trivial test");

    jQuery('#test_div').html(theme.getInput({'value':'pippo'}));
    equal(jQuery('#test_div input').val(),'pippo', "AbstractTheme input get value");

    jQuery('#test_div').html(theme.getInput({}));
    equal(jQuery('#test_div input').val(),'', "AbstractTheme input empty value");
    
    jQuery('#test_div').html(theme.getSelect({value: 2, voc_val: {1:'January', 2:'February'}}));
    equal(jQuery('#test_div select').val(),2, "AbstractTheme select get value");

  });

  
  test('BootstrapTheme',2, function(){
    var theme=new Dbmng.BootstrapTheme();
    
    jQuery('#test_div').html(theme.getInput({'value':'pippo'}));
    equal(jQuery('#test_div input').val(),'pippo', "BootstrapTheme input get value");

    jQuery('#test_div').html(theme.getInput({}));
    equal(jQuery('#test_div input').hasClass('form-control'),true, "BootstrapTheme check form-control class");
    
  });

  
  test('AbstractWidget',10, function(){
    var option = { 
      field:'month',
      aField: {label: 'AAA', 'default':1},
    };
    var widget = new Dbmng.AbstractWidget(option);
    jQuery('#test_div').html(widget.createField());
    equal(jQuery('#test_div input').val(),1, "AbstractWidget get default value");
    equal(jQuery('#test_div input').attr('id'),'dbmng_month', "AbstractWidget get id attribute");

    jQuery('#test_div input').val(33);
    equal(jQuery('#test_div input').val(),33, "(jQuery) get jquery assigned value");
    equal(widget.getValue(),33, "(gatValue) get assigned value");
    
    var option = { 
      field:'fld',
      aField: {label: 'BBB'},
    };
    var widget2 = new Dbmng.AbstractWidget(option);
    jQuery('#test_div').html(widget2.createField());
    equal(jQuery('#test_div .dbmng_form_row #dbmng_fld').val(),'', "AbstractWidget get null value");
    
    var option = { 
      field:'fld',
      aField: {label: 'BBB'},
    };
    var widget3 = new Dbmng.AbstractWidget(option);
    jQuery('#test_div').html(widget3.createField(20));
    equal(jQuery('#test_div .dbmng_form_row #dbmng_fld').val(),20, "AbstractWidget createField(20)");
    equal(widget3.getValue(),20, "(gatValue) get assigned value");
    equal(jQuery('#test_div input').hasClass('form-control'),false, "No class");
    
    var theme_boot = new Dbmng.BootstrapTheme();
    var option = { 
      field:'fld',
      aField: {label: 'BBB'},
      theme: theme_boot
    };
    var widget4 = new Dbmng.AbstractWidget(option);
    jQuery('#test_div').html(widget4.createField(20));
    equal(jQuery('#test_div input').hasClass('form-control'),true, "BootstrapTheme check form-control class");
    equal(widget4.aField,option.aField, "Check aField array");
    
  });
  
  test('PasswordWidget',10, function(){
    var option = { 
      field:'password',
      aField: {label: 'insert the password', default:'bar'},
    };
    var widget = new Dbmng.PasswordWidget(option);
    jQuery('#test_div').html(widget.createField());
    equal(jQuery('#test_div input').val(),'bar', "PasswordWidget get default value");
    equal(jQuery('#test_div input').attr('id'),'dbmng_password', "PasswordWidget get id attribute");

    jQuery('#test_div input').val('test');
    equal(jQuery('#test_div input').val(),'test', "(jQuery) get jquery assigned value");
    equal(widget.getValue(),'test', "(gatValue) get assigned value");
    
    var option = { 
      field:'password',
      aField: {label: 'insert the password'},
    };
    var widget4 = new Dbmng.PasswordWidget(option);
    jQuery('#test_div').html(widget4.createField());
    equal(jQuery('#test_div .dbmng_form_row #dbmng_password').val(),'', "PasswordWidget get null value");
    
    var option = { 
      field:'password',
      aField: {label: 'insert the password'},
    };
    var widget2 = new Dbmng.AbstractWidget(option);
    jQuery('#test_div').html(widget2.createField('foo'));
    equal(jQuery('#test_div .dbmng_form_row #dbmng_password').val(),'foo', "PasswordWidget createField('foo')");
    equal(widget2.getValue(),'foo', "(gatValue) get assigned value");
    equal(jQuery('#test_div input').hasClass('form-control'),false, "No class");
    
    var theme_boot = new Dbmng.BootstrapTheme();
    var option = { 
      field:'password',
      aField: {label: 'insert the password'},
      theme: theme_boot
    };
    var widget3 = new Dbmng.AbstractWidget(option);
    jQuery('#test_div').html(widget3.createField('foo'));
    equal(jQuery('#test_div input').hasClass('form-control'),true, "BootstrapTheme check form-control class");
    equal(widget3.aField,option.aField, "Check aField array");
  });
  
  
  test('SelectWidget',9, function(){
    /* ---------- test #01 ---------- */
    var option = { 
      field:'month',
      aField: {label: 'Months', widget:'select', voc_val: {1:'January', 2:'February'}, 'default':1},
    };
    var select = new Dbmng.SelectWidget(option);
    // select.createField();
    jQuery('#test_div').html(select.createField());
    equal(jQuery('#test_div select').val(),1, "SelectWidget get default value");
    equal(jQuery('#test_div select').attr('id'),'dbmng_month', "SelectWidget get id attribute");
  
    /* ---------- test #02 ---------- */
    option = { 
      field:'id',
      aField: {label: 'Mounth', widget:'select', voc_val: {1:'January', 2:'February'}},
    };
    var select2 = new Dbmng.SelectWidget(option);
    // select.createField(option);
    jQuery('#test_div').html(select2.createField(option));
    equal(jQuery('#test_div select').val(),'', "SelectWidget get null value");
    
    /* ---------- test #03 ---------- */
    option = { 
      field:'id',
      aField: {label: 'Mounth', widget:'select', voc_val: {1:'January', 2:'February',33:'Utbuarry'}}
    };
    var select3 = new Dbmng.SelectWidget(option);
    jQuery('#test_div').html(select3.createField(2));
    equal(jQuery('#test_div select').val(),2, "SelectWidget get value (update)");


    equal(select3.getValue() ,2, "test widget.getValue() using default ");
    jQuery('#test_div select').val(33);
    equal(select3.getValue() ,33, "test widget.getValue() using assigned value ");
    
    
    
    /* ---------- test #04 ---------- */
    var theme_boot = new Dbmng.BootstrapTheme();
    option = { 
      field:'id',
      aField: {label: 'Mounth', widget:'select', voc_val: {1:'January', 2:'February'}},
      theme: theme_boot
    };


    var selectb = new Dbmng.SelectWidget(option);
    jQuery('#test_div').html(selectb.createField(2));
    equal(jQuery('#test_div select').hasClass('form-control'),true, "BootstrapTheme check form-control class");
    equal(jQuery('#test_div select').val(),2, "SelectWidget get value (update)");
    equal(jQuery('#test_div select').attr('id'),'dbmng_id', "SelectWidget get element id");
  });

  test('SelectNMWidget', 4, function() {
    var option = { 
      field:'monthnm',
      aField: {label: 'Months', widget:'select_nm', voc_val: {1:'January', 2:'February', 3: 'March'}},
    };
    var select = new Dbmng.SelectNMWidget(option);
    jQuery('#test_div').html(select.createField());
    equal(jQuery('#test_div select').val(),null, "SelectNMWidget get default value");
    equal(jQuery('#test_div select').attr('id'),'dbmng_monthnm', "SelectNMWidget get id attribute");
  
    var option = { 
      field:'monthnm',
      aField: {label: 'Months', widget:'select_nm', voc_val: {1:'January', 2:'February', 3: 'March'}},
    };
    var select = new Dbmng.SelectNMWidget(option);
    jQuery('#test_div').html(select.createField([1,3]));
    equal(select.getValue(),["1","3"], "SelectNMWidget get default value");
  
    var option = { 
      field:'monthnm',
      aField: {label: 'Months', type: 'int', widget:'select_nm', voc_val: {1:'January', 2:'February', 3: 'March'}},
    };
    var select = new Dbmng.SelectNMWidget(option);
    jQuery('#test_div').html(select.createField([1,3]));
    equal(select.getValue(),[1, 3], "SelectWidget get default value");
    
  });
  
  test('CheckWidget',9, function(){
    var option = { 
      field:'check',
      aField: {label: 'Check', default:true},
      widget: 'checkbox'
    };
    var widget = new Dbmng.CheckboxWidget(option);
    jQuery('#test_div').html(widget.createField());
    equal(jQuery('#test_div input').val(),'true', "CheckboxWidget get default value");
    equal(jQuery('#test_div input').attr('id'),'dbmng_check', "CheckboxWidget get id attribute");

    jQuery('#test_div input').val(false);
    equal(jQuery('#test_div input').val(),'false', "(jQuery) get jquery assigned value");
    equal(widget.getValue(),false, "(getValue) get assigned value");
    
    var option = { 
      field:'check',
      aField: {label: 'Check'},
      widget: 'checkbox'
    };
    var widget2 = new Dbmng.CheckboxWidget(option);
    jQuery('#test_div').html(widget2.createField(true));
    equal(jQuery('#test_div .dbmng_form_row #dbmng_check').val(),'true', "CheckboxWidget createField(true)");
    equal(widget2.getValue(),true, "(getValue) get assigned value");
    equal(jQuery('#test_div input').hasClass('form-control'),false, "No class");
    
    var theme_boot = new Dbmng.BootstrapTheme();
    var option = { 
      field:'check',
      aField: {label: 'Check'},
      widget: 'checkbox',
      theme: theme_boot
    };
    var widget3 = new Dbmng.CheckboxWidget(option);
    jQuery('#test_div').html(widget3.createField(false));
    equal(jQuery('#test_div input').hasClass('form-control'),true, "BootstrapTheme check form-control class");
    equal(widget3.aField,option.aField, "Check aField array");
  });
  
  
});

