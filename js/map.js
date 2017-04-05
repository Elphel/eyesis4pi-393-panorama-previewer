function get_kml_records_list(file) {
  
    $.ajax({
      url: "./get_kml.php?kml="+file,
      success: function(data){
        map_points = parse_kml($(data).find("PhotoOverlay"));
        osm_place_points(map_points);
        set_image_number(0);
      }
    });
  
}

function parse_kml(xml){
    var points = new Array();
    
    for (i=0;i<xml.length;i++) {
	points[i] = new Array();
	points[i].longitude=xml[i].getElementsByTagName("longitude")[0].firstChild.nodeValue;
	points[i].latitude =xml[i].getElementsByTagName("latitude")[0].firstChild.nodeValue;
	points[i].href     =xml[i].getElementsByTagName("href")[0].firstChild.nodeValue;
	points[i].thisnode = i;
    }   
        
    return points;
}
