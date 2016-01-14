//the default theme used by all class if not expressly defined
Dbmng.defaults.theme=new Dbmng.AbstractTheme();

//the default theme used by all class if not expressly defined
Dbmng.defaults.aParam = {
  ui: {
    btn_edit: {label:'Edit'},
    btn_edit_inline: {label:'Edit inline'},
    btn_delete: {label:'Delete'},
    btn_insert: {label:'Insert'},
    btn_save: {label:'Save'},
    btn_cancel: {label:'Cancel'}
  },
  user_function: {
    inline:0, upd:1, del:1, ins:1
  }
};


console.log(Dbmng.defaults.aParam );
