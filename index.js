const express = require('express');
const server = express();

server.use(express.json());

const projects = [];

// Middleware:
// Middleware responsavel por verificar se o projeto existe.
//***********************************************************
function checkProject(req, res, next) {
	const { id } = req.params;
	const project = projects.find(p => p.id == id);

	if (!project) {
		return res.status(400).json({ error: 'O projeto não foi encontrado' });
	}

	return next();
}

// Middleware:
// Middleware global que retorna o numero de requisições feitas na aplicação.
//***************************************************************************
function logRequests(req, res, next) {

  console.count("Número de requisições");

	return next();
}

server.use(logRequests);

// GET:
// Retorna todos os projetos cadastrados.
//***************************************
server.get('/projects', (req, res) => {
  
	return res.json(projects);
});

// GET:
// Retorna um unico projeto referente ao [id] informado nos parâmetros da rota.
//*****************************************************************************
server.get('/projects/:id', checkProject, (req, res) => {
	const { id}  = req.params;

	return res.json(projects[id]);
});

// POST:
// Cadastra um projeto com [id] projeto.
//***************************************
server.post('/projects', (req, res) => {
	const { id, title } = req.body;

	const project = {
		id,
		title,
		tasks: []
	};

	projects.push(project);

	return res.json(project);
});

// PUT:
// Altera o titulo do projeto referente ao [id] nos parâmetros da rota.
//*******************************************************************
server.put('/projects/:id', checkProject, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	const project = projects.find(p => p.id == id);

	project.title = title;

	return res.json(project);
});

// DELETE:
// Deleta o projeto referente ao [id] informando nos parâmetros da rota.
//********************************************************************
server.delete('/projects/:id', checkProject, (req, res) => {
	const { id } = req.params;

	const projectIndex = projects.findIndex(p => p.id == id);

	projects.splice(projectIndex, 1);

	return res.send();
});

// POST:
// Cadastra uma tarefa a ser realizada no projeto referente ao [id] informado nos parametros da rota.
//*************************************************************************************************
server.post('/projects/:id/tasks', checkProject, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	const project = projects.find(p => p.id == id);

	project.tasks.push(title);

	return res.json(project);
});

server.listen(3000);