function show(id) {
    //hide descriptions
    const description = document.querySelectorAll('.food-descrip');
    description.forEach(description => {description.style.display = 'none';});

    //show selected description
    const selectedDescription = document.getElementById(id);
    if(selectedDescription) {
        selectedDescription.style.display = 'block';
    }

    //rmeove active class from all food items
    const foodItems = document.querySelectorAll('.food-item');
    foodItems.forEach(foodItem => {foodItem.classList.remove('active');});

    //add active class to selected food item
    const selectedFoodItem = document.querySelector(`[onclick="show('${id}')"]`);
    if(selectedFoodItem) {
        selectedFoodItem.classList.add('active');
    }
}