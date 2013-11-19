$(function(){
	

//SideBuy API 

	//select to enter new goal - displays goal entry form 
	$('.newgoal').on('click', function (){
		
		console.log('here')
		$('.budgetEntry').show()
		$('.newgoal').hide()
		$('.checkgoal').hide()
		$('.postGoal').hide()
		$('.jumbotron').hide()
	})
	//user can view past goal and see if they have achieved it
	//returns goal data and current balance
	$('.checkgoal').on('click', function (){
		$.post('/pastgoal', function(pastgoal){
				console.log(pastgoal.goals);
				console.log(pastgoal.goals.length);
				if (pastgoal.goals.length>0){
					for (var i=0; i<pastgoal.goals.length; i++){
					$('.jumbotron').hide()
					$('.pastGoal').show()
					$('.goalfail').hide()
					$('.newgoal').hide()
					$('.checkgoal').hide()
					$('.deals').hide()
					$('.listgoals').append('<div class="goalgrouping"><div class="input-group"><span class="input-group-addon">On</span><input type="date" class="form-control goalsetdate goalsetdate'+[i]+'" placeholder="Goal Set"></div><div class="input-group "><span class="input-group-addon">Your Credit Card</span><input type="text" class="form-control card card'+[i]+'" placeholder="Card Name"></div><div class="input-group "><span class="input-group-addon">Balance Was</span><input type="number" class="form-control pastbalance pastbalance'+[i]+'" placeholder="Past Balance"></div><div class="input-group"><span class="input-group-addon">Goal Date</span><input type="date" class="form-control goaldate goaldate'+[i]+'" placeholder="Goal Date"></div><div class="input-group"><span class="input-group-addon ">Goal Balance</span><input type="number" class="form-control goalrembalance goalrembalance' +[i]+'" placeholder="Goal Set"></div><button type="button" class="btn btn-danger balancegoalcheck">Check Goal</button></div>')
						var dategoalset = pastgoal.goals[i].dategoalset.slice(0,-14)
						$('.card'+[i]).val(pastgoal.goals[i].bank);
						$('.goalsetdate'+[i]).val(dategoalset);
						$('.pastbalance'+[i]).val(pastgoal.goals[i].currentbalance)
						$('.goaldate'+[i]).val(pastgoal.goals[i].goaldate)
						$('.goalrembalance'+[i]).val(pastgoal.goals[i].goalbalance)
						console.log("targetbalance:",pastgoal.goals[i].goalbalance);
					}
				}
					else{
						console.log("here")
						$('.budgetEntry').show()
						$('.newgoal').hide()
						$('.checkgoal').hide()
						$('.budgetEntry').prepend("<p class='addgoals'> You don't have any goals enetered! Enter one in the form below:")
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
		var parent = $(this).parent('.goalgrouping')
		console.log("parent",parent)
		var dateend = parent.find('.goaldate').val();
		var startdate = parent.find('.goalsetdate').val();
		var olddebt = parent.find('.pastbalance').val();
		var newbal = parent.find('.goalrembalance').val();
		var bank = parent.find('.card').val();
		var savings = olddebt - newbal
		var roundedsavings = Math.round(savings*100)/100
		var that = $(this);
		var username = $('.bankusername2').val();
		var password = $('.bankpassword2').val();
		var acctnum = $('.bankacctid2').val();
		var statementdate = {
			username: username,
			password: password,
			acctnum: acctnum,
			dateend: dateend,
			bank: bank,
			newbal: newbal
		}
		console.log(startdate)
		console.log(dateend)
		$.post('/checkgoalbalance',{statementdate: statementdate}, function(matchbalance){
			var actualbalance = Math.abs(matchbalance[0].balance.BALAMT)
			var goalrembalance = Number(parent.find('.goalrembalance').val())
			var enteredcity = matchbalance[0].city
			//if statement balance does not equal goal, no deals 
			if (matchbalance ==='ERROR'){
				alert("The username or password you entered are incorrect. Please verify and re-submit.")
			}
				else if (actualbalance > goalrembalance){
				console.log('bad!')

				$('.goalfail').show()
				$('.listgoals').hide()
				$('.deals').hide()
			}
			//if goal is met - show deals 
					else {
					console.log("woohoo!!!")
					$('.deals').show()
					$('.budgetEntry').hide()
					$('.panel-group').hide()
					$('.listgoals').hide()
					$('.goalfail').hide()

						var api_key = '8c390e2e8545cb67facb5b45cea0c3fd';
						var city = 'new-york';// Set Location
						var limit = '0-30';
						var sort = 'price|1';

						$.ajax({
							url : 'http://v1.sidebuy.com/api/get/'+api_key+'/?'+'city='+city+'&limit='+limit+'&sort='+sort,
							cache : true,
							dataType : 'jsonp',
							success : function(data){
								console.log(data)
								var dealarray = []
								//only display deals that are less than the savings the user has made
								for (var i = 0; i < data.length; i++) {
									console.log(roundedsavings)
									if (data[i].price<= 30){
										dealarray.push(data[i])
									}
								}
								//append deals to page 
								for (var i = 0; i < dealarray.length; i++) {
									console.log('here')
								    $('#deals').append('<li><a href="'+dealarray[i]['link']+'">$'+dealarray[i]['price']+": "+dealarray[i]['title']+'</li>');
								}
							}		
						})
				
			}
		});
	});
	
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

		//Send object of entered acct info to retrieve debt data
		$.post('/acctdata', {acctdata: acctdata}, function(acctdata){
			console.log(acctdata);
			if (acctdata ==='ERROR'){
				alert("The username or password you entered are incorrect. Please verify and re-submit.")
			}
			else {
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
			}
		})
	});
	//set savings goal and add to user account.  
	$('.goalset').on('click', function(goalInfo){
		var goalInfo ={
			goal:{
				creditcard: $('.bankacctid').val(),
				bank: $('.creditcard option:selected').text(),
				bankuser: $('.bankusername').val(),
				bankpass: $('.bankpassword').val(),
				goaldate: $('.goaldate').val(),
				goalbalance: $('.goalbalance').val(),
				email: $('.email').val(),
				city: $('.city').val(),
				debt: $('.yourdebt').val(),
				income: $('.incomeEntry').val(),
				payoff: $('.payoffgoal').val(),
				percentsave: $('.percentdebt').val()
			}
		}
		//after goal set, save in DB and direct user to thank you page. Create chart based on users goal
		$.post('/goaldata', {goalInfo: goalInfo}, function(goalInfo){
			console.log("goal stuff:", goalInfo)
			$('.postGoal').show()
			$('.budgetEntry').hide()
			var totalbudget = Number(goalInfo.goal.income)
			var percentsave = Number(goalInfo.goal.percentsave)
			var payoffamt = Number(goalInfo.goal.payoff)
			if (percentsave > 15){
				var changeamt = percentsave - 15;
				var housing = .0035*changeamt;
				var savings = .001*changeamt;
				var livingexp =.0025*changeamt;
				var transportation = .1005*changeamt
					Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
					    return {
					        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
					        stops: [
					            [0, color],
					            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
					        ]
					    };
					});
					var rembalance = totalbudget - payoffamt
					console.log("remainingbalance", rembalance)
					// Build the chart
			        $('#chart').highcharts({
			        	
			            chart: {
			                plotBackgroundColor: null,
			                plotBorderWidth: null,
			                plotShadow: false
			            },
			            title: {
			                text: 'Suggested Budget Based on Your Goals'
			            },
			            // tooltip: {
			        	   //  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			            // },
			            plotOptions: {
			                pie: {
			                    allowPointSelect: true,
			                    cursor: 'pointer',
			                    dataLabels: {
			                        enabled: true,
			                        color: '#000000',
			                        connectorColor: '#000000',
			                        formatter: function() {
			                            return '<b>'+ this.point.name +'</b>: '+ this.y;
			                        }
			                    }
			                }
			            },
			            series: [{
			                type: 'pie',
			                name: 'Suggested Budget',
			                data: [
			                    ['Housing',   totalbudget*(0.35-housing)],
			                    ['Savings',    totalbudget*(0.1-savings)],
			                    ['Living Expenses', totalbudget*(0.25-livingexp)],
			                    ['Transportation', totalbudget*(0.15-transportation)],
			                    ['Debt',   payoffamt]
			                ]
			            }]
			        });
				}
			  
			
			
			console.log("Payoff:", payoffamt)
			console.log("budget:",totalbudget)

		   	// Radialize the colors
		   	if (percentsave = 15){
				Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
				    return {
				        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
				        stops: [
				            [0, color],
				            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
				        ]
				    };
				});
				var rembalance = totalbudget - payoffamt
				console.log("remainingbalance", rembalance)
				// Build the chart
		        $('#chart').highcharts({
		        	
		            chart: {
		                plotBackgroundColor: null,
		                plotBorderWidth: null,
		                plotShadow: false
		            },
		            title: {
		                text: 'Suggested Budget Based on Your Goals'
		            },
		            // tooltip: {
		        	   //  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		            // },
		            plotOptions: {
		                pie: {
		                    allowPointSelect: true,
		                    cursor: 'pointer',
		                    dataLabels: {
		                        enabled: true,
		                        color: '#000000',
		                        connectorColor: '#000000',
		                        formatter: function() {
		                            return '<b>'+ this.point.name +'</b>: '+ this.y;
		                        }
		                    }
		                }
		            },
		            series: [{
		                type: 'pie',
		                name: 'Suggested Budget',
		                data: [
		                    ['Housing',   totalbudget*0.35],
		                    ['Savings',    totalbudget*0.1],
		                    ['Living Expenses', totalbudget*0.25],
		                    ['Transportation', totalbudget*0.15],
		                    ['Debt',   payoffamt]
		                ]
		            }]
		        });
			}
				
		
			
			if (percentsave < 15){
				var changeamt = 15 - percentsave;
						var housing = .0035*changeamt;
						var savings = .001*changeamt;
						var livingexp =.0025*changeamt;
						var transportation = .1005*changeamt

				Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
				    return {
				        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
				        stops: [
				            [0, color],
				            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
				        ]
				    };
				});
				var rembalance = totalbudget - payoffamt
				console.log("remainingbalance", rembalance)
				// Build the chart
		        $('#chart').highcharts({
		        	
		            chart: {
		                plotBackgroundColor: null,
		                plotBorderWidth: null,
		                plotShadow: false
		            },
		            title: {
		                text: 'Suggested Budget Based on Your Goals'
		            },
		            // tooltip: {
		        	   //  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		            // },
		            plotOptions: {
		                pie: {
		                    allowPointSelect: true,
		                    cursor: 'pointer',
		                    dataLabels: {
		                        enabled: true,
		                        color: '#000000',
		                        connectorColor: '#000000',
		                        formatter: function() {
		                            return '<b>'+ this.point.name +'</b>: '+ this.y;
		                        }
		                    }
		                }
		            },
		           			series: [{
			                type: 'pie',
			                name: 'Suggested Budget',
			                data: [
			                    ['Housing',   totalbudget*(0.35+housing)],
			                    ['Savings',    totalbudget*(0.1+savings)],
			                    ['Living Expenses', totalbudget*(0.25+livingexp)],
			                    ['Transportation', totalbudget*(0.15+transportation)],
			                    ['Debt',   payoffamt]
			                ]
		            	}]
		        });
			}	
  		});
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
	// var name = $('.payoffdropdown').val();
	// $.post('/percent', {name: name}, function(percent){
	// 	$('.percentdebt').val(percent.payoffpercent)
	// })

	
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