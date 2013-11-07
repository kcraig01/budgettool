$(function(){

//attempt at pure function, not working 
// var matchInArray = function findmatchIndex(array, searchTerm, property){
// 	for (var i = 0; i<array.length; i++){
// 		if (array[i].property ===searchTerm){
// 			console.log(i)
// 			return i;
// 		}
// 		}
// 	}

	$.get('/load', function(categories){
		console.log(categories)
		//set dropdown values equal to categories from database
		for (var items in categories){
			var dropDown = categories[items].name;
			var budget = categories[items].percentbudget;
			console.log(dropDown)
			$('.productdropdown').append('<option>'+dropDown+'</option>');
			// $('.percentbudget').val(budget);
			}
				//when category selected from dropdown, find the matching budget % from array
				//and update value field
				//get rid of this and use findOne formula - make puuuureeeee
				$('.productdropdown').on('change', function(){
					var selectedCategory = $('.productdropdown option:selected').text();
				 	console.log(selectedCategory);
				 	// var pleasework = matchInArray(categories, selectedCategory, 'name');
				 	var findmatchIndex = function(){
				 		for (var i = 0; i<categories.length; i++){
					 		if(categories[i].name ===selectedCategory){
					 		console.log(i)
					 		return i; 
				 			}
				 		}
					}
					var matchedIndex = findmatchIndex();
				 	var itemBudget = categories[matchedIndex].percentbudget;
				 	 $('.percentbudget').val(itemBudget)
					console.log(itemBudget)
				})
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
						var savings = currentSpend - goalBudget
						$('.goalsave').val(savings)
						
					}
				})
			});
	
//receive credit card balance amount and set it as value in DEBT field

	$.get('/debt', function(newDebt){
		console.log(newDebt[0].BALAMT)
		var debt = Math.abs(newDebt[0].BALAMT)
		$('.yourdebt').val(debt)
	});

//set payoff options from info in database 
	$.get('/payoff', function(payoff){
		console.log(payoff)
			for (var items in payoff){
				var dropDown = payoff[items].name;
				var budget = payoff[items].payoffpercent;
				console.log(dropDown)
				$('.payoffdropdown').append('<option>'+dropDown+'</option>');
			}
			//populate payoff percent immediately for default selection in payoff dropdown	
			var name = $('.payoffdropdown').val();
			$.post('/percent', {name: name}, function(percent){
				console.log(percent.payoffpercent)
				$('.percentdebt').val(percent.payoffpercent)
			})
	});
	//update payoff percent if option selected changes
	$('.payoffdropdown').on('change', function(){
		var name = $('.payoffdropdown').val();
			$.post('/percent', {name: name}, function(percent){
				console.log(percent.payoffpercent)
				$('.percentdebt').val(percent.payoffpercent)
				var currentIncome = $('.income').val()
				var percentGoal = ($('.percentdebt').val()/100);
				var goalBudget = percentGoal*currentIncome
				$('.payoffgoal').val(goalBudget)
				var debt = $('.yourdebt').val()
				var newBalance = (debt)-(goalBudget)
				$('.goalsave').val(newBalance)
	})
		});
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
						$('.goalsave').val(newBalance)
						
					}
				})
});