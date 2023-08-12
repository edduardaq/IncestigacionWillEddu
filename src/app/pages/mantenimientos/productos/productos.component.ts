// Importaciones de Angular y bibliotecas relacionadas
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

// Importaciones de servicios y modelos propios de la aplicación
import { Productos } from 'src/app/shared/models/productos';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { AdminProductosComponent } from './admin-productos/admin-productos.component';
import { ToastrService } from 'ngx-toastr';

// Decorador del componente, que define su etiqueta, template y estilos
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnDestroy {

  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = [
    'id',
    'nombre',
    'categoria',
    'precio',
    'acciones',
  ];
  
  // Fuente de datos para la tabla
  dataSource = new MatTableDataSource();

  // Lista de suscripciones para gestionarlas y desuscribirse cuando el componente se destruye
  private subscriptions: Subscription[] = [];

  // Constructor del componente donde se inyectan los servicios necesarios
  constructor(
    private srvProductos: ProductosService,
    public dialog: MatDialog,
    private mensajeria: ToastrService,
    private cdRef: ChangeDetectorRef

  ) {}

  // Método que se ejecuta cuando el componente se inicializa
  ngOnInit() {

    this.loadProductos();

    //AQUI  V

    const eliminadosSub = this.srvProductos.productosEliminados$.subscribe(numero => {
      this.mensajeria.success(`Número total de productos eliminados: ${numero}`);
    });
  
    // Añadir la suscripción a la lista de suscripciones
    this.subscriptions.push(eliminadosSub)
    ;
  }

  // Método para cargar los productos desde el servicio
  loadProductos(): void {
    const sub = this.srvProductos.getAll().subscribe(
      (datos) => {
        // Asignar los datos recibidos a la fuente de datos de la tabla
        this.dataSource.data = datos;
        this.cdRef.detectChanges();
      },
      (error) => {
        // Mostrar un mensaje de error si hay algún problema
        this.mensajeria.error(error);
      }
    );
    // Añadir la suscripción a la lista de suscripciones
    this.subscriptions.push(sub);
  }

  // Método para filtrar los datos en la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  // Método para eliminar un producto usando el servicio
  eliminar(id: number): void {
    const sub = this.srvProductos.eliminar(id).subscribe(
      (dato) => {
        // Mostrar un mensaje de éxito cuando se elimina un producto y volver a cargar la lista de productos
        this.mensajeria.success('Producto eliminado con éxito');
        this.loadProductos();
        // Aquí incrementamos el contador en el servicio
        this.srvProductos.incrementarProductosEliminados();
      },
      (err) => {
        // Mostrar un mensaje de error si hay algún problema al eliminar
        this.mensajeria.error('Error al eliminar el producto');
      }
    );
    this.subscriptions.push(sub);
  }

  // Método para mostrar detalles de un producto
  detalle(dato: Productos): void {
    alert(dato.nombre);
  }


  abrirDialog(producto?: Productos): void {
    const dialogRef = this.dialog.open(AdminProductosComponent, {
      width: '700px',
      height: '700px',
      data: { producto },
    });

    // Suscribirse al cierre del diálogo
    dialogRef.afterClosed().subscribe(result => {
      console.log('Estamos en el suscriptor');
      // Si el diálogo retorna 'true', significa que se realizó una modificación exitosa
      if (result === true) {
        this.loadProductos();
      }
    })
  }
  

  // Método que se ejecuta cuando el componente se destruye, útil para limpieza y desuscribirse de observables
  ngOnDestroy(): void {
    // Desuscribirse de todos los observables para prevenir pérdidas de memoria
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
