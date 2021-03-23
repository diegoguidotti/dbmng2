//# Use the DBMNG library to easily create forms and crud interface
'use strict';

/*  */
/*  */

// ### create a simple form
/*
// create a div with an ID
<div id="test_dbmng"></div>
*/
//create an aForm object containing the form definition
var aForm={
  "primary_key": ['id_test'],
  "table_name": 'test',
  "fields":{
    "id_test": {"label": "ID", "type": "int","key":1},
    "name": {"label": "Name", "type": "varchar"}
  }
};

//create the form object, create the form html and append it to the width
var form = new Dbmng.Form({aForm:aForm});
var form_html=form.createForm();
document.getElementByID('test_dbmng').append(form_html);

//Edit the form and get the value
var ret=form.getValue();
console.log(ret);

// ### create a complex form

//just create a complex aform
var aForm={
  "primary_key": ['id_test'],
  "table_name": 'test',
  "fields":{
    "id_id_test": {"label": "ID", "type": "int","key":1,"readonly":true, "widget":"hidden"},
    "data_mon": {"label": "Date", "type": "date","widget":"hidden","readonly":true},
    "id_mon_point": {"label": "Mon Points", "type": "int", "widget":"hidden", "readonly":true, "voc_val":{'2043':'Point1', '2045':'Point2'}},
    "traps": {"label": "Traps", "type": "int"},
    "fruit_damage": {"label": "Damage on fruits", type: "checkbox", widget:"checkbox"},
    "comments": {"label": "Comments", "type": "varchar"}
  }
};
var form = new Dbmng.Form({aForm:aForm});
document.getElementByID('test_dbmng').appendform.createForm();
var ret=form.getValue();
console.log(ret);
