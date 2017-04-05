<?php
/*!***************************************************************************
*! FILE NAME  : jp4-proxy.php
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
*!  $Log: jp4-proxy.php,v $
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

if (!is_dir("tmp")){
  $old = umask(0);
  @mkdir("tmp");
  umask($old);
}

$url = $_REQUEST["url"];
$tmp_base = $_GET["n"];

if (isset($_GET['mode'])) $mode = $_GET['mode'];
else                      $mode = "jp4";

if (is_file("$tmp_base.jp4")) exec("rm $tmp_base.jp4");
if (is_file("$tmp_base.dng")) exec("rm $tmp_base.dng");
if (is_file("$tmp_base.jpeg")) exec("rm $tmp_base.jpeg");

file_put_contents("$tmp_base.$mode", file_get_contents($url));

if ($mode=="jp4") {
    exec("movie2dng --dng $tmp_base.jp4");
    exec("dcraw -c $tmp_base.dng | cjpeg -quality 75 > $tmp_base.jpeg");
}else{
    //even jpegs need to be flipped to be shown correctly, movie2dng flips aotumatically
    if ((substr($tmp_base,-1,1))%2!=0) exec("convert $tmp_base.jpeg -flip $tmp_base.jpeg");
}

$output = file_get_contents("$tmp_base.jpeg"); 

header("Content-type: image/jpeg");
print($output);

if (is_file("$tmp_base.jp4")) exec("rm $tmp_base.jp4");
if (is_file("$tmp_base.dng")) exec("rm $tmp_base.dng");
if (is_file("$tmp_base.jpeg")) exec("rm $tmp_base.jpeg");

?>
