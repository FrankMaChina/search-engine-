var lasttime;
var pressdownkey = 0;
var ajaxdata;
(function($){
	$.fn.pluginsearch = function(address) {
		var me = this;
		var serdataname;
		$.ajax({url:address,async:false,dataType:"json",type:"GET",dataFilter:function(data){
			
			ajaxdata = JSON.parse(data);
			
			}});
		
		// serdataname = ajaxdata + "." + filename;
		// alert("serdataname==="+serdataname);
		me.on("keydown",function(event){
			
			me.starsearch((ajaxdata.moviename),me);//改地址
			me.choiceaim(event);
		});
		console.log("3");
		return this;
	}
})(jQuery);

(function($){
	$.fn.starsearch = function (dataname,node) {
		var me = this;
		if(lasttime) {
		clearTimeout(lasttime);
	}
	lasttime = setTimeout(function() {
		me.comparadata(dataname,node);
		setTimeout(me.addstyle, 1);
		
	},300);
	me.eventmenu();
	}
})(jQuery);
(function($){
	$.fn.choiceaim = function(event) {
		var hasmenu = $("#menu").find("[name='listdata']");
		if(pressdownkey >= hasmenu.length || (hasmenu.length == 0)){
			pressdownkey = 0;
		}
		if(hasmenu.length != 0){
			if(event.which == 40 && (pressdownkey < hasmenu.length)){
				if(pressdownkey != 0){

					hasmenu.eq(pressdownkey - 1).removeClass("keychoice");
				}
				//alert("choiceaim----->run"+hasmenu.eq(pressdownkey).text());
				hasmenu.eq(pressdownkey).addClass("keychoice");
				pressdownkey += 1;
			}
			else if (event.which == 38 && (pressdownkey > 0)) {
				if (pressdownkey != 0) {
					hasmenu.eq(pressdownkey).removeClass("keychoice");
				}
				pressdownkey = pressdownkey - 1;
				hasmenu.eq(pressdownkey).addClass("keychoice");
			}
		}
	}
})(jQuery);
(function($){
	$.fn.comparadata = function(serverdata,node) {
		var me = this;
		var customdata = me.getvalue(node);
		var servercontent;
		var comparaPinyin;
		var usecontent;
		var getdatacontent = [];
		var getdataPinyin = [];
		var getdatalink = [];
		var getdatahot = [];
		for(var i = 0;i<serverdata.length;i++){
			servercontent = serverdata[i].content.indexOf(customdata);
			if(customdata != null){
				comparaPinyin = serverdata[i].Pinyin.substring(0,customdata.length).indexOf(customdata);
			}
			else{
				comparaPinyin = -1;
			}
			console.log("comparaPinyin====="+serverdata[i].Pinyin);
			if(((servercontent != -1)||(comparaPinyin != -1)) && customdata != null){
				
				getdatacontent.push(serverdata[i]);
			}

		}

		var sortedDatas = getdatacontent.sort(function(a, b){
			if (a.hot > b.hot) {
				return -1;
			} else if (a.hot < b.hot){
				return 1;
			}
			return 0;
		})

		me.showdata(sortedDatas,node);
	}
})(jQuery);

(function($){
	$.fn.getvalue = function(node){
		var intercontent = node.val();
		
		if(intercontent == ""){
			return null;
		}
		return intercontent;
		}
})(jQuery);
(function($){
	$.fn.showdata = function(getdatacontent,node) {
		var me = this;
		me.creatNode(node);

		var findshowdata = $("#menu").find("[name='showdata']");//该过
	
		
		//creatNode(node);
		
		if((getdatacontent.length == 0) || (node.val() == "")){
			
			$("#menu").remove();
		}
		else{
			for(var i = 0;i < getdatacontent.length;i++){
				if (findshowdata.length == 0) {
					var menuli = $("<li></li>").addClass("listyle").attr("name","listdata");
					var datalink = $("<a></a>").addClass("linkstyle").attr({"href":getdatacontent[i].url,"name":"showdata"});
					menuli.text(getdatacontent[i].content);
					$("#menuul").append(datalink);
					datalink.append(menuli);
				}
				else if(findshowdata.length != 0){

					me.changeinterdata(getdatacontent);
				 }
			}
		}
	}
})(jQuery);
(function($){
	$.fn.creatNode = function(node) {
		var bindingwidth = node.css("width");
		var bindingoffet = node.offset().left;
		
		var hasmenu = $("#bodydiv").find("#menu");

		var databody = $("<div></div>").attr("id","menu").addClass("menustyle").css({"width":bindingwidth,"left":(bindingoffet+"px")});
		var bodyul = $("<ul></ul>").attr("id","menuul").addClass("ulstyle");
		if(hasmenu.length == 0){
			
			node.after(databody);
		}
		var hasul = $("#menu").find("#menuul");
		console.log("hasul==="+hasul);
		if(hasul.length == 0){
			
			databody.append(bodyul);
		}
	}
})(jQuery);
(function($){
	$.fn.changeinterdata = function(data) {
		var findshowdata = $("#menu").find("[name='listdata']");
		var datacomm = [];
		var datalong = data.length - findshowdata.length;
		if(datalong > 0) {
			console.log("datalong>0 --->222");
			for (var i = 0; i < findshowdata.length; i++) {
				for (var j = 0; j < data.length; j++) {

					if (findshowdata.eq(i).text() != data[j].content) {
						console.log("datalong>0 --->333");
						continue;
					}

					else {
						console.log("datalong>0 --->444");
						data.splice(j,1);
						break;
					}
				}
			}
			if(data.length != 0){
				console.log("datalong>0 --->555");
				
				for (var i = 0; i < data.length; i++) {

					var menuli = $("<li></li>").addClass("listyle").attr("name","listdata");
					var datalink = $("<a></a>").addClass("linkstyle").attr({"href":data[i].url,"name":"showdata"});
					menuli.text(data[i].content);
					$("#menuul").append(datalink);
					datalink.append(menuli);
				}
			}
		}
		else if(datalong < 0){
			console.log("datalong<0 --->");
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < findshowdata.length; j++) {

					if (data[i].content != findshowdata.eq(j).text()) {
						console.log("000000--->");
						findshowdata.eq(j).remove();
						continue;
					}
					
				}
			}
		}
	}
})(jQuery);
(function($){
	$.fn.addstyle = function(){
		$("#menu").removeClass("hidemenu").addClass("showmenu");
	}
})(jQuery);
(function($){
	$.fn.hidetyle = function(event){
		$("#menu").removeClass("hidemenu").addClass("showmenu");

		event.stopPropagation();
		
	}
})(jQuery);
(function($){
	$.fn.togglemenu = function(event) {
		var hasmenu = $("#bodydiv").find("#menu");
		
		if(hasmenu != 0){
			$("#menu").removeClass("showmenu").addClass("hidemenu");

		}
		event.stopPropagation();
	}
})(jQuery);
(function($){
	$.fn.eventmenu = function() {
		var me = this;
		$("#comment").on("click",function(event){
		 me.hidetyle(event);
		
		});
		$("#bodydiv").on("click",function(event){
			me.togglemenu(event)
			
		});
		}
})(jQuery);
