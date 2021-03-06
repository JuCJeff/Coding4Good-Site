var self = this;
var pg = require('pg');
var config = require('./dbconfig.js');
var db = new pg.Pool(config.db);

exports.getAllUserNameAndId = function(callback){
    var query = `select name,id from users;`;
    db.query(query,function(err, result){
        if(err){
            callback(err);
        }
        else{
            callback(null,result.rows);
        }
    });
};

exports.editProject = function (project, callback){
    const status = ["Starting", "In Progress", "On Hold", "Succeed", "Failed", "Maintaining"][project.status];
    const query = `update project set title=$2, description=$3, contact=$4, org_name=$5, status=$6 where project.id = $1;`;
    const oldLink = `DELETE FROM project_relation WHERE project_relation.pid = $1`;
    const newLink = `insert into project_relation(pid, uid, relation) values($1,$2,$3);`;
    db.query(query, [project.id, project.title, project.description, project.contact, project.org_name,status], function (err) {
        db.query(oldLink,[project.id],function (err) {
            if(err){
                console.log(err);
                callback(err);
            }
        });
        if (err) {
            console.log(err);
            callback(err);
        }
        else if(project.team!=null){
            if(project.team.length>0){
                var team = project.team;
                team.forEach(function(person){
                    var uid = parseInt(person.id);
                    var memberTitle=person.memberTitle;
                    db.query(newLink,[project.id,uid,memberTitle], function(err){
                        if(err){
                            console.log(err);
                            callback(err);
                        }
                    });
                });
            }
        }
        callback(null);
    });
};

exports.createProject = function (project, callback) {
    const status = ["Starting", "In Progress", "On Hold", "Succeed", "Failed", "Maintaining"][project.status];
    var query = `insert into project (title, description, contact, org_name, creation_time,status) values($1,$2,$3,$4,now(),$5) returning id;`;
    var link = `insert into project_relation(pid, uid, relation) values($1,$2,$3);`;
    db.query(query, [project.title, project.description, project.contact, project.org_name,status], function (err,projectId) {
        if (err) {
            console.log(err);
            callback(err);
        }
        else if(project.team!=null){
            if(project.team.length>0){
                var team = project.team;
                team.forEach(function(person){
                    var uid = parseInt(person.id);
                    var memberTitle=person.memberTitle;
                    db.query(link,[projectId.rows[0].id,uid,memberTitle], function(err){
                        if(err){
                            console.log(err);
                            callback(err);
                        }
                    });
                });
            }
        }
        callback(null);
    });
};


exports.getProjectSet = function (callback) {
    var query = `SELECT * FROM project;`;
    db.query(query, function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, result.rows);
        }
    });
};

exports.getAssociatedProjectsByUserId = function (uid, callback) {
    var query = `SELECT * FROM project_relation r, users u, project p where u.id = r.uid and u.id = $1 and p.id = r.pid`;
    db.query(query, [uid], function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, result.rows);
        }
    });
};

exports.getAssociatedUsersByProjectId = function (projectId, callback) {
    var query = `SELECT u.name as name, r.relation as relation, u.id as uid FROM project_relation r, users u, project p where u.id = r.uid and p.id = $1 and p.id = r.pid`;
    db.query(query, [projectId], function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, result.rows);
        }
    });
};

exports.getProjectById = function (projectId, callback) {
    var query = `SELECT * FROM project WHERE id=$1;`;
    db.query(query, [projectId], function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            if (result.rows.length > 0) {
                callback(null, result.rows[0]);
            }
            else {
                callback('No matching project id');
            }
        }
    });
};

exports.removeProjectById = function(projectId, callback){
    var queryRelation = `DELETE FROM project_relation WHERE pid=$1;`;
    var queryProject = `DELETE FROM project WHERE id=$1;`;
    db.query(queryRelation,[projectId],function(err){
        if(err){
            callback(err);
        }
        else{
            db.query(queryProject,[projectId],function(err,result){
                if(err){
                    callback(err);
                }
                console.log(result.rowCount);
                if(result.rowCount>0){
                    callback(null);
                }else{
                    callback('No matching project id');
                }
            });
        }
    });
};