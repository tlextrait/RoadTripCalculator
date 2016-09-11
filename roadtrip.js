/**
* Road Trip Calculator roadtrip.js
* © Copyright 2015 Thomas Lextrait, All Rights Reserved
*/

var Calculator = {
	
	assumedSpeed: 55,
	daysInAMonth: 30,
	daysInAYear: 365,
	
	calculated: false,
	
	bind: function(){
		this.carDeprec = $("#car-deprec");
		
		this.tireValue = $("#tire-value");
		this.tireWarranty = $("#tire-warranty");
		
		this.gasMileage = $("#gas-mileage");
		this.gasPrice = $("#gas-price");
		
		this.oilChange = $("#oil-change");
		this.oilPrice = $("#oil-price");
		
		this.brakeChange = $("#brake-change");
		this.brakePrice = $("#brake-price");
		
		this.distance = $("#distance");
		this.tolls = $("#tolls");
		this.parking = $("#parking");
		
		this.insurance = $("#insurance");
		this.monthlyParking = $("#mparking");
		this.excise = $("#excise");
		
		this.breakdown = $("#breakdown").hide();
		this.result = $("#result");		
		this.calculateButton = $("#calculate-button").on("click", function(){ 
			Calculator.calculate();
			$("html, body").animate({ scrollTop: $(document).height() }, "fast");
		});
		
		// Hookup all text inputs to valChanged
		$("input[type='number'], input[type='text']").on("keyup", function(){Calculator.valChanged()});
		
		// Find fuel prices
		$.get("api/fuelprices.php")
		.done(function(fuelPrices){
			console.log(fuelPrices);
			if(fuelPrices && fuelPrices.premium) {
				Calculator.gasPrice
					.val(fuelPrices.premium)
					.tooltip({title: "Fetched online"})
					.addClass("text-primary");
			}
		});
	},
	
	valChanged: function(){
		if(this.calculated) this.calculate();	
	},
	
	calculate: function(){
		
		var carDeprec = parseFloat(this.carDeprec.val());
		var tireDeprec = parseFloat(this.tireValue.val()) * 4 / parseFloat(this.tireWarranty.val());
		var gasCost = parseFloat(this.gasPrice.val()) / parseFloat(this.gasMileage.val());
		var oilCost = parseFloat(this.oilPrice.val()) / parseFloat(this.oilChange.val());
		var brakeDeprec = parseFloat(this.brakePrice.val()) * 4 / parseFloat(this.brakeChange.val());
		var totalCostPerMile = carDeprec + tireDeprec + gasCost + oilCost + brakeDeprec;
		
		// Fixed costs
		var tripTimeHours = parseFloat(this.distance.val()) / this.assumedSpeed;
		var insurancePerHour = parseFloat(this.insurance.val()) / (this.daysInAMonth*24);
		var parkingPerHour = parseFloat(this.monthlyParking.val()) / (this.daysInAMonth*24);
		var excisePerHour = parseFloat(this.excise.val()) / (this.daysInAYear*24);
		var totalFixedCostPerHour = insurancePerHour + parkingPerHour + excisePerHour;
		var totalFixedCost = tripTimeHours * (insurancePerHour + parkingPerHour + excisePerHour);
		
		var oneWay = parseFloat(this.distance.val()) * totalCostPerMile +
			parseFloat(this.tolls.val()) +
			parseFloat(this.parking.val());
			
		var oneWayCalibrated = oneWay - totalFixedCost;
			
		var returnTrip = oneWayCalibrated * 2;
		
		var breakdown = "$" + round(carDeprec, 3) + " / mile in car depreciation +<br/>" +
			"$" + round(tireDeprec, 3) + " / mile in tire depreciation +<br/>" + 
			"$" + round(gasCost, 3) + " / mile in gas +<br/>" +
			"$" + round(oilCost, 3) + " / mile in oil +<br/>" +
			"$" + round(brakeDeprec, 3) + " / mile in brake depreciation +<br/>" +
			"= $" + round(totalCostPerMile, 3) + " / mile total <br/><br/>" + 
			
			"$" + round(totalCostPerMile, 3) + " x " + parseFloat(this.distance.val()) + " miles + <br/>" + 
			"$" + parseFloat(this.tolls.val()) + " in tolls + <br/>" + 
			"$" + parseFloat(this.parking.val()) + " in parking <br/>" + 
			"= $" + round(oneWay, 2) + " one way <br/><br/>" +
			
			"$" + round(insurancePerHour, 4) + " insurance / hour +<br/>" +
			"$" + round(parkingPerHour, 4) + " home parking / hour +<br/>" +
			"$" + round(excisePerHour, 4) + " excise tax / hour<br/>" +
			"= $" + round(totalFixedCostPerHour, 4) + " total fixed cost / hour <br/><br/>" + 
			
			round(tripTimeHours, 2) + " hours of driving (at " + this.assumedSpeed + "mph) <br/>" +
			round(tripTimeHours, 2) + " hours x $" + round(totalFixedCostPerHour, 4) + " = $" + round(totalFixedCost, 2) + "<br/>" + 
			"$" + round(oneWay, 2) + " - $" + round(totalFixedCost, 2) + " = " + round(oneWayCalibrated, 2);
		
		this.calculated = true;
		this.breakdown.html(breakdown)
			.show();
		this.result.removeClass("text-muted text-primary")
			.addClass("text-primary")
			.text("One way: $" + round(oneWayCalibrated, 2) + ", Return: $" + round(returnTrip, 2));
	}
	
};

// Fixes JS rounding bug, see http://www.jacklmoore.com/notes/rounding-in-javascript/
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

// Run
$(document).ready(function(){
	Calculator.bind();
});

