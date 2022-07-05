import "reflect-metadata";
import { AppDataSource } from "../data-source"
import { Todo } from "./entity/Todos"
import express from 'express';

const app = express();

app.listen(8080, async () => {
    console.log("starting");
    
    await AppDataSource.initialize();

    const repo = await AppDataSource.getRepository(Todo);
    const todo = new Todo();

    
    todo.title = "encoding not allow";
    todo.priority = 1;
    todo.status = "Todo";
    todo.deadline = new Date();
    todo.date_create = new Date();
    todo.date_update = new Date();
    todo.date_complete = null;

    await repo.save(todo);

    const dto = await repo.find();
    console.log("==============");
    console.log(dto);
    console.log("clear");
});
