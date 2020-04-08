const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
var reqs = 0;

function checkProjectExists(req, res, next) {
    const project = projects.find(pj => pj.id == req.body.id);

    if (project) {
        return res.status(400).json({ error: `Project ID ${project.id} Already been Registered` });
    }

    return next();
}

function checkIdExists(req, res, next) {
    const project = projects.find(pj => pj.id == req.params.id);

    if (!project) {
        return res.status(400).json({ error: 'Project Not Found' });
    }

    req.project = project;

    return next();
}

server.use((req, res, next) => {
    reqs++;

    console.log(`Já foram realizadas ${reqs} Requisições`);

    return next();
});

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.get('/projects/:id', checkIdExists, (req, res) => {
     return res.json(req.project);
});

server.post('/projects', checkProjectExists, (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    }

    projects.push(project);

    return res.json(projects);
});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
    const { task } = req.body;

    const project = req.project;

    project.tasks.push(task);

    return res.json(project);
});

server.put('/projects/:id', checkIdExists, (req, res) => {
    const { title } = req.body;
    const project = req.project;

    project.title = title;

    return res.json(project);
});

server.delete('/projects/:id', checkIdExists, (req, res) => {
    const index = projects.findIndex(pj => pj.id == req.params.id);

    projects.splice(index, 1);

    return res.json({ projectDeleted: req.project });
});

server.listen(3000);