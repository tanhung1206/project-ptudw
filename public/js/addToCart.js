// JavaScript để thêm sản phẩm vào giỏ hàng
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const productId = this.getAttribute('data-id');

        fetch('/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: productId, quantity: 1 })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log(data); // In thông báo từ server
                alert(data); // Hiển thị thông báo cho người dùng
            })
            .catch(error => {
                console.error('Error:', error);
            });
        document.querySelector('.badge').textContent = parseInt(document.querySelector('.badge').textContent) + 1;
    });
});