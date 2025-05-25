 function Showsidebar(){
            const sidebar = document.querySelector('.sidebar')
            sidebar.style.display = 'flex'
        }
        function Hidesidebar(){
            const sidebar = document.querySelector('.sidebar')
                sidebar.style.display = 'none'
            
        } 
         // Cart functionality
        let cart = [];
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const product = {
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    image: this.dataset.image,
                    quantity: 1
                };
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.name === product.name);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push(product);
                }
                
                updateCart();
                showNotification('Added to cart!', 'blue');
            });
        });
        
        // Buy Now buttons
        document.querySelectorAll('.buy-now').forEach(button => {
            button.addEventListener('click', function() {
                // Clear cart and add only this product
                cart = [{
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    image: this.dataset.image,
                    quantity: 1
                }];
                
                updateCart();
                showNotification('Ready to checkout!', 'green');
                
                // Open checkout modal
                setTimeout(() => {
                    document.getElementById('checkout-btn').click();
                }, 500);
            });
        });
        
        // Update cart display
        function updateCart() {
            const cartItems = document.getElementById('cart-items');
            const cartCount = document.getElementById('cart-count');
            const cartTotal = document.getElementById('cart-total');
            
            // Update count
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update items list
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="flex items-center py-2 border-b">
                        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded mr-3">
                        <div class="flex-1">
                            <h4 class="font-medium text-blue-900">${item.name}</h4>
                            <div class="flex justify-between text-sm text-gray-600">
                                <span>GHS ${item.price.toFixed(2)}</span>
                                <span>Qty: ${item.quantity}</span>
                            </div>
                        </div>
                        <button class="remove-item text-red-500 hover:text-red-700 ml-2" data-name="${item.name}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');
            }
            
            // Update total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `GHS ${total.toFixed(2)}`;
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemName = this.dataset.name;
                    cart = cart.filter(item => item.name !== itemName);
                    updateCart();
                    showNotification('Item removed', 'red');
                });
            });
        }
        
        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', function() {
            if (cart.length === 0) return;
            
            const checkoutItems = document.getElementById('checkout-items');
            const checkoutTotal = document.getElementById('checkout-total');
            
            // Update checkout items
            checkoutItems.innerHTML = cart.map(item => `
                <div class="flex items-center py-2">
                    <img src="${item.image}" alt="${item.name}" class="w-10 h-10 object-cover rounded mr-3">
                    <div class="flex-1">
                        <h4 class="font-medium text-blue-900">${item.name}</h4>
                        <div class="flex justify-between text-sm text-gray-600">
                            <span>GHS ${item.price.toFixed(2)}</span>
                            <span>Qty: ${item.quantity}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Update checkout total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            checkoutTotal.textContent = `GHS ${total.toFixed(2)}`;
            
            // Show modal
            document.getElementById('checkout-modal').style.display = 'block';
        });
        
        // Close modal buttons
        document.getElementById('close-modal').addEventListener('click', function() {
            document.getElementById('checkout-modal').style.display = 'none';
        });
        
        document.getElementById('close-success-modal').addEventListener('click', function() {
            document.getElementById('success-modal').style.display = 'none';
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === document.getElementById('checkout-modal')) {
                document.getElementById('checkout-modal').style.display = 'none';
            }
            if (event.target === document.getElementById('success-modal')) {
                document.getElementById('success-modal').style.display = 'none';
            }
        });
        
        // Form submission
        document.getElementById('checkout-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, you would process the payment here
            // For this demo, we'll just show a success message
            
            // Hide checkout modal
            document.getElementById('checkout-modal').style.display = 'none';
            
            // Clear cart
            cart = [];
            updateCart();
            
            // Show success modal
            document.getElementById('success-modal').style.display = 'block';
        });
        
        // Show notification
        function showNotification(message, color) {
            const colors = {
                blue: 'bg-blue-600',
                green: 'bg-green-600',
                red: 'bg-red-600'
            };
            
            const notification = document.createElement('div');
            notification.className = `notification ${colors[color] || 'bg-blue-600'} text-white px-4 py-2 rounded-lg shadow-lg flex items-center`;
            notification.innerHTML = `
                <i class="fas ${color === 'green' ? 'fa-check-circle' : color === 'red' ? 'fa-times-circle' : 'fa-info-circle'} mr-2"></i>
                ${message}
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                setTimeout(() => notification.remove(), 500);
            }, 2000);
        }