import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Todo {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    status: string

    @Column()
    priority: number

    @Column()
    deadline: Date

    @Column()
    date_create: Date

    @Column()
    date_update: Date

    @Column({ nullable: true  })
    date_complete: Date

}
