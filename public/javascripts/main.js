$(function(){
	$.get('/load', function(categories){
		console.log(categories)
		for (var items in categories){
			var dropDown = categories[items].name;
			var budget = categories[items].percentbudget;
			console.log(dropDown)
			$('.productdropdown').append('<option>'+dropDown+'</option>');
			// $('.percentbudget').val(budget);
		}
			
				$('.productdropdown').on('change', function(){
					var selectedCategory = $('.productdropdown option:selected').text();
					 	console.log(selectedCategory)
					 	for (selectedCategory in categories){
					 	console.log(selectedCategory.percentbudget)
					 	var itemBudget = categories[selectedCategory].percentbudget;
					 	$('.percentbudget').val(itemBudget)
					// console.log(itemBudget)
					}

				})
	});

});