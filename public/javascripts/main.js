$(function(){

	var api_key = '8c390e2e8545cb67facb5b45cea0c3fd';
	var city = 'new-york';// Set Location
	var limit = '0-100';
	var sort = 'expiryepoch|1';

	var message = { 
  	'action': 'http://v1.sidebuy.com/api/get/'+api_key+'/?'+'city='+city+'&limit='+limit+'&sort='+sort,
  	'method': 'GET'
	};

	$.ajax({
	  'url': message.action,
	  'cache': true,
	  'dataType': 'jsonp',
	  'jsonpCallback': 'cb'
	});
	function cb(data){
        for (var i = 0; i < data.length; i++) {
        	console.log('here')
                $('#deals').append('<li>'+data[i]['title']+'</li>');
        }
	}

	$.get('/load', function(categories){
		$('.currentspend').on('keyup', function(e){
			$el = $(this);
			if(e.which ===13){
				var currentSpend = $el.val()
				console.log(currentSpend)
				var percentGoal = ($('.percentbudget').val()/100);
				console.log(percentGoal)
				var monthlyIncome = $('.income').val()
				var percentIncome = (currentSpend/monthlyIncome)*100
				$('.percentIncome').val(percentIncome)
				var goalBudget = percentGoal*monthlyIncome
				console.log(goalBudget)
				$('.goalbudget').val(goalBudget)
				var savings = (currentSpend - goalBudget)
				$('.goalsave').val(savings)
				
			}
		})
	});
	//create object with values of account data entered. push to array acctInfo
	$('.acctsubmit').on('click', function(acctInfo){
		var acctInfo =[];
		var bank = $('.creditcard option:selected').text();
		var username = $('.bankusername').val();
		var password = $('.bankpassword').val();
		var acctnum = $('.bankacctid').val();
		var acctdata = {
			acct: {
			bank: bank,
			username: username,
			password: password,
			acctnum: acctnum
			}
		}
		acctInfo.push(acctdata);

		//Send object of entered acct info to retrieve debt data
		$.post('/acctdata', {acctdata: acctdata}, function(acctdata){
			console.log(acctdata);
			if (acctdata ==='ERROR'){
				console.log('make an error message')
			}
			else {
				console.log(acctdata[0].BALAMT)
				var debt = Math.abs(acctdata[0].BALAMT)
				$('.yourdebt').val(debt)
			}
		})
	})

//set payoff options from info in database 
	$.get('/payoff', function(payoff){
		for (var items in payoff){
			var dropDown = payoff[items].name;
			var budget = payoff[items].payoffpercent;
			console.log(dropDown)
			$('.payoffdropdown').append('<option>'+dropDown+'</option>');
		}
		//populate payoff percent immediately for default selection in payoff dropdown	
		var name = $('.payoffdropdown').val();
		$.post('/percent', {name: name}, function(percent){
			$('.percentdebt').val(percent.payoffpercent)
		})
	});
	//update payoff percent if option selected changes
	$('.payoffdropdown').on('change', function(){
		var name = $('.payoffdropdown').val();
		//send selected payoff type to server to retrieve matching percentage
			$.post('/percent', {name: name}, function(percent){
				console.log(percent.payoffpercent)
				$('.percentdebt').val(percent.payoffpercent)
				var currentIncome = $('.income').val()
				var percentGoal = ($('.percentdebt').val()/100);
				var goalBudget = percentGoal*currentIncome
				$('.payoffgoal').val(goalBudget)
				var debt = $('.yourdebt').val()
				var newBalance = (debt)-(goalBudget)
				var roundedBalance = Math.round(newBalance * 100) / 100
				$('.goalsave').val(roundedBalance)
		})
	});
	//When income is entered, calculate goals based on % of income
	$('.income').on('keyup', function(e){
		$el = $(this);
		if(e.which ===13){
			var currentIncome = $el.val()
			console.log(currentIncome)
			var percentGoal = ($('.percentdebt').val()/100);
			console.log(percentGoal)
			var goalBudget = percentGoal*currentIncome
			console.log('goal:',goalBudget)
			$('.payoffgoal').val(goalBudget)
			var debt = $('.yourdebt').val()
			console.log('debt:',debt)
			var newBalance = (debt)-(goalBudget)
			var roundedBalance = Math.round(newBalance * 100) / 100
			$('.goalsave').val(roundedBalance)
			
		}
	})
	//when credit card type changed, clear any entries 
	$('.creditcard').on('change', function(){
		var bank = $('.creditcard option:selected').text();
		var username = $('.bankusername').val("");
		var password = $('.bankpassword').val("");
		var acctnum = $('.bankacctid').val("");
	});


	//set dropdown values equal to categories from database. May use this for budget suggestions
	// for (var items in categories){
	// 	var dropDown = categories[items].name;
	// 	var budget = categories[items].percentbudget;
	// 	console.log(dropDown)
	// 	$('.productdropdown').append('<option>'+dropDown+'</option>');
	// 	// $('.percentbudget').val(budget);
	// 	}
	// 		//when category selected from dropdown, find the matching budget % from array
	// 		//and update value field
	// 		//get rid of this and use findOne formula - make puuuureeeee
	// 		$('.productdropdown').on('change', function(){
	// 			var selectedCategory = $('.productdropdown option:selected').text();
	// 		 	console.log(selectedCategory);
	// 		 	// var pleasework = matchInArray(categories, selectedCategory, 'name');
	// 		 	var findmatchIndex = function(){
	// 		 		for (var i = 0; i<categories.length; i++){
	// 			 		if(categories[i].name ===selectedCategory){
	// 			 		console.log(i)
	// 			 		return i; 
	// 		 			}
	// 		 		}
	// 			}
	// 			var matchedIndex = findmatchIndex();
	// 		 	var itemBudget = categories[matchedIndex].percentbudget;
	// 		 	 $('.percentbudget').val(itemBudget)
	// 			console.log(itemBudget)
	// 		})
});