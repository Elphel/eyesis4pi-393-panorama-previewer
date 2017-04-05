<?php
/*!*******************************************************************************
*! FILE NAME   : fullsize_canvas.php
*! DESCRIPTION : full size preview page
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

if (!isset($_GET['path']) || !isset($_GET['name'])) echo("Too bad, some of the parameters are missing.\n");

$path = $_GET['path'];
$name = $_GET['name'];


$file_prefix = substr($name,0,strlen($name)-6);
$file_ending = substr($name,strlen($name)-4,4);

for($i=0;$i<8;$i++){
    //$img_name[$i] = "{$path}/{$file_prefix}_".($i+1).$file_ending;
    $img_name[$i] = "\"./jp4-proxy.php?n=tmp/".$i."&url={$path}/{$file_prefix}_".($i+1).$file_ending."\"";
}

if (isset($_GET['width'])) $w = $_GET['width'];
else                       $w = 400;

if (isset($_GET['height'])) $h = $_GET['height'];
else                        $h = 300;

?>

<html>
<head>
  <title>Footage Viewer</title>

  <link rel="stylesheet" type="text/css" href="js/fullsize_canvas.css" />

  <script src="js/jquery-3.1.1.min.js" type="text/javascript"></script>
  
  <script src="js/elphel.js"></script>
  <script src="js/jcanvas.min.js"></script>
  <script src="js/exif.js"></script>
  <script src="js/jquery-jp4.js"></script>
  
  <script src="js/fullsize_canvas.js"></script>

</head>

<body>

    <div id="camerawindow" class="round_borders">
	<canvas id="canvas"></canvas>
    </div>

    <script type="text/javascript">

	var W = 2592;
	var H = 1944;

	var w = <?=$w?>;
	var h = <?=$h?>;

	var baseWidth = w;
	var baseHeight = h;
	
	$("#camerawindow").css({width:8*h,height:3*w});

	var cnv;
	var cContext;

	cnv = document.getElementById('canvas');
	cContext = cnv.getContext('2d');

	cnv.setAttribute('width',baseHeight*8);cnv.setAttribute('height',baseWidth*3);
	
        // init hidden canvases
        for(var i=0;i<cams.length;i++){
          append_hidden_div(i);
        }
	
	refresh_images();

	function refresh_images(){

          var image_name = new Array();

  <?php
    for($i=0;$i<8;$i++){
	echo "\timage_name[$i]=".$img_name[$i].";\n";
    }
  ?>
	  
	  for (var i=0;i<8;i++){
            $("#div_"+i).jp4({image:image_name[cams[i].index-1],width:w,fast:true});
          }
	  
	}
    </script>

  </body>
</html>