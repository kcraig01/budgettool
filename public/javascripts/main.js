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

	// 				$('#message-input').on('keyup', function(e){
	// 	$el = $(this);
	// 	if(e.which === 13){
	// 		console.log('test')
	// 		socket.emit('message', $el.val())
	// 		$el.val('')
	// 	}
	// })

	});

});