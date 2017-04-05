<?php
/*!*******************************************************************************
*! FILE NAME   : copy.php
*! DESCRIPTION : copies selected files to a specified destination
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

$dest_folder = "/data/oleg/process_folder/src";

$folder = $_GET["folder"];
$file = $_GET["file"];

$imagej = $_GET["imagej"];

$dest_folder = $_GET["dest_path"];

if (!is_dir($dest_folder)){
  $old = umask(0);
  @mkdir($dest_folder);
  umask($old);
}

if (!is_dir($imagej)){
  $old = umask(0);
  @mkdir($imagej);
  umask($old);
}

if (substr($dest_folder,-1,1)!="/") $dest_folder = $dest_folder."/";
if (substr($folder,-1,1)!="/") $folder = $folder."/";

$file_prefix = substr($file,0,strlen($file)-6);
$file_ending = substr($file,strlen($file)-4,4);

if (strstr($file_prefix,"/")) $new_file_prefix = substr($file_prefix,strpos($file_prefix,"/")+1);
else                          $new_file_prefix = $file_prefix;

//for ($i=1;$i<10;$i++){
    exec("cp {$folder}{$file_prefix}_* {$dest_folder}");
//}

?>
