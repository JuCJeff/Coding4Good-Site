var express = require('express');
var router = express.Router();
var db = require("../../server/project_db");

router.get('/', function (req, res, next) {
    db.getProjectSet(function (err, projectSet) {
        if (err) {
            console.log(err);
            res.status(400).json({msg: 'Database Error'});
            return;
        }
        res.render('project/index', {projectSet: projectSet, isMy: false, uid: req.session.uid});
    });
});

router.get('/my', function (req, res, next) {
    if (req.session.uid === null) {
        res.redirect('../login');
        return;
    }
    db.getAssociatedProjectsByUserId(req.session.uid, function (err, projectSet) {
        if (err) {
            console.log(err);
            res.status(400).json({msg: 'Database Error'});
            return;
        }
        res.render('project/index', {projectSet: projectSet, isMy: true, uid: null});
    });
});

router.get('/detail', function (req, res, next) {
    db.getProjectById(req.query.id, function (err, project) {
        if (err) {
            console.log(err);
            res.status(400).json({msg: 'Database Error'});
            return;
        }
        db.getAssociatedUsersByProjectId(project.id, function (err, users) {
            if (err) {
                console.log(err);
                res.status(400).json({msg: 'Database Error'});
                return;
            }
            res.render('project/detail', {projectDetail: project, users: users, uid: req.session.uid});
        })
    });
});

router.get('/create', function (req, res, next) {
    if (req.session.uid === null) {
        res.redirect('../login');
        return;
    }
    if (req.session.uid !== 1) {
        res.redirect('../');
        return;
    }
    db.getAllUserNameAndId(function (err, allUserNameAndId) {
        if (err) {
            console.log(err);
            res.status(400).json({msg: 'Database Error'});
            return;
        }
        res.render('project/create', {allUserNameAndId: allUserNameAndId});
    })
});

router.get('/edit', function (req, res, next) {
    const projectId = req.query.id;
    if (req.session.uid === null) {
        res.redirect('../login');
        return;
    }
    if (req.session.uid !== 1) {
        res.redirect('../project/detail?id='+projectId);
        return;
    }
    db.getProjectById(projectId, function (err, project) {
        if (err) {
            console.log(err);
            res.status(400).json({msg: 'Database Error'});
            return;
        }
        db.getAssociatedUsersByProjectId(project.id, function (err, users) {
            if (err) {
                console.log(err);
                res.status(400).json({msg: 'Database Error'});
                return;
            }
            db.getAllUserNameAndId(function (err, allUserNameAndId) {
                if (err) {
                    console.log(err);
                    res.status(400).json({msg: 'Database Error'});
                    return;
                }
                res.render('project/edit', {projectDetail: project, users: users, allUserNameAndId: allUserNameAndId});
            });
        });
    });
});

module.exports = router;
