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

Template.website.helpers({
    getVotesCounter: function (website_id) {
        var website = Websites.findOne({
            _id: website_id
        });

        if (website) {
            var newVotes = website.upVotes.length - website.downVotes.length;

            Websites.update({
                _id: website_id
            }, {
                $set: {
                    votes: newVotes
                }
            });

            return newVotes;
        }
        return "unknown";
    },
    comments: function (website_id) {
        return Comments.find({
            website_id: website_id
        }, {
            sort: {
                createdOn: -1,
            }
        });
    }
});
