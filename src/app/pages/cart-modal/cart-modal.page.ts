import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Product } from '../../services/cart.service';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'app-cart-modal',
	templateUrl: './cart-modal.page.html',
	styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {
	cart: Product[] = [];
	total: number;

	constructor(
		private cartService: CartService,
		private modalCtrl: ModalController
	) {}

	ngOnInit() {
		this.cart = this.cartService.getCart();
	}

	decreaseCartItem(product: Product): void {
		this.cartService.decreaseProduct(product);
		this.getTotal()

	}

	increaseCartItem(product: Product): void {
		this.cartService.addProduct(product);
		this.getTotal()
	}

	removeCartItem(product: Product): void {
		this.cartService.removeProduct(product);
	}

	getTotal(): number {
		return this.cart.reduce((i, j) => i + j.price * j.amount* this.cartService.mulSize(j.size), 0);
	}

	close(): void {
		this.modalCtrl.dismiss();
	}
	priceDimension(price, size) {
		if(size === 0) { // random
			return price;
		}
		if(size === 1){ // small
			return price*1.2;
		}
		if(size === 2){ // medium
			return price*1.5;
		}
		if(size === 3){ // Large
			return price*2;
		}
	}

	checkout() {}
}
