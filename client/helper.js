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
