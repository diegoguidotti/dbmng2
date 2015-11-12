


jQuery(function(){

  test('basic test', function() {
    expect(1);
    ok(true, 'this had better work.');
  });

  test('AbstractTheme',3, function(){
    var theme=new Dbmng.AbstractTheme();
    equal(theme.test(2),4, "Trivial test");

    jQuery('#test_div').html(theme.getInput({'value':'pippo'}));
    equal(jQuery('#test_div input').val(),'pippo', "AbstractTheme input get value");

    jQuery('#test_div').html(theme.getInput({}));
    equal(jQuery('#test_div input').val(),'', "AbstractTheme input empty value");
    
  });

  test('BootstrapTheme',2, function(){
    var theme=new Dbmng.BootstrapTheme();
    
    jQuery('#test_div').html(theme.getInput({'value':'pippo'}));
    equal(jQuery('#test_div input').val(),'pippo', "BootstrapTheme input get value");

    jQuery('#test_div').html(theme.getInput({}));
    equal(jQuery('#test_div input').hasClass('form-control'),true, "BootstrapTheme check form-control class");
    
  });

  
  //jQuery('#test_div input').html('');
});

