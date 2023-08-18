import { Component } from '@angular/core';
import { StudentService } from '../services/student.service';
import { Matricula } from '../entity/Matricula'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  constructor(private studentService: StudentService) {}

  enrollStudent(studentId: number, courseId: number): void {
    const matricula: Matricula = { estudianteId: studentId, cursoId: courseId }; // Ajusta los nombres de las propiedades según la entidad Matricula
    this.studentService.enrollStudent(matricula).subscribe(
      (response) => {
        console.log('Student enrolled successfully:', response);
      },
      (error) => {
        console.error('Error enrolling student:', error);
      }
    );
  }
}
