/*!*******************************************************************************
*! FILE NAME   : panorama_preview.js
*! DESCRIPTION : panorama previewer's js functions
*! REVISION    : 1.00
*! AUTHOR      : Oleg Dzhimiev <oleg@elphel.com>
*! Copyright (C) 2012 Elphel, Inc
*! -----------------------------------------------------------------------------**
*!  This program is free software: you can redistribute it and/or modify
*!  it under the terms of the GNU General Public License as published by
*!  the Free Software Foundation, either version 3 of the License, or
*!  (at your option) any later version.
*!
*!  This program is distributed in the hope that it will be useful,
*!  but WITHOUT ANY WARRANTY; without even the implied warranty of
*!  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*!  GNU General Public License for more details.
*!
*!  The four essential freedoms with GNU GPL software:
*!  * the freedom to run the program for any purpose
*!  * the freedom to study how the program works and change it to make it do what you wish
*!  * the freedom to redistribute copies so you can help your neighbor
*!  * the freedom to distribute copies of your modified versions to others
*!
*!  You should have received a copy of the GNU General Public License
*!  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*! -----------------------------------------------------------------------------**
*/

var baseWidth = 200;
var baseHeight = 150;

var W = 2592;
var H = 1944;

var load_counter = 0;

var settings_file = "settings.xml";

// sort 
var cams = [
  {"ip":"192.168.0.161","port":2326,"channel":3,"master":0,"logger":0,"index":4},
  {"ip":"192.168.0.161","port":2325,"channel":2,"master":0,"logger":0,"index":3},
  {"ip":"192.168.0.161","port":2323,"channel":0,"master":0,"logger":1,"index":1},
  {"ip":"192.168.0.161","port":2324,"channel":1,"master":0,"logger":0,"index":2},
  {"ip":"192.168.0.162","port":2326,"channel":3,"master":0,"logger":0,"index":8},
  {"ip":"192.168.0.162","port":2325,"channel":2,"master":0,"logger":0,"index":7},
  {"ip":"192.168.0.162","port":2323,"channel":0,"master":0,"logger":0,"index":5},
  {"ip":"192.168.0.162","port":2324,"channel":1,"master":0,"logger":0,"index":6},
  {"ip":"192.168.0.163","port":2325,"channel":2,"master":1,"logger":0,"index":9},
  {"ip":"192.168.0.163","port":2326,"channel":3,"master":0,"logger":0,"index":10}
];

var cnv;
var cContext;
var refresh_counter=0;
var CurrentImageNumber=0;

var image_name = new Array(8);

// globals for map
var osm_markers = new Array();
var kml_response;
var map_points = new Array();
var N=0;

$(function(){

    get_dates();
    
    osm_init();
  
    // init canvas
    cnv = document.getElementById('canvas');
    cContext = cnv.getContext('2d');
    cnv.setAttribute('width',baseHeight*8);cnv.setAttribute('height',baseWidth*3);
  
    // init hidden canvases
    for(var i=0;i<cams.length;i++){
      append_hidden_div(i);
    }

    //rewriteURL();
    //read_settings();
});

function append_hidden_div(index){
  el = $("<div>",{
    id: "div_"+index
  }).css({
    //position: "absolute",
    //top: "1000px",
    //left: (index*200)+"px",
    display: "none"
  });
    
  el.attr("index",index);
  
  el.on("canvas_ready",function(){
      //can draw on main canvas
      var cnv = $(this).find("#display")[0];
      var index = $(this).attr("index");
    
      draw_image(cnv,index);
      
      load_counter++;
      if (load_counter==8){
        //clear 
        clearInterval(intvl);
        document.getElementById('status').innerHTML= "Done.";
      }
  });
  
  $("body").append(el);
}

function remove_hidden_div(index){
  $("#div_"+index).off("canvas_ready");
  $("#div_"+index).remove();
}

function draw_image(img,index){
  var w = baseWidth;
  var h = baseHeight;
  
  index = +index;
  
  var dx = Array(0,1,4);
  var dw = Array(0,0,4);
  
  cContext.rotate(90*Math.PI/180);
  if (index%2==0) {
    //drawImage        img   sx,sy,  sw,sh,     dx,dy,          dw,dh
    cContext.drawImage(img,  0,0*h+dx[0],  w,h-dw[0],  0*w,-1*h*(index+1),  w,h);
    cContext.drawImage(img,  0,1*h+dx[1],  w,h-dw[1],  1*w,-1*h*(index+1),  w,h);
    cContext.scale(-1,1);
    cContext.drawImage(img,  0,2*h+dx[2],  w,h-dw[2], -3*w,-1*h*(index+1), w, h);
    cContext.scale(-1,1);
  }else{
    cContext.scale(1,-1); //mirror is needed
    cContext.drawImage(img,  0,0*h+dx[0],  w,h-dw[0], 0*w,index*h,w,h);
    cContext.drawImage(img,  0,1*h+dx[1],  w,h-dw[1], 1*w,index*h,w,h);
    cContext.scale(-1,1);
    cContext.drawImage(img,  0,2*h+dx[2],  w,h-dw[2], -3*w,h*(index),w,h);
    cContext.scale(-1,1);
    cContext.scale(1,-1);
  }
  cContext.rotate(-90*Math.PI/180);
}


function refresh_images(){
  
    refresh_counter=0;
    intvl=setInterval("refresh_time()",500);
    
    image_full_name($('#input_date_list').attr('value'),$("#input_image_number").val());
    
}

function refresh_time() {
    refresh_counter++;

    if      (refresh_counter%3==1) document.getElementById('status').innerHTML = "Working.";
    else if (refresh_counter%3==2) document.getElementById('status').innerHTML = "Working..";
    else                           document.getElementById('status').innerHTML = "Working...";

    if (refresh_counter==120) {
	clearInterval(intvl);
	refresh_counter=0;
	document.getElementById('status').innerHTML = "Timeout.";
    }
}
    
