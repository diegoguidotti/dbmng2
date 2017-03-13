/////////////////////////////////////////////////////////////////////
// Api The class manage the http call to the DBMNG web services
// 13 February 2017
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.Cms = Class.extend({
  init: function( opt ){
    var self=this;
    self.opt = opt;

    var aehist={
      'change_page': {
        'function':function(state){
          console.log("drawPage_hists");
          var obj=state.data.obj;
          self.drawPage(self.opt.pages[obj.page_id], obj.data);
        }
      }
    };
    self.hist=new Dbmng.History(aehist);
    self.hist.bindStateChange();

  },
  draw: function(){
    var self=this;
    self.drawPage(self.opt.pages[self.opt.home]);
  },
  goto: function(page_id, data){
    var self=this;
    // console.log("Go to page "+page_id);
    // self.drawPage(self.opt.pages[page_id], data);
    self.hist.call('change_page',{'page_id':page_id,'data':data});
  },
  drawPage: function(page, data){
    console.log("Draw Page "+page.title);
    page.data=data;
    var self=this;
    var html="<div class='page_container'>";
    html+="<div class='page_title'>"+page.title+"</div>";
    html+="<div class='page_body'>"+page.body(page, self)+"</div>";
    html+="<div>";
    jQuery(self.opt.div).html(html);

    if(typeof page.actions!=='undefined'){
      jQuery.each(page.actions, function (a){
        jQuery(a).click(function(){
          page.actions[a](self);
        });
      });
    }

    jQuery.each(jQuery('button,a').filter('[data-goto]'), function(k,but){
      jQuery(but).click(function(){
        self.goto(jQuery(but).attr('data-goto'));
      });
    });

  }
});
