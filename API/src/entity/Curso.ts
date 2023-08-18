import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Matricula } from './Matricula';

@Entity()
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 })
  nombre: String;
  @Column()
  creditos: number;

  @OneToMany(() => Matricula, (matricula) => matricula.curso)
  matriculas: Matricula[];
}
