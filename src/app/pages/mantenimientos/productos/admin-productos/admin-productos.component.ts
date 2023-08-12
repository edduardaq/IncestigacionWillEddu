import { Component, Inject, Pipe } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductosForm } from 'src/app/shared/formsModels/productosForms';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriasService } from 'src/app/shared/services/categorias.service';
import { Categoria } from 'src/app/shared/models/categoria';
import { formatDate } from '@angular/common';
import { ProductosComponent } from '../productos.component';

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.scss'],
})
export class AdminProductosComponent {
  titulo = 'Crear Producto';
  isCreate = true;

  listaCategorias: Categoria[] = [];
  
  constructor(
    public productoForm: ProductosForm,
    private srvProductos: ProductosService,
    @Inject(MAT_DIALOG_DATA) public data: { producto: any },
    private mensajeria: ToastrService,
    private srvCategorias: CategoriasService,
    public dialogRef: MatDialogRef<AdminProductosComponent>,
  ) {}
  ngOnInit() {
    if (this.data?.producto) {
      this.isCreate = false;
      this.titulo = 'Modificar Producto';
      this.cargarDatosForm();
    } else {
      this.isCreate = true;
      this.titulo = 'Crear Producto';
    }

    this.cargarCombos();
  }
  cargarCombos(): void {
    this.srvCategorias.getAll().subscribe((lista) => {
      this.listaCategorias = lista;
    });
  }

  cargarDatosForm() {
    console.log(this.data.producto.fechaIngreso);

    this.productoForm.baseForm.patchValue({
      id: this.data.producto.id,
      nombre: this.data.producto.nombre,
      precio: this.data.producto.precio,
      stock: this.data.producto.stock,
      fechaIngreso: formatDate(
        this.data.producto.fechaIngreso,
        'yyyy-MM-dd',
        'en'
      ),
      estado: true,
      categoria: this.data.producto.categoria.id,
    });
  }

  guardar() {
    console.log('Método guardar ejecutado');
    if (this.productoForm.baseForm.valid) {
      if (this.isCreate) {
        this.srvProductos.guardar(this.productoForm.baseForm.value).subscribe(
          (dato) => {
            this.productoForm.baseForm.reset();
            this.mensajeria.success('SE GUARDO CORRECTAMENTE');
            this.dialogRef.close(true); // Cierra el diálogo y retorna true
          },
          (error) => {
            this.mensajeria.error(`Se produjo un error. ${error}`);
          }
        );
      } else {
        this.srvProductos.modificar(this.productoForm.baseForm.value).subscribe(
          (dato) => {
            this.productoForm.baseForm.reset();
            this.mensajeria.success('SE MODIFICO CORRECTAMENTE');
            this.dialogRef.close(true); // Cierra el diálogo y retorna true
          },
          (error) => {
            this.mensajeria.error(`Se produjo un error. ${error}`);
          }
        );
      }
    }
  }
}
