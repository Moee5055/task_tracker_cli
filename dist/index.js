#!/usr/bin/env node
import process from "node:process";
import fs, { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, "..");
const filePath = path.join(rootPath, "tasks.json");
const readFile = async () => {
    try {
        const jsonString = await fs.readFile(filePath, { encoding: "utf-8" });
        const tasks = JSON.parse(jsonString);
        return tasks;
    }
    catch (err) {
        console.error(err);
        return [];
    }
};
const addTask = async () => {
    const newTasks = process.argv.slice(3);
    const allTasks = await readFile();
    newTasks.forEach((task) => {
        const newTask = {
            id: Math.floor(1000 + Math.random() * 9000),
            description: task,
            createdAt: new Date().toLocaleString(),
            updateAt: new Date().toLocaleString(),
            status: "todo",
        };
        allTasks.push(newTask);
    });
    await writeFile(filePath, JSON.stringify(allTasks, null, 2), "utf-8");
    console.log("Task added successfully");
};
const updateTask = async (id, description) => {
    try {
        const allTasks = await readFile();
        const updateTasks = allTasks.map((task) => {
            if (task.id === id) {
                return { ...task, description: description };
            }
            else {
                return task;
            }
        });
        await writeFile(filePath, JSON.stringify(updateTasks, null, 2), "utf-8");
        console.log("Task update succesfully");
    }
    catch (err) {
        console.error("Error writin to file", err);
    }
};
const deleteTask = async (id) => {
    try {
        const allTasks = await readFile();
        const updatedTasks = allTasks.filter((task) => task.id !== id);
        await writeFile(filePath, JSON.stringify(updatedTasks, null, 2), "utf-8");
        console.log(`Task deleted succesfully with id ${id}`);
    }
    catch (err) {
        console.error("Error writing to file:", err);
    }
};
const markTaskAsInProgress = async (id) => {
    const allTasks = await readFile();
    const updatedTasks = allTasks.map((task) => {
        if (task.id === id) {
            return { ...task, status: "in-progress" };
        }
        else {
            return task;
        }
    });
    await writeFile(filePath, JSON.stringify(updatedTasks, null, 2), "utf-8");
    console.log(`Status updated to in-progress for id ${id}`);
};
const markTaskAsInDone = async (id) => {
    const allTasks = await readFile();
    const updatedTasks = allTasks.map((task) => {
        if (task.id === id) {
            return { ...task, status: "done" };
        }
        else {
            return task;
        }
    });
    await writeFile(filePath, JSON.stringify(updatedTasks, null, 2), "utf-8");
    console.log(`Status updated to done for id ${id}`);
};
const filterTaskByStatus = async (status) => {
    try {
        const allTasks = await readFile();
        const taskByStatus = allTasks.filter((task) => task.status === status);
        return taskByStatus;
    }
    catch (err) {
        console.error("Error reading file:", err);
        return [];
    }
};
const listAllTasks = async (status) => {
    let tasks;
    switch (status) {
        case "done":
            tasks = await filterTaskByStatus(status);
            console.log(tasks);
            break;
        case "in-progress":
            tasks = await filterTaskByStatus(status);
            console.log(tasks);
            break;
        case "todo":
            tasks = await filterTaskByStatus(status);
            console.log(tasks);
            break;
        default:
            const allTasks = await readFile();
            console.log(allTasks);
    }
};
function main() {
    const command = process.argv[2];
    switch (command) {
        case "add": {
            addTask();
            break;
        }
        case "update": {
            let id = Number(process.argv[3]);
            const description = process.argv[4];
            updateTask(id, description);
            break;
        }
        case "delete": {
            let id = Number(process.argv[3]);
            deleteTask(id);
            break;
        }
        case "mark-in-progress": {
            let id = Number(process.argv[3]);
            markTaskAsInProgress(id);
            break;
        }
        case "mark-done": {
            let id = Number(process.argv[3]);
            markTaskAsInDone(id);
            break;
        }
        case "list":
            if (process.argv.includes("done") ||
                process.argv.includes("in-progress") ||
                process.argv.includes("todo")) {
                listAllTasks(process.argv[3]);
            }
            else {
                listAllTasks();
            }
            break;
        default:
            console.error("Invalid Command.");
    }
}
main();
