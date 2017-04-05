<?php

$kmlFile=$_GET['kml'];//"map_points.kml";


$kml=file_get_contents($kmlFile);

header("Content-Type: text/xml\n");
header("Content-Length: ".strlen($kml)."\n");
header("Pragma: no-cache\n");
echo ($kml);   

?>