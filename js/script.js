

// Требования:
// 1. Задача должна быть выполнена на ванильном JavaScript без использования JavaScript библиотек и фреймворков;
// 2. При выполнении задач разрешается добавлять id, пользовательские атрибуты элементам;
// 3. Код должен быть оформлен в отдельный js файл.
//
//
// Tasks:
// 1. При добавлении товаров реализовать вывод количества товаров и общей цены
//    в блоке вверху окна ( .top-cart-info__item ) в виде
//
//    Товаров в корзине - XXX, на сумму XXX грн
//
// 2. Самостоятельно распределить товары по категориям (по 4 товара в каждую категорию)
//    согласно значениям элемента select Категория
//   Реализовать фильтрацию товаров по категориям и цене.
//   Отбор товаров должен работать по обеим фильтрам.
//
// 3. При нажатии на кнопку ОФОРМИТЬ ЗАКАЗ вывести модальное окно с 2-мя полями - Имя, email и кнопкой Отправить
//    При нажатии на кнопку Отправить проверить заполнение полей формы
//    - Если поля не заполнены (или заполнены только пробелами) не разрешать отправку формы,
//    при этом вывести сообщение в alert
//    - Если поля прошли валидацию вывести через alert пользователю сообщение с благодарностью за покупки,
//      очистить верхний блок c информацией о товарах, добавленных в корзину
//     Товаров в корзине - XXX, на сумму XXX грн



;(function () {
    "use strict";
    // ================================== Cart ===============================================
     function Cart(){

         this.products = [];

         this.getProducts = function () {
             return this.products;
         };

         this.buyProducts = function (product) {
             this.products.push({
                 "name": product.name,
                 "price": product.price,
                 "quantity": product.quantity,
             })
         };

         this.getTotalQuantity = function() {
             let totalQuantity = 0;
             for (let i = 0; i < this.products.length; i++){
                 totalQuantity += this.products[i].quantity;
             }
             return  totalQuantity;
         };

         this.getTotalSum = function() {
             let totalSum = 0;
             for (let i = 0; i < this.products.length; i++){
                 totalSum += this.products[i].quantity*this.products[i].price;
             }
             return  totalSum;

         };

         this.getCartStatus = function() {
             return {
                 "totalQuantity": this.getTotalQuantity(),
                 "totalSum": this.getTotalSum()
             }
         };

         this.cleanCart = function(){
             this.products = [];
         }
     }

     function  renderCartStatus(cart) {

         let cartStatus = cart.getCartStatus();
         document.querySelectorAll(".red-info")[0].innerHTML = cartStatus.totalQuantity;
         document.querySelectorAll(".red-info")[1].innerHTML = cartStatus.totalSum;
     }

     function buyProduct(e) {

         let  name,
              price,
              quantity,
              product = {};
         name = e.target.parentElement.parentElement.children[0].innerHTML;
         price = + e.target.parentElement.firstElementChild.innerHTML.split(' ')[0];
         quantity = + e.target.parentElement.children[1].children[0].value;
         if ( quantity <= 0) {
            alert ("Выберите количество товара!");
            quantity = 0;
         }

         product.name = name;
         product.price = price;
         product.quantity = quantity;
         cart.buyProducts(product);
         console.log(cart.products);
         renderCartStatus(cart);
    }

    // ==================================Filters==============================================


    function filterProducts(category, price) {

        let productPrice, productCategory;
        let elem = document.querySelectorAll(".product-box__item");
        for (let i = 0; i <  elem.length; i++ ) {
            elem[i].classList.add("hidden");
            productPrice = + elem[i].children[2].firstElementChild.innerHTML.split(' ')[0];
            productCategory = elem[i].dataset.category;

            if ((category === "0" || productCategory === category) && (price === 0 || productPrice <  price)){
                elem[i].classList.remove("hidden");
            }
        }
    }

    function onFilterChange(e){

        let categoryFilter = document.querySelector(".select-box .select-control");
        let priceFilter = document.querySelector(".price-select-box .select-control");

        if (!categoryFilter || !priceFilter) {
            alert("Нет селекторов!");
            return;
        }

        let category = categoryFilter.options[categoryFilter.selectedIndex].value;
        let price = parseInt(priceFilter.options[priceFilter.selectedIndex].value);

        filterProducts(category, price);
    }

    // ======================================= Make Order ================================================

    function makeOrder(e) {
        if (cart.getTotalQuantity() === 0) {
            alert("Выберите хотя бы один товар.");
            return;
        }
        let modalWindow = document.querySelector(".modal-window");
        modalWindow.classList.remove("hidden");
    }

    function formValidate(e) {

        let isValid = true,
            login = document.getElementsByName("userName")[0],
            email = document.getElementsByName("userEmail")[0];
        console.log(login.value.trim());
        if (login.value.trim().length === 0) {
            isValid = false;
        }
        if (email.value.trim().length === 0) {
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
            alert("Вcе поля ввода должны быть заполнены");
            return false;
        } else {
            alert("Спасибо, Ваш заказ принят.");
        }
        login.value = "";
        email.value = "";
        return true;
    }

    let inputs = document.querySelectorAll(".qty__item");
    for (let i = 0; i < inputs.length; i++ ) {
        inputs[i].value = 1;
    }


    let cart = new Cart();

    let productBtn = document.querySelectorAll(".product-box__btn");
    for (let i = 0; i < productBtn.length; i++ ) {
        productBtn[i].addEventListener("click", function(e) {
            buyProduct(e);
        });
    }

    let filter = document.querySelectorAll(".select-control");
    for (let i = 0; i < filter.length; i++ ) {
        filter[i].addEventListener("change", onFilterChange);
    }

    let orderBtn = document.querySelector(".btn-check");
    orderBtn.addEventListener("click", function(e) {
            makeOrder(e);
    });

    let modalWindow = document.querySelector(".modal-window");
    modalWindow.addEventListener("click", function(e){
        if ( e.eventPhase === 2) {
            this.classList.add("hidden");
        } else {
            e.stopPropagation();
        }
    });
    let closeBtn = document.querySelector(".modal-window__closeBtn");
    closeBtn.addEventListener("click", function (e) {
        modalWindow.classList.add("hidden");
    });

    let orderForm = document.querySelector(".modal-window__form");
    orderForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (formValidate(e)) {
            cart.cleanCart();
            renderCartStatus(cart);
            modalWindow.classList.add("hidden");
            console.log(cart.products);
        }
    });

    onFilterChange();
    renderCartStatus(cart);


})();