import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  isMain: boolean;

  @Column()
  todo: string;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Todo, (todo) => todo.children)
  parent: Todo;

  @OneToMany(() => Todo, (todo) => todo.parent, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  children: Todo[];
}
