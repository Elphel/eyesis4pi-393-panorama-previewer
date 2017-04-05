/*!*******************************************************************************
*! FILE NAME  : get_kml.js
*! DESCRIPTION: reads a kml certain record
*! Copyright (C) 2011 Elphel, Inc
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

var gXML_req;
  
function requestNode(url,callbacFunc) { // callbacFunc should accept array of panorama parameters as an argument
    gXML_req=new XMLHttpRequest();
    // made it sync (false = sync)
    gXML_req.open("GET", url, false);

    gXML_req.onreadystatechange = function() {
      if (typeof(gXML_req)=="undefined") return; ///
      if (gXML_req.readyState == 4) {
        if (((gXML_req.status >= 200) && (gXML_req.status < 300)) || (gXML_req.status ==304) ||
             ((typeof(gXML_req.status) =='undefined' ) && ((navigator.userAgent.indexOf("Safari")>=0) ||
             (navigator.userAgent.indexOf("Konqueror")>=0)))) {
		  parseRequest(gXML_req.responseXML,callbacFunc);
		  return;
         } else {
          if (gXML_req.status) { 
             alert("There was a problem retrieving the XML data:\n" + (gXML_req.status?gXML_req.statusText:"gXML_req.status==0")+
             "\nYou may safely ignore this message if you just reloaded this page");

          }
        }
      }
    }
    gXML_req.send(null);
  }
  
function parseRequest(xml,callbacFunc) {
    var node;
    var links;
    var panos=[];
    var pano={};

    if (xml.getElementsByTagName('NumberOfNodes').length>0) {
	pano.numberofnodes = xml.getElementsByTagName('NumberOfNodes')[0].firstChild.nodeValue;
    }

    if (xml.getElementsByTagName('ThisNode').length>0) {
	pano.thisnode = xml.getElementsByTagName('ThisNode')[0].firstChild.nodeValue;
    }

    if (xml.getElementsByTagName('PhotoOverlay').length>0) {
               
         node=xml.getElementsByTagName('PhotoOverlay')[0];

	 if (node.getElementsByTagName('name').length>0) {
	      pano.name = node.getElementsByTagName('name')[0].firstChild.nodeValue;
	 }

         if (node.getElementsByTagName('Camera').length>0) {
             nodeCam=node.getElementsByTagName('Camera')[0];
             if (nodeCam.getElementsByTagName('longitude').length>0) pano.longitude=parseFloat(nodeCam.getElementsByTagName('longitude')[0].firstChild.nodeValue);
             if (nodeCam.getElementsByTagName('latitude' ).length>0) pano.latitude= parseFloat(nodeCam.getElementsByTagName('latitude' )[0].firstChild.nodeValue);
             if (nodeCam.getElementsByTagName('altitude' ).length>0) pano.altitude= parseFloat(nodeCam.getElementsByTagName('altitude' )[0].firstChild.nodeValue);
             if (nodeCam.getElementsByTagName('heading'  ).length>0) pano.heading=  parseFloat(nodeCam.getElementsByTagName('heading'  )[0].firstChild.nodeValue);
             if (nodeCam.getElementsByTagName('tilt'     ).length>0) pano.tilt=     parseFloat(nodeCam.getElementsByTagName('tilt'     )[0].firstChild.nodeValue);
             if (nodeCam.getElementsByTagName('roll'     ).length>0) pano.roll=     parseFloat(nodeCam.getElementsByTagName('roll'     )[0].firstChild.nodeValue);
             if (node.getElementsByTagName('Icon').length>0) {
               nodeIcon=node.getElementsByTagName('Icon')[0];
               if (nodeIcon.getElementsByTagName('href').length>0)   pano.href=nodeIcon.getElementsByTagName('href')[0].firstChild.nodeValue;
             }
//              panos.push(pano);
         }         
    }
    
    if (xml.getElementsByTagName('Links').length>0) {
	nodeLinks=xml.getElementsByTagName('Links')[0];
	pano.links = [];
	if (nodeLinks.getElementsByTagName('Link').length>0) {  
	    for (var i=0;i<nodeLinks.getElementsByTagName('Link').length;i++) {
		nodeLink=nodeLinks.getElementsByTagName('Link')[i];
		pano.links[i] = {};
		pano.links[i].pano = nodeLink.getElementsByTagName('href')[0].firstChild.nodeValue;
		pano.links[i].description = nodeLink.getElementsByTagName('name')[0].firstChild.nodeValue;
		pano.links[i].heading = nodeLink.getElementsByTagName('azimuth')[0].firstChild.nodeValue;
	    }
	}
    }    
    
    callbacFunc(pano);
  }
