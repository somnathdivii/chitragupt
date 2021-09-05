const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});


	const d = new Date();
	const month = d.getMonth() + 1;
	const day = d.getDate();
	const date = d.getFullYear() + '/' +
		(('' + month).length < 2 ? '0' : '') + month + '/' +
		(('' + day).length < 2 ? '0' : '') + day;

	var pageTitle = '';


	app.get('/worker', function (req, res, next) {
		console.log("admin profile");
		User.findOne({ unique_id: req.session.userId }, function (err, data) {
			console.log("data");
			console.log(data);

			if (!data) {
				res.redirect('/');
			} else {
				//console.log("found");
				if (req.session.access === 'worker') {
					pageTitle = 'Worker Home';
					return res.render('worker/data.ejs', { "name": data.username, "email": data.email, 'title': pageTitle });
				} else {
					pageTitle = 'Admin Home';
					return res.render('admin/adminstart.ejs', { "name": data.username, "email": data.email, "date": date, 'title': pageTitle });
				}
			}
		});
	});

	app.get('/workreport', function (req, res, next) {
		console.log("Workreport");
		User.findOne({ unique_id: req.session.userId }, function (err, data) {
			console.log("data");
			console.log(data);
			if (!data) {
				res.redirect('/');
			} else {
				if (req.session.access === 'worker') {
					pageTitle = 'Employee Workreport';
					//console.log("found");
					console.log(date);
					return res.render('worker/workreport.ejs', { "name": data.username, "date": date, 'title': pageTitle });
				} else {
					res.redirect('/profile');
				}

			}
		});
	});

};