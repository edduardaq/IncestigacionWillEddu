import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from './Estudiante';
import { Curso } from './Curso';

@Entity()
export class Matricula {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.matriculas)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Curso, (curso) => curso.matriculas)
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;
}
