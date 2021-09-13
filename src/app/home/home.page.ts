import { CartService, Product } from './../services/cart.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';

import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import {environment} from '../../environments/environment';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
	cart = [];
	products = [];
	dimension = [];
	cartItemCount: BehaviorSubject<number>;
	size = {0: 'causale', 1: 'piccolo', 2: 'medio', 3: 'grande'}
	@ViewChild('cart', {static: false, read: ElementRef})fab: ElementRef;

	constructor(private cartService: CartService, private modalCtrl: ModalController) {}

	ngOnInit() {
		this.products = this.cartService.getProducts();
		this.cart = this.cartService.getCart();
		this.cartItemCount = this.cartService.getCartItemCount();
		const app = initializeApp(environment.firebaseConfig);
		console.log('app', app)
		const storage = getStorage(app, environment.firebaseConfig.storageBucket);
		console.log('storage', storage)
		const pathReference = ref(storage, 'valencia.jpg');
		console.log('pathReference', pathReference)
		const gsReference = ref(storage, 'gs://bucket/valencia.jpg');
		console.log('gsReference', gsReference)
		getDownloadURL(ref(storage, 'valencia.jpg'))
			.then((url) => {

				console.log('url', url)
				// This can be downloaded directly:
				const xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.onload = (event) => {
					const blob = xhr.response;
				};
				xhr.open('GET', url);
				xhr.send();

				// Or inserted into an <img> element
				const img = document.getElementById('myimg');
				img.setAttribute('src', url);
			})
			.catch((error) => {
				// Handle any errors
			});

		const listRef = ref(storage, 'gs://shopping-fruit.appspot.com');
		listAll(listRef)
			.then((res) => {
				res.prefixes.forEach((folderRef) => {
					console.log('folderRef', folderRef)

					// All the prefixes under listRef.
					// You may call listAll() recursively on them.
				});
				res.items.forEach((itemRef) => {
					console.log('itemRef', itemRef)
					// All the items under listRef.
				});
			}).catch((error) => {
			console.log('error', error)
		});

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
