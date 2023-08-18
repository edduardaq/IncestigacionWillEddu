import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Matricula } from './Matricula';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 })
  nombre: String;
  @Column()
  edad: number;

  @OneToMany(() => Matricula, (matricula) => matricula.estudiante)
  matriculas: Matricula[];
}
