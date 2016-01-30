/////
// routing
/////
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('websites', {
        to: "main"
    });
});

Router.route('/website/:_id', function () {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('website_comments', {
        to: "main",
        data: function () {
            return Websites.findOne({
                _id: this.params._id
            })
        }
    });
});

/////
// account configs
/////
Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});

/////
// template helpers
/////
Template.registerHelper('getUser', function (user_id) {
    var user = Meteor.users.findOne({
        _id: user_id
    });
    if (user) {
        return user.username;
    } else {
        return "unknown";
    }
});

Template.registerHelper('getVotesCounter', function (website_id) {
    var website = Websites.findOne({
        _id: website_id
    });
    if (website) {
        return website.votes;
    }
    return "unknown"
});

Template.websites.helpers({
    websites: function () {
        //if we have search criterias then we use a regex to find the websites
        var searchTerm = Session.get("search-term");

        if (searchTerm) {
            return Websites.find({
                $or: [{
                    "title": {
                        $regex: ".*" + searchTerm + ".*",
                        $options: 'i'
                    }
                }, {
                    "description": {
                        $regex: ".*" + searchTerm + ".*",
                        $options: 'i'
                    }
                }]
            }, {
                sort: {
                    votes: -1,
                    createdOn: -1,
                }
            });
        }
        // return all the webistes if there were no search criterias
        return Websites.find({}, {
            sort: {
                votes: -1,
                createdOn: -1,
            }
        });
    }
});

Template.website_comments.helpers({
    comments: function () {
        return Comments.find({}, {
            sort: {
                createdOn: -1,
            }
        });
    }
});

/////
// template events
/////
Template.navbar.events({
    'keyup #search-term': function (event) {
        Session.set("search-term", event.target.value)
        return false; // stop the form submit from reloading the page
    }
});

Template.website.events({
    "click .js-upvote": function (event) {
        var website_id = this._id;

        if (Meteor.user()) {
            Websites.update({
                _id: website_id
            }, {
                $set: {
                    votes: this.votes + 1
                }
            });
        }

        return false; // prevent the button from reloading the page
    },
    "click .js-downvote": function (event) {
        var website_id = this._id;

        if (Meteor.user()) {
            Websites.update({
                _id: website_id
            }, {
                $set: {
                    votes: this.votes - 1
                }
            });
        }

        return false; // prevent the button from reloading the page
    }
})

Template.website_form.events({
    "click .js-toggle-website-form": function (event) {
        $("#website_form").toggle('slow');
    },
    "submit .js-save-website-form": function (event) {
        var url = event.target.url.value;
        var title = event.target.title.value;
        var description = event.target.description.value;

        if (Meteor.user()) {
            Websites.insert({
                title: title,
                url: url,
                description: description,
                createdOn: new Date(),
                createdBy: Meteor.user()._id,
                votes: 0
            });
        }

        return false; // stop the form submit from reloading the page

    }
});

Template.comment_form.events({
    "submit .js-save-comment-form": function (event) {
        var comment = event.target.comment.value;

        if (Meteor.user()) {
            Comments.insert({
                comment: comment,
                createdOn: new Date(),
                createdBy: Meteor.user()._id
            });
        }

        return false; // stop the form submit from reloading the page

    }
});
