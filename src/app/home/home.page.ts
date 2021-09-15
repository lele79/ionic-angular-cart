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
	urls = [];
	storage: any;
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
		this.storage = getStorage(app, environment.firebaseConfig.storageBucket);
		console.log('storage', this.storage)
		const listRef = ref(this.storage, 'gs://shopping-fruit.appspot.com');
		listAll(listRef)
			.then((res) => {
				res.prefixes.forEach((folderRef) => {
					console.log('folderRef', folderRef)

					// All the prefixes under listRef.
					// You may call listAll() recursively on them.
				});
				res.items.forEach(async (itemRef) => {
					console.log('itemRef', itemRef)
					const url = await this.getUrlDownload(itemRef.fullPath)
					this.urls.push(url)
					console.log('urlurls', this.urls)


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

	async getUrlDownload(fullPath: string): Promise<any> {
		const refer = ref(this.storage, fullPath)
		return getDownloadURL(refer)
	}

}
