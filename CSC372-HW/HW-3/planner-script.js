let mealPlan = {};

function addMeal(dishName, price) {
    if (mealPlan[dishName]) {
        mealPlan[dishName].quantity++;
    } else {
        mealPlan[dishName] = {
            price: price,
            quantity: 1
        };
    }
    updateMealPlan();
}

function removeMeal(dishName) {
    if (mealPlan[dishName]) {
        mealPlan[dishName].quantity--;
        if (mealPlan[dishName].quantity <= 0) {
            delete mealPlan[dishName];
        }
    }
    updateMealPlan();
}

function updateMealPlan() {
    const mealPlanDiv = document.getElementById('meal-plan');
    mealPlanDiv.innerHTML = '';
    let total = 0;

    for (const [dishName, details] of Object.entries(mealPlan)) {
        const dishTotal = details.price * details.quantity;
        total += dishTotal;

        const dishDiv = document.createElement('div');
        dishDiv.classList.add('meal-item');



        dishDiv.innerHTML = `
        <span>${dishName}</span>
        <div class="quantity-buttons"> <span>$${details.price.toFixed(2)} * ${details.quantity}</span>
        <button onclick="removeMeal('${dishName}')">-</button>
        <button onclick="addMeal('${dishName}', ${details.price})">+</button>
        </div>
        `;
        
        mealPlanDiv.appendChild(dishDiv);
    }

    document.getElementById('total').textContent = total.toFixed(2);
}