var images_list;

function image_full_name(folder, image_number) {
  
    $.ajax({
      url: "./panorama_preview.php?type=jp4&folder=/data/footage/"+folder,
      success: function(data){
        images_list = $(data).find("f");
        
        var mode = "jp4";
        if ($("#jpeg_mode").attr("checked")) mode = "jpeg";
        
        for (var i=0;i<8;i++) {
            var tmp_string = images_list[+image_number].firstChild.data;
            tmp_string = tmp_string.substring(0,tmp_string.lastIndexOf("_")+1)+(i+1)+tmp_string.substring(tmp_string.indexOf("."),tmp_string.length);
            image_name[i] = "./jp4-proxy.php?n=tmp/"+i+"&url=/data/footage/"+folder+"/"+tmp_string+"&mode="+mode;
        }
            
        var tmp_smth = images_list[+image_number].firstChild.data;
        var tmp_smth_part1 = tmp_smth.substring(0,tmp_smth.lastIndexOf("/"));
        var tmp_smth_part2 = tmp_smth.substring(tmp_smth.lastIndexOf("/")+1);
        
        $("#filename").html(tmp_smth);
        //form a link
        
        tmp_string = "./fullsize_canvas.php?settings="+settings_file+"&width=2592&height=1944&path=/data/footage/"+folder+"/"+tmp_smth_part1+"&name="+tmp_smth_part2;
        
        $("#larger_preview").html("<a href='"+tmp_string+"'>Full size preview</a>");
        
        $("#canvas_link").attr("href",tmp_string);
        $("#canvas_link").attr("title","Click for a full size preview");
        
        load_counter = 0;
        
        for (var i=0;i<8;i++){
            remove_hidden_div(i);
            append_hidden_div(i);
            $("#div_"+i).jp4({image:image_name[cams[i].index-1],width:200,fast:true,lowres:4});
        }
      }
    });
    
}


function set_image_number(k) {
    old_number = document.getElementById('input_image_number').value;
    image_change(k-old_number);
}

function refresh_map() {
    new_number = document.getElementById('input_image_number').value;
    image_change(new_number-CurrentImageNumber);
}

function image_change(delta) {
    old_number = CurrentImageNumber;//document.getElementById('input_image_number').value;
    new_number = +old_number + delta;
    //if (new_number==0) new_number = 1;
    document.getElementById('input_image_number').value=new_number;
    CurrentImageNumber = new_number;
    
    //set_icon(old_number,icon_dot);
    //set_icon(new_number,icon_eyesis); 
    
    osm_set_current_position(map_points[new_number]);
    refresh_images();
}

function get_dates() {
    //get_folder_list("",'input_date_list');
    
    get_folder_list_request("/data/footage/","","input_date_list");
}

function folder_list_fill(folder_list,element_id){
  var list = "<ul>";
  for(var i=0; i<folder_list.length; i++) {
    list = list + "<li>"+folder_list[i].firstChild.data+"</li>";
  }
  list = list + "</ul>";
        
  document.getElementById(element_id).innerHTML= list;
  
  // init list
  jquery_list("input_date_list","Choose Date");
  
  // extra click bind
  var list_elements=$('#input_date_list').find('li');

  list_elements.each(function(i) {      
      var li = $(this);
      li.click(function(){
          //get_folders();
          osm_remove_points();
          get_kml_records_list("/data/footage/"+$(this).html()+"/map_points.kml");
          //map_points = parse_kml(kml_response);
          //console.log(map_points);
          
          //osm_set_current_position(mark);          
          //refresh_images();
          
          //return false;
      });
  });
  
}

function get_folder_list_request(some_folder,type,element_id,mode) {
    
    $.ajax({
      url: "./panorama_preview.php?type="+type+"&folder="+some_folder,
      success: function(data){
          folder_list_fill($(data).find("f"),element_id);
      }
    });
    
}

function new_item_selected() {
    set_image_number(0);
}

function copy_files() {
  
    var panos_number = $("#panos_number").val();
    var src_folder="/data/footage/"+$('#input_date_list').attr('value')+"/";
    var image_number = $('#input_image_number').val();    
    var dest_path= $('#copy_path').val();
    
    for (var i=0; i<panos_number; i++) {
      
	var src_file = images_list[+image_number+i].firstChild.data;
	
	request = "./copy.php?folder="+src_folder+"&file="+src_file+"&dest_path="+dest_path+"&imagej=/data/post-processing/imagej_processed";
	
	$.ajax({
	  url: request,
	  async: true,
	});  
    }
	
}

var intvl2;

function copy_all(){
    intvl2=setInterval("refresh_time_2('Copying')",500);
    $.ajax({
      url: "copy_all.php?src=/data/footage/"+$('#input_date_list').attr('value')+"&dest="+$('#copy_path').val()+"&imagej=/data/post-processing/imagej_processed",
      async: true,
      success: function(){
	  clearInterval(invl2);
	  $('#status').html("Done.");
      }
    });
}

function rewriteURL(){
  var parameters=location.href.replace(/\?/ig,"&").split("&");
  for (var i=0;i<parameters.length;i++) parameters[i]=parameters[i].split("=");
  for (var i=1;i<parameters.length;i++) {
    switch (parameters[i][0]) {
      case "settings": settings_file = parameters[i][1];break;
    }
  }
  if (location.href.lastIndexOf("?")==-1) {
    baseURL = location.href;
  }else{
    baseURL = location.href.substring(0,location.href.lastIndexOf("?"));
  }
  newURL="?settings="+settings_file;
  window.history.pushState('index.html', 'Title', baseURL+newURL);
  
}

