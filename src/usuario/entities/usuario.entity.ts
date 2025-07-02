import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Psicologo } from '../../psicologo/entities/psicologo.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  correo: string;

  @Column()
  username: string;

  @Column()
  contrasena: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  rol: string;

  @ManyToOne(() => Psicologo)
  @JoinColumn({ name: 'idPsicologo' })
  psicologo: Psicologo;

  @Column()
  idPsicologo: number;
}
