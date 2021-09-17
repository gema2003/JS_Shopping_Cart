(() => {

	const xhttp = new XMLHttpRequest();
	xhttp.open('GET', '../components/base.json', true);
	xhttp.send();

	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			const data = JSON.parse(this.responseText);
			const response = document.getElementById('content');
			response.innerHTML = '';

			for(let item of data) {
				response.innerHTML += `
					<div class="col-lg-4 col-md-6">
						<div class="card mt-3 rounded-3">
							<div class="product${item.id} align-item-center p-3 text-center">
								<img src="${item.url}" alt="${item.codigo}" class="rounded" height="286" width="260">
								<h5 class="card-title">${item.name}</h5>
								<div class="mt-3 info">
									<span class="text-secondary d-block">${item.codigo}</span>
									<span class="text-info fw-bold">${item.medida}</span>
								</div>
								<div class="mt-3 fs-3 fw-bold text-success">
									<span>$ ${item.price}</span>
									<div class="star mt-3 align-item-center text-warning">
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
										<i class="fa fa-star"></i>
									</div>
								</div>
							</div>
							<div class="p-2 mt-3 d-grid gap-2">
								<button type="button" class="btn btn-primary text-uppercase text-center text-light fs-5 fw-bold rounded-pill p-2" onclick="addToCart(${item.id});">añadir al carrito &plus;</button>
							</div>
						</div>
					</div>
				`
			}

		}
	}

})();

let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

const getIndex = id => cart.indexOf(cart.find(item => item.id === id));


(popCart = () => {

	$.ajax({
		type: 'GET',
		url: '../components/base.json',
		success: (data) => {
			if(cart.length > 0) {
				$("header .offcanvas-body").html(`
					<div class="card mb-3"></div>
				`);
				cart.forEach((item, id) => {
					$("header .offcanvas-body .card").append(`
						<div class="row g-0">
    						<div class="col-4 col-md-4">
      							<img src="${data[item.id - 1].url}" class="img-fluid rounded-start" alt="${data[item.id - 1].codigo}">
    						</div>
    						<div class="col-7 col-lg-7">
      							<div class="card-body">
        							<span class="card-title fw-bold">${data[item.id - 1].name}</span><br>
        							<span class="card-text">(${data[item.id - 1].codigo})</span><br>
        							<span class="card-text">Cantidad = ${item.qty}</span><br>
        							<span class="text-success">Monto = $ ${(item.qty*data[item.id - 1].price).toFixed(2)}</span>
      							</div>
    						</div>
    						<div class="col-1 col-lg-1">
    							<button type="button" class="btn btn-fluid text-danger" onclick="removeCartItem(${item.id});"><i class="fas fa-times"></i></button>
    						</div>
  						</div>
					`)
					$("main .container .fade .table tbody").append(`
    					<tr>
      					<th scope="row">${item.id}</th>
      					<td>${data[item.id - 1].codigo}</td>
      					<td>${data[item.id - 1].name}</td>
      					<td>${item.qty}</td>
      					<td>${item.qty*data[item.id - 1].price}</td>
    					</tr>
						`)
				});
				$("header .offcanvas-body").append(`
					<div class="card text-center">
  						<div class="card-body">
    						<h5 class="card-title text-primary">Monto Total</h5>
    						<p class="card-text text-success fs-3 fw-bold"><span class="billAmt">$ ${(cart.reduce((accu, item, id) => accu += item.qty*data[item.id -1].price, 0)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
    						<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="eCommerce@gmail.com">Efectuar Compra</button>
    						<button type="button" class="btn btn-danger" onclick="resetCart();">Cancelar Compra</button>
  						</div>
					</div>
				`)
			}else {
				$("header .offcanvas-body").html(`	
                    <div class="card bg-danger" style="width: auto;">
  						<div class="card-body text-center">
    						<h5 class="card-title text-light">Your cart is empty</h5>
  						</div>
					</div>
                `);
			}
		}
	});
	cart.reduce((accu, item) => accu += item.qty, 0) < 1 
        ? $(".cartCount").find("sup").css('color', '#ff0000').text(cart.reduce((accu, item) => accu += item.qty, 0)) 
        : $(".cartCount sup").css('color', '#008000').text(cart.reduce((accu, item) => accu += item.qty, 0));

})();

const addToCart = id => {
    if(cart.length > 0){
        getIndex(id) > -1 
        ? cart[getIndex(id)].qty += 1 
        : cart.push({id, qty: 1});
    }
    else{
        cart.push({id, qty: 1});
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    popCart();
};

const removeCartItem = id => {
    getIndex(id) > -1 
    ? cart.splice(getIndex(id), 1) 
    : '';
    localStorage.setItem('cart', JSON.stringify(cart));
    popCart();
};

const resetCart = () => {
    if(confirm("Desea eliminar tus compras?")){
        cart.splice(0, cart.length);
        localStorage.setItem('cart', JSON.stringify(cart));
        popCart();
    }
};
