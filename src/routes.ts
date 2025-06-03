import express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import type { Router as ExpressRouter } from 'express';
import { signIn } from './controllers/login';
import { getTeams } from './controllers/teams/get-teams';
import { createTeams } from './controllers/teams/create-teams';
import { getAllProject, getProject } from './controllers/projects/get-project';
import { createProjects } from './controllers/projects/create-project';
import { getProjectsAnalytics } from './controllers/projects/get-projects-analytics';
import { getTeamAnalytics } from './controllers/teams/get-teams-analytics';
import { getTasks } from './controllers/tasks/get-tasks';
import { updateTask } from './controllers/tasks/update-tasks';
import { createTask } from './controllers/tasks/create-tasks';
import { updateTaskKanban } from './controllers/tasks/update-tasks-kanban';
import { deleteTask } from './controllers/tasks/delete-tasks';
import { updateTeams } from './controllers/teams/update-teams';
import { deleteTeams } from './controllers/teams/delete-teams';
import { deleteProjects } from './controllers/projects/delete-projects';
import { updateProjects } from './controllers/projects/update-projects';
import { getMembers } from './controllers/members/get-members';
import { getUsers } from './controllers/users/get-users';
import { updateUsers } from './controllers/users/update-users';
import { validationRefreshToken } from './controllers/users/validation-refresh-token';
import { getMyUser } from './controllers/users/get-my-data';
import { IsAuthenticated } from './middlewares/Authentication';
import { createCommentTask } from './controllers/tasks/comment/create';
import { getCommentTask } from './controllers/tasks/comment/get';
import { deleteCommentTask } from './controllers/tasks/comment/delete';
import { updateCommentTask } from './controllers/tasks/comment/update';
import { getReportsProductivity } from './controllers/reports/get-productivity';
import { getReportsProductivityMember } from './controllers/reports/get-productivity-member';
import { startStopTask } from './controllers/tasks/start-stop-task';
import { getTasksHistory } from './controllers/tasks/get-history';
import { getTasksActivityRegistration } from './controllers/tasks/get-activity-registration';
import { getTutorials } from './controllers/tutorials/get-tutorials';
import { updateTasksActivityRegistration } from './controllers/tasks/update-activity-registration';
import { getPointMark, updatePointMark } from './controllers/users/point-mark';
import { uploadAttachmentsTask } from './controllers/tasks/upload-attachments';
import { deleteAttachement } from './controllers/tasks/delete-attachment';
import { getAttachmentsTask } from './controllers/tasks/get-attachments';
import { updateArchiveTask } from './controllers/tasks/update-archive-tasks';
import { getInbox } from './controllers/inbox/get-inbox';
import { updateInbox } from './controllers/inbox/update-inbox';
import { sendToken } from './controllers/users/send-token';
import { sendSocket, sendSocketRequest } from './controllers/socket';
import { createInbox } from './controllers/inbox/create-inbox';
import { getInExecutionTask } from './controllers/tasks/get-in-execution';
import { getCostAnalysisTask } from './controllers/reports/get-cost-analysis-task';


const routes: ExpressRouter = Router();

routes.get("/", (req: Request, res: Response) => { return res.status(200).send("Api rodando..."); });
routes.post("/login", signIn);

routes.get("/teams", IsAuthenticated, getTeams);
routes.post("/teams/create", IsAuthenticated, createTeams);
routes.put("/teams/:IdEquipe", IsAuthenticated, updateTeams);
routes.delete("/teams/:IdEquipe", IsAuthenticated, deleteTeams);
routes.get("/teams/:IdEquipe/analytics", IsAuthenticated, getTeamAnalytics);

routes.get("/projects", IsAuthenticated, getAllProject);
routes.get("/project", IsAuthenticated, getProject);
routes.post("/projects/create", IsAuthenticated, createProjects);
routes.put("/projects/:IdProjeto", IsAuthenticated, updateProjects);
routes.delete("/projects/:IdProjeto", IsAuthenticated, deleteProjects);
routes.get("/projects/:idproject/analytics", IsAuthenticated, getProjectsAnalytics);

routes.get("/members", IsAuthenticated, getMembers);

routes.get("/users/all", IsAuthenticated, getUsers);
routes.post("/users/manage", IsAuthenticated, updateUsers);
routes.get("/user/validation/refresh-token", IsAuthenticated, validationRefreshToken);
routes.get("/user/my-data", IsAuthenticated, getMyUser);
routes.get("/user/point-mark", IsAuthenticated, getPointMark);
routes.post("/user/point-mark", IsAuthenticated, updatePointMark);
routes.post("/user/send-token", /* IsAuthenticated, */ sendToken);

routes.get("/tasks", IsAuthenticated, getTasks);
routes.post("/tasks/create", IsAuthenticated, createTask);
routes.post("/tasks/start-stop", IsAuthenticated, startStopTask);
routes.delete("/tasks/inactivate", IsAuthenticated, deleteTask);
routes.put("/tasks/:IdTarefa", IsAuthenticated, updateTask);
routes.put("/tasks/:IdEquipe/archive", IsAuthenticated, updateArchiveTask);
routes.put("/tasks/kanban/update", IsAuthenticated, updateTaskKanban);

routes.get("/tasks/comment", IsAuthenticated, getCommentTask);
routes.post("/tasks/comment/create", IsAuthenticated, createCommentTask);
routes.delete("/tasks/comment/inactivate", IsAuthenticated, deleteCommentTask);
routes.put("/tasks/comment/:IdComentario", IsAuthenticated, updateCommentTask);
routes.get("/tasks/attachments", IsAuthenticated, getAttachmentsTask);
routes.post("/tasks/attachments", IsAuthenticated, uploadAttachmentsTask);
routes.delete("/tasks/attachments/inactivate", IsAuthenticated, deleteAttachement);
routes.get("/tasks/in-execution", IsAuthenticated, getInExecutionTask);

routes.get("/tasks/history", IsAuthenticated, getTasksHistory);
routes.get("/tasks/activity-registration", IsAuthenticated, getTasksActivityRegistration);
routes.post("/tasks/activity-registrations", IsAuthenticated, updateTasksActivityRegistration);

routes.get("/reports/productivity", IsAuthenticated, getReportsProductivity);
routes.get("/reports/productivity/member", IsAuthenticated, getReportsProductivityMember);
routes.get("/reports/cost-analysis-task", IsAuthenticated, getCostAnalysisTask);

routes.get("/tutorials", IsAuthenticated, getTutorials);

routes.get("/inbox", IsAuthenticated, getInbox);
routes.put("/inbox", IsAuthenticated, updateInbox);
routes.post("/inbox/create", IsAuthenticated, createInbox);

routes.post("/socket/send", sendSocketRequest);

// FILE ROUTES
routes.use('/tutoriais/videos', express.static('public/files/uploads/videos/tutoriais'));

routes.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Key, Access-Control-Allow-Origin"
  );
  next();
});

export default routes;