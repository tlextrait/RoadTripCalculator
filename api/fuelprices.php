<?php
	
	/**
	* Fuel Prices
	* © Copyright 2015, Thomas Lextrait, All Rights Reserved
	*/
	
	/*
	Sample JSON response:
	{
		cng: "2.11",
		diesel: "2.86",
		e85: "3.21",
		electric: "0.12",
		lpg: "2.92",
		midgrade: "3.01",
		premium: "3.18",
		regular: "2.81"	
	}	
	*/

	header("Access-Control-Allow-Origin: tlextrait.com");
	header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
	header("Pragma: no-cache");
	header("Content-type:application/json; charset=utf-8");
	
	$FUEL_PRICE_API_URL = "http://www.fueleconomy.gov/ws/rest/fuelprices";
	
	if (($response_xml_data = file_get_contents($FUEL_PRICE_API_URL))===false){
	    http_response_code(400);
	} else {
	   libxml_use_internal_errors(true);
	   $data = simplexml_load_string($response_xml_data);
	   if (!$data) {
	       http_response_code(400);
	   } else {
	      echo json_encode($data);
	   }
	}
	
?>