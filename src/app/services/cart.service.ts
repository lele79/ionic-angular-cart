import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Product {
  id: number;
  name: string;
  price: number;
  amount: number;
  size: number;
  quantity: number
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  data: Product[] = [
    { id: 0, name: 'Arancio moro/Tarocco', price: 1.5, amount: 0, size: 0, quantity: 1 },
    { id: 1, name: 'Arancio Navellino/Washington', price: 2, amount: 0, size: 0, quantity: 1 },
    { id: 2, name: 'Arancio Thompson', price: 3, amount: 0, size: 0, quantity: 1 },
    { id: 3, name: 'Arancio Comune', price: 1, amount: 0, size: 0, quantity: 1 },
    { id: 4, name: 'Clementino', price: 2, amount: 0, size: 0, quantity: 1 },
    { id: 5, name: 'Limone', price: 3, amount: 0, size: 0, quantity: 1 },

  ];

  private cart = [];
  private cartItemCount = new BehaviorSubject(0);

  constructor() {}

  getProducts(): Product[] {
    return this.data;
  }

  getCart(): Product[] {
    console.log("this.cart: ", this.cart);
    return this.cart;
  }

  getCartItemCount(): BehaviorSubject<number> {
    return this.cartItemCount;
  }

  addProduct(product: Product) {
    let added = false;
    for (let p of this.cart) {
      if (p.id === product.id) {
        p.amount += 1;
        p.quantity += 1;
        added = true;
        break;
      }
    }
    if (!added) {
			product.amount = 1;
			product.quantity = 1;
			this.cart.push(product);
			console.log(`product ${product.name} pushed to cart`);
		}
		this.cartItemCount.next(this.cartItemCount.value + 1);
  }

	decreaseProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        p.amount -= 1;
        p.quantity -= 1;
        if (p.quantity == 0) {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }

  removeProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
      }
    }
  }
  mulSize( size) {
    if (size === 0) { // random
      return 1;
    }
    if (size === 1) { // small
      return 1.2;
    }
    if (size === 2) { // medium
      return 1.5;
    }
    if (size === 3) { // Large
      return 2;
    }
  }
}
