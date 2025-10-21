import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductFormComponent implements OnInit {
  product = {
    name: '',
    price: 0,
    stock: 0,
    color: '',
    brand: ''
  };
  isEditing = false;
  productId = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.productId = id;
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = { ...product }; // Copia los datos
      },
      error: (err) => {
        console.error('Error al cargar producto', err);
        alert('Producto no encontrado');
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.productService.updateProduct(this.productId, this.product).subscribe({
        next: () => {
          alert('Producto actualizado con éxito');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          alert('Error al actualizar el producto');
        }
      });
    } else {
      this.productService.createProduct(this.product).subscribe({
        next: () => {
          alert('Producto creado con éxito');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error al crear', err);
          alert('Error al crear el producto');
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}