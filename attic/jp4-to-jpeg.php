<?php
/*!***************************************************************************
*! FILE NAME  : jp4-2-jpeg.php
*! DESCRIPTION: based on Paulo's original jp4-proxy.php
*! CO-AUTHOR: Oleg K Dzhimiev <oleg@elphel.com>
*! Copyright (C) Paulo Henrique Silva <ph.silva@gmail.com>
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
*!  $Log: jp4-to-jpeg.php,v $
*/

/*!
  Copyright 2010 Paulo Henrique Silva <ph.silva@gmail.com>

  This file is part of movie2dng.

  movie2dng is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  movie2dng is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with movie2dng.  If not, see <http://www.gnu.org/licenses/>.
*/

if (isset($_GET['source'])||(isset($argv[1])&&$argv[1]=='source')) {
  $source=file_get_contents ($_SERVER['SCRIPT_FILENAME']);
  header("Content-Type: text/php");
  header("Content-Length: ".strlen($source)."\n");
  header("Pragma: no-cache\n");
  echo $source;
  exit(0);
}

if (isset($_GET['help'])||isset($_GET['usage'])||(isset($argv[1])&&$argv[1]=="help"||$argv[1]=="usage")) {
	echo "<pre>\n";
	echo "web:\n\tconvert_image.php?file=<full-path-to-file>&mode=<jpeg|dng>&quality=<0-100>&print=<true|false>\n";
	echo "\t\tfile - full path to file\n";
	echo "\t\tmode - convert file into 'jpeg' or 'dng' (default - 'jpeg')\n";
	echo "\t\tquality - jpeg compression quality (default - 100)\n";
	echo "\t\tprint - show result contents (default - false)\n";
	echo "terminal:\n\tphp convert_image.php <file-full-path> <jpeg|dng> <0-100> <true|false>\n";
	exit(0);
}

if (isset($_GET['file']))  $file=$GET['file'];
else if (isset($argv[1]))  $file=$argv[1];
else die("file is not specified\n");

if (isset($_GET['mode'])) $mode = $_GET['mode'];
else if (isset($argv[2])) $mode = $argv[2];
else                      $mode = "jpeg";

if (isset($_GET['quality'])) $quality=$_GET['quality'];
else if (isset($argv[3]))    $quality=$argv[3];
else                         $quality=100;

if (isset($_GET['print'])) $print=true;
else if (isset($argv[4]))  $print=true;
else                       $print=false;

if (!is_file($file)) die("file does not exist\n");

$pathinfo = pathinfo($file);
$file_extension = $pathinfo['extension'];
$file_dng = $pathinfo['dirname']."/".$pathinfo['filename'].".dng";
$file_jpeg = $pathinfo['dirname']."/".$pathinfo['filename'].".jpeg";

if (($mode=="jpeg"||$mode=="dng")&&$file_extension=="jp4") exec("movie2dng --dng $file");

if ($mode=="jpeg"&&is_file($file_dng)) {
	exec("dcraw -c $file_dng | cjpeg -quality $quality > $file_jpeg");
	if ($file_extension=="jp4") exec("rm $file_dng");
}

if ($print){
  $output = file_get_contents($file_jpeg); 
  header("Content-type: image/jpeg");
  echo $output;
}

?>
