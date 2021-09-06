const { verifySignUp } = require("../middlewares");
const webviewcontroller = require("../controllers/webview.controller");

var pageTitle = '';

module.exports = function (app) {


	app.all('/', async (req, res, next) => {
		if (req.session.access === "admin" || req.session.access === "user") {
			console.log("Done Login");
			return await res.redirect('/dashboard');
		} else {
			pageTitle = 'Login';
			return res.render('login.ejs', { 'title': pageTitle });
		}
	});

	app.post('/log', webviewcontroller.signinweb);

	app.get('/dashboard', webviewcontroller.dashboard);

	app.get('/registration', function (req, res, next) {
		pageTitle = 'Employee Registration';
		return res.render('index.ejs', { 'title': pageTitle });
		// return res.render('index', {page:'Home', menuId:'home'});
	});

	app.post('/registration', webviewcontroller.signupweb)

	app.get('/logout', function (req, res, next) {
		console.log("logout")
		if (req.session) {
			// delete session object
			req.session.destroy(function (err) {
				if (err) {
					return next(err);
				} else {
					return res.redirect('/');
				}
			});
		}
	});



	// --------

	app.get('/forgetpass', function (req, res, next) {
		pageTitle = 'Find Password';
		res.render("forget.ejs", { "title": pageTitle });
	});

	app.post('/forgetpass', function (req, res, next) {
		//console.log('req.body');
		//console.log(req.body);
		User.findOne({ email: req.body.email }, function (err, data) {
			console.log(data);
			if (!data) {
				res.send({ "Success": "This Email Is not regestered!" });
			} else {
				// res.send({"Success":"Success!"});
				if (req.body.password == req.body.passwordConf) {
					data.password = req.body.password;
					data.passwordConf = req.body.passwordConf;

					data.save(function (err, Person) {
						if (err)
							console.log(err);
						else
							console.log('Success');
						res.send({ "Success": "Password changed!" });
					});
				} else {
					res.send({ "Success": "Password does not matched! Both Password should be same." });
				}
			}
		});

	});


};