


jQuery(function(){



	test('esempio',3, function(){

		equals(add(1,1), 2, 'Provare 1+1 ');
		equals(add(33,-3), 30, 'Provare 33-3 ');
		equals(getVal('qunit-fixture'), 'DBMNG HI', 'Il selettore funziona');



	});


	test('dbmng',1, function(){


		idt=1;
		p={'test':1};

		var dbmng=new Dbmng(idt , p);
			

		equals( dbmng.getParam(), p ,'Verifica se il parametro torna bene');

	});

});

// You... need to change all reference of QSA to your library's name.
/*
var PREV_LIBRARY = window.$ = window.DBMNG = {OMG: 'PONIES'};

test('basics', 3, function() {
  ok($, '$ should be.. something');
  ok(DBMNG, 'DBMNG should be.. something');
  equals($, DBMNG, '$ and DBMNG should point to the same thing');
});

test('.noConflict', 7, function() {
  var $$ = $;

  equals(DBMNG, DBMNG.noConflict(), '$.noConflict should return our library');
  equals(DBMNG, $$, 'QSA should still point to our library');
  equals($, PREV_LIBRARY, '$ should be reverted to prev library');

  $ = DBMNG;

  equals(DBMNG, DBMNG.noConflict(true), '$.noConflict should return our library');
  equals($, PREV_LIBRARY, '$ should be reverted to prev library');
  equals(DBMNG, PREV_LIBRARY, 'QSA should be reverted to prev library');

  equals($$('#qunit-fixture'), 'Ciao #qunit-fixture', 'library should still work');

  $ = QSA = $$;
});

// You need to rework this as-needed.
test('DBMNG', 1, function() {
  var elems = DBMNG('Diego');
  equals(elems, 'Ciao Diego', 'testa la funzione');
  //equals(elems[0].innerText, 'OMG HI', 'element has awesome text');

  //var elems = $('#zomgfailplz');
  //equals(elems.length, 0, 'no elements should be selected');
});

// You need to add many, many more unit tests.
*/
