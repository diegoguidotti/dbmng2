


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

  test('AbstractWidget',2, function(){
     var widget = new Dbmng.AbstractWidget();
      option = { 
        field:'month',
        aField: {label: 'AAA', 'default':1},
      };
     jQuery('#test_div').html(widget.createField(option));
     equal(jQuery('#test_div input').val(),1, "SelectWidget get default value");

    jQuery('#test_div input').val(33);
     equal(jQuery('#test_div input').val(),33, "Select Widget get jquery assigned value");
      
  });
  
  test('SelectWidget',9, function(){
    /* ---------- test #01 ---------- */
    var select = new Dbmng.SelectWidget();
    option = { 
      field:'month',
      aField: {label: 'Months', widget:'select', voc_val: {1:'January', 2:'February'}, 'default':1},
    };
    select.createField(option);
    jQuery('#test_div').html(select.createField(option));
    equal(jQuery('#test_div select').val(),1, "SelectWidget get default value");
    equal(jQuery('#test_div select').attr('id'),'dbmng_month', "SelectWidget get element basic call");
  
    /* ---------- test #02 ---------- */
    option = { 
      field:'id',
      aField: {label: 'Mounth', widget:'select', voc_val: {1:'January', 2:'February'}},
    };
    select.createField(option);
    jQuery('#test_div').html(select.createField(option));
    equal(jQuery('#test_div select').val(),'', "SelectWidget get null value");
    
    /* ---------- test #03 ---------- */
    option = { 
      field:'id',
      aField: {label: 'Mounth', widget:'select', voc_val: {1:'January', 2:'February',33:'Utbuarry'}},
      value: 2
    };
    select.createField(option);
    jQuery('#test_div').html(select.createField(option));
    equal(jQuery('#test_div select').val(),2, "SelectWidget get value (update)");


    equal(select.getValue() ,2, "test widget.getValue() using default ");
    jQuery('#test_div select').val(33);
    equal(select.getValue() ,33, "test widget.getValue() using assigned value ");
    
    
    
    /* ---------- test #04 ---------- */
    var theme_boot = new Dbmng.BootstrapTheme();
    option = { 
      field:'id',
      aField: {label: 'Mounth', widget:'select', voc_val: {1:'January', 2:'February'}},
      value: 2
    };


    var selectb = new Dbmng.SelectWidget({theme:theme_boot});
    select.createField(option);
    jQuery('#test_div').html(selectb.createField(option));
    equal(jQuery('#test_div select').hasClass('form-control'),true, "BootstrapTheme check form-control class");
    equal(jQuery('#test_div select').val(),2, "SelectWidget get value (update)");
    equal(jQuery('#test_div select').attr('id'),'dbmng_id', "SelectWidget get element id");
  });
});

