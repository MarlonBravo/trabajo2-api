import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ProductService } from '../../services/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
  standalone: true, 
  imports: [CommonModule, RouterModule] 
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  createProduct(): void {
    alert('Pendiente');
  }

  
  editProduct(id: number): void {
  this.router.navigate(['/products/edit', id]);
}

  deleteProduct(id: number): void {
  if (confirm('¿Seguro que deseas eliminar este producto?')) {
    this.productService.deleteProduct(id.toString()).subscribe({
      next: () => {
        this.loadProducts(); // Recarga la lista
      },
      error: (err) => {
        console.error('Error al eliminar', err);
        alert('Error al eliminar el producto');
      }
    });
  }
}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  goToCreate(): void {
  this.router.navigate(['/products/new']);
}
}
