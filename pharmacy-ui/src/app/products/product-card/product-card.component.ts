import {Component, computed, inject, Input, signal} from "@angular/core";
import {DecimalPipe, NgClass, NgForOf, NgIf, NgOptimizedImage, SlicePipe} from "@angular/common";
import {ProductResponse} from "../../services/models/product-response";
import {LucideAngularModule} from "lucide-angular/src/icons";
import {icons} from "lucide-angular";
import {Router} from "@angular/router";
import {MedicineApIsService} from "../../services/services/medicine-ap-is.service";
import {CartRequest} from "../../services/models/cart-request";
import {CartResponse} from "../../services/models/cart-response";
import {CartControllerService} from "../../services/services/cart-controller.service";
import {TokenService} from "../../services/token/token.service";
import {jwtDecode} from "jwt-decode";
import {CartStore} from "../../cart/cart-modal/cart.service";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    SlicePipe,
    LucideAngularModule,
    DecimalPipe,
    NgClass
  ],
  templateUrl: './product-card.component.html',
  styleUrl: 'product-card.component.css'
})
export class ProductCardComponent {
  private router = inject(Router);


  @Input() medicine: ProductResponse = {};
  @Input() type: 'list' | 'special_offers' | 'trending' | 'new_arrival'  = 'list' //card type
  protected readonly icons = icons;
  cartStore = inject(CartStore);

  cartProductIds = computed(() =>
    new Set(
      this.cartStore.cart()
        .flatMap(item => item.product?.map(p => p.productId))
        .filter((id): id is number => id !== undefined)
    )
  );

  isInCart(productId: number): boolean {
    return this.cartProductIds().has(productId);
  }

  viewDetails(medicine: ProductResponse) {
    if (!medicine.productId) {console.log("Error ") ; return}
    this.router.navigate(['/products', medicine.productId]);
  }
}
