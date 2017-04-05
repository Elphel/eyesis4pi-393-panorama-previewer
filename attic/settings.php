<?php

$file=$_GET['file'];//"map_points.kml";


$xml=file_get_contents($file);

header("Content-Type: text/xml\n");
header("Content-Length: ".strlen($xml)."\n");
header("Pragma: no-cache\n");
echo ($xml);

?>