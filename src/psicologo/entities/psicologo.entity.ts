import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Psicologo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  correo: string;

  @Column()
  contrasena: string; // hash

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ nullable: true })
  fotoPerfilUrl: string;

  @Column()
  especialidad: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @Column()
  cedulaProfesional: string;

  @Column({ nullable: true })
  cedulaDocumento: string;

  @Column()
  telefono: string;
}
