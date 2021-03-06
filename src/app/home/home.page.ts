import { CartService, Product } from './../services/cart.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
	cart = [];
	products = [];
	urls = [];
	storage: any;
	cartItemCount: BehaviorSubject<number>;
	size = {0: 'causale', 1: 'piccolo', 2: 'medio', 3: 'grande'}
	@ViewChild('cart', {static: false, read: ElementRef})fab: ElementRef;

	constructor(private cartService: CartService, private modalCtrl: ModalController) {
		this.products = this.cartService.getProductsWithoutImage();
	}

	 async ngOnInit() {

		this.products =await this.cartService.getProducts();
		console.log('this.products', this.products)
		this.cart = this.cartService.getCart();
		this.cartItemCount = this.cartService.getCartItemCount();
	}

	addToCart(product: Product) {
		console.log(`add ${product.name} to cart`)
		this.animateCSS('jello');
		this.cartService.addProduct(product);
	}

	async openCart() {
		this.animateCSS('bounceOutLeft', true);

		const modal = await this.modalCtrl.create({
			component: CartModalPage,
			cssClass: 'cart-modal'
		});
		modal.onWillDismiss().then(() => {
			this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft');
			this.animateCSS('bounceInLeft');
		});
		modal.present();
	}

	// copied from animate.css github page: https://github.com/daneden/animate.css
	animateCSS(animationName, keepAnimated = false) {
		const node = this.fab.nativeElement;
		node.classList.add('animated', animationName);


		function handleAnimationEnd() {
			if (!keepAnimated) {
				node.classList.remove('animated', animationName);
			}
			node.removeEventListener('animationend', handleAnimationEnd);
		}
		node.addEventListener('animationend', handleAnimationEnd);
	}
	changeValue(value) {
		console.log('value', value.target.id)
		let count = 0;
		for (const item of this.products) {
			count++;
			if(item.id === value.target.id ) {
				this.products[value.target.id].size = value ;
			}
		}
		console.log('this.products', this.products)
		return undefined;
	}

	refreshPrice(size) {
		return this.cartService.mulSize(size);
	}

}
