import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Productos } from '../models/productos';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private productosEliminadosSubject = new BehaviorSubject<number>(0);
  public productosEliminados$ = this.productosEliminadosSubject.asObservable();

  incrementarProductosEliminados(): void {
    this.productosEliminadosSubject.next(this.productosEliminadosSubject.value + 1);
  }
  
  refresh() {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  getAll(): Observable<Productos[]> {
    return this.http
      .get<Productos[]>('http://localhost:3000/productos')
      .pipe(catchError(this.handlerError));
  }
  guardar(producto: Productos): Observable<Productos> {
    return this.http
      .post<Productos>('http://localhost:3000/productos', producto)
      .pipe(catchError(this.handlerError));
  }
  modificar(producto: Productos): Observable<Productos> {
    console.log('mod');
    console.log(producto);
    return this.http
      .patch<Productos>('http://localhost:3000/productos', producto)
      .pipe(catchError(this.handlerError));
  }

  eliminar(id: number): Observable<Productos> {
    return this.http
      .delete<Productos>('http://localhost:3000/productos/' + id)
      .pipe(catchError(this.handlerError));
  }

  handlerError(error: HttpErrorResponse) {
    let mensaje = 'Error desconocido, reporte al adminstrador.';
    /*
    const values = Object.values(error.error);
    values.map((error) => {
      mensaje += error.constraints.property;
    });
*/

    //class validar

    if (error?.error) {
      mensaje = error?.error?.mensaje;
    }

    return throwError(() => new Error(mensaje));
  }
}
