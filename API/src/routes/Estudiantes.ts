// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { Router } from 'express';
import { StudentComponent } from '../controller/EstudiantesController';


const routes: Routes ;
routes.get("", StudentComponent.getAll);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
