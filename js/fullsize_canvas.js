/*!*******************************************************************************
*! FILE NAME   : fullsize_canvas.js
*! DESCRIPTION : functions for creating a full size preview
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

var settings_file = "settings.xml";

function draw_image(img,index){
  var w = baseWidth;
  var h = baseHeight;
  
  index = +index;
  
  cContext.rotate(90*Math.PI/180);
  if (index%2==0) {
    cContext.drawImage(img, 0,0*h,w,h, 0*w,-1*h*(index+1),w,h);
    cContext.drawImage(img, 0,1*h,w,h, 1*w,-1*h*(index+1),w,h);
    cContext.scale(-1,1);
    cContext.drawImage(img, 0,2*h,w,h, -3*w, -1*h*(index+1), w, h);
    cContext.scale(-1,1);
  }else{
    cContext.scale(1,-1); //mirror is needed
    cContext.drawImage(img, 0,0*h,w,h, 0*w,index*h,w,h);
    cContext.drawImage(img, 0,1*h,w,h, 1*w,index*h,w,h);
    cContext.scale(-1,1);
    cContext.drawImage(img, 0,2*h,w,h, -3*w,h*(index),w,h);
    cContext.scale(-1,1);
    cContext.scale(1,-1);
  }
  cContext.rotate(-90*Math.PI/180);
}

function append_hidden_div(index){
  el = $("<div>",{
    id: "div_"+index
  }).css({
    display: "none"
  });
    
  el.attr("index",index);
  
  el.on("canvas_ready",function(){
      //can draw on main canvas
      var cnv = $(this).find("#scaled")[0];
      var index = $(this).attr("index");
    
      draw_image(cnv,index);
      
  });
  
  $("body").append(el);
}

