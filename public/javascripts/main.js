$(function(){
//SideBuy API 
	// var api_key = '8c390e2e8545cb67facb5b45cea0c3fd';
	// var city = 'new-york';// Set Location
	// var limit = '0-100';
	// var sort = 'expiryepoch|1';

	// var message = { 
 //  	'action': 'http://v1.sidebuy.com/api/get/'+api_key+'/?'+'city='+city+'&limit='+limit+'&sort='+sort,
 //  	'method': 'GET'
	// };

	// $.ajax({
	//   'url': message.action,
	//   'cache': true,
	//   'dataType': 'jsonp',
	//   'jsonpCallback': 'cb'
	// });
	// function cb(data){
 //        for (var i = 0; i < data.length; i++) {
 //        	console.log('here')
 //                $('#deals').append('<li>'+data[i]['title']+'</li>');
 //        }
	// }

	//select to enter new goal - displays goal entry form 
	$('.newgoal').on('click', function (){
		
		console.log('here')
		$('.budgetEntry').show()
		$('.newgoal').hide()
		$('.checkgoal').hide()
		$('.postGoal').hide()
	})
	//user can view past goal and see if they have achieved it
	//returns goal data and current balance
	$('.checkgoal').on('click', function (){
		console.log('here')
		$('.pastGoal').show()
		$('.newgoal').hide()
		$('.checkgoal').hide()
			$.post('/pastgoal', function(pastgoal){
				console.log(pastgoal.goals);
				console.log(pastgoal.goals.length);
			
				for (var i=0; i<pastgoal.goals.length; i++){
					$('.pastGoal').append('<div class="input-group"><span class="input-group-addon">"On"</span><input type="date" class="form-control goalsetdate" placeholder="Goal Set"></div><div class="input-group "><span class="input-group-addon">"Your Debt Was"</span><input type="number" class="form-control pastbalance" placeholder="Past Balance"></div><div class="input-group goaldate"><span class="input-group-addon">"Goal Date"</span><input type="date" class="form-control goaldate" placeholder="Goal Date"></div><div class="input-group goalrembalance"><span class="input-group-addon ">"Goal Balance"</span><input type="number" class="form-control goalrembalance" placeholder="Goal Set"></div><button type="button" class="btn btn-danger balancegoalcheck">Check Goal</button>')
						var dategoalset = pastgoal.goals[i].dategoalset.slice(0,-14)
						$('.goalsetdate').val(dategoalset);
						$('.pastbalance').val(pastgoal.goals[i].currentbalance)
						$('.goaldate').val(pastgoal.goals[i].goaldate)
						$('.goalrembalance').val(pastgoal.goals[i].goalbalance)
					}
					// for (var i=0; i<pastgoal.goals.length; i++){
					// $('.goalgroup').append(
					// 	'<div class=panel "panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href=#'+pastgoal.goals[i].goaldate+'>Collapsible Group Item #1</a></h4></div><div id=#'+pastgoal.goals[i].goaldate+' class="panel-collapse collapse in"><div class="panel-body">Text Here</div></div></div>')
					// }
					// $('.goalgroup').collapse()

		// 		for (var i = 0; i < pastgoal.goals.length; i++){
		// 					console.log("here")
		// 					li = pastgoal.goals[i]
		//  }	
		})
	})
//when user selects goal to verify, send dates to server to retrieve statement
	$(document).on('click','.balancegoalcheck', function(){
		console.log('here')
		var dateend = $(this).siblings(".goaldate").val()
		var startdate = $(this).closest(".goalsetdate").val()
		var statementdate = {
			dateend: dateend
		}
		console.log(startdate)
		console.log(dateend)
		$.post('/checkgoalbalance',{statementdate: statementdate}, function(matchbalance){
			console.log(matchbalance)
			console.log(matchbalance[0].BALAMT)
		})
	})
	// $.get('/load', function(categories){
		// $('.percentdebt').on('keyup', function(e){
		// 	$el = $(this);
		// 	if(e.which ===13){
		// 		var currentSpend = $el.val()
		// 		console.log(currentSpend)
		// 		var percentGoal = ($('.percentbudget').val()/100);
		// 		console.log(percentGoal)
		// 		var monthlyIncome = $('.income').val()
		// 		var percentIncome = (currentSpend/monthlyIncome)*100
		// 		$('.percentIncome').val(percentIncome)
		// 		var goalBudget = percentGoal*monthlyIncome
		// 		console.log(goalBudget)
		// 		$('.goalbudget').val(goalBudget)
		// 		var savings = (currentSpend - goalBudget)
		// 		$('.goalsave').val(savings)
				
		// 	}
		// })
	// });
	//create object with values of account data entered. push to array acctInfo
	$('.acctsubmit').on('click', function(acctInfo){
		var acctInfo =[];
		var bank = $('.creditcard option:selected').text();
		var username = $('.bankusername').val();
		var password = $('.bankpassword').val();
		var acctnum = $('.bankacctid').val();
		var income = $('.incomeEntry').val();
		var acctdata = {
			acct: {
			bank: bank,
			username: username,
			password: password,
			acctnum: acctnum,
			income: income,
			}
		}
		acctInfo.push(acctdata);

		//Send object of entered acct info to retrieve debt data
		$.post('/acctdata', {acctdata: acctdata}, function(acctdata){
			console.log(acctdata);
			if (acctdata ==='ERROR'){
				console.log('make an error message')
			}
			else 
				console.log(acctdata[0].BALAMT);
			//set debt equal to value returned from credit card statement
				var debt = Math.abs(acctdata[0].BALAMT);
				$('.yourdebt').val(debt);
			//populate income field and calculate percent to payoff and savings 
				$('.income').val(income);
				$('.percentdebt').val(15);
				var currentSpend = $('.income').val()
				//once monthly income is posted, calculate 
				var percentGoal = ($('.percentdebt').val()/100);
				console.log(percentGoal)
				var monthlyIncome = $('.income').val()
				// var percentIncome = (currentSpend/monthlyIncome)*100
				// $('.percentIncome').val(percentIncome)
				var goalBudget = percentGoal*monthlyIncome
				console.log(goalBudget)
				$('.payoffgoal').val(goalBudget)
				var savings = (debt - goalBudget)
				var roundedsavings = Math.round(savings*100)/100
				$('.goalbalance').val(roundedsavings)
		})
	});
	//set savings goal and add to user account.  
	$('.goalset').on('click', function(goalInfo){
		console.log('zipcode:',$('.zipcode').val())
		var goalInfo ={
			goal:{
				goaldate: $('.goaldate').val(),
				goalbalance: $('.goalbalance').val(),
				email: $('.email').val(),
				zipcode: $('.zipcode').val(),
				debt: $('.yourdebt').val()

			}
		}
		//after goal set, save in DB and direct user to thank you page. (maybe charts)
		$.post('/goaldata', {goalInfo: goalInfo}, function(goalInfo){
			console.log(goalInfo.goals)
			$('.postGoal').show()
			$('.budgetEntry').hide()

			

		})
	});

//set payoff options from info in database 
	// $.get('/payoff', function(payoff){
	// 	for (var items in payoff){
	// 		var dropDown = payoff[items].name;
	// 		var budget = payoff[items].payoffpercent;
	// 		console.log(dropDown)
	// 		$('.payoffdropdown').append('<option>'+dropDown+'</option>');
	// 	}
		//populate payoff percent immediately for default selection in payoff dropdown	
	var name = $('.payoffdropdown').val();
	$.post('/percent', {name: name}, function(percent){
		$('.percentdebt').val(percent.payoffpercent)
	})

	
	//update payoff percent if percentage entered changes
	$('.percentdebt').on('keyup', function(e){
					$el = $(this);
			if(e.which ===13){
				var currentSpend = $el.val()
				console.log(currentSpend)
				var debt = $('.yourdebt').val();
				var percentGoal = ($('.percentdebt').val()/100);
				console.log(percentGoal)
				var monthlyIncome = $('.income').val()
				// var percentIncome = (currentSpend/monthlyIncome)*100
				// $('.percentIncome').val(percentIncome)
				var goalBudget = percentGoal*monthlyIncome
				console.log(goalBudget)
				$('.payoffgoal').val(goalBudget)
				var savings = (debt - goalBudget)
				var roundedsavings = Math.round(savings*100)/100
				$('.goalbalance').val(roundedsavings)
			}
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