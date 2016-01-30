Template.navbar.events({
    'keyup #search-term': function (event) {
        console.log('searching!!!');
        Session.set("search-term", event.target.value)
        return false; // stop the form submit from reloading the page
    }
});

Template.website.events({
    "click .js-upvote": function (event) {
        var website_id = this._id;
        console.log(website_id);

        if (Meteor.user()) {
            var user_id = Meteor.user()._id;

            Websites.update({
                _id: website_id
            }, {
                $addToSet: {
                    upVotes: user_id
                },
                $pull: {
                    downVotes: user_id
                }
            });
        } else {
            FlashMessages.sendInfo("You need to sign in if you would like to up vote websites.");
        }

        return false; // prevent the button from reloading the page
    },
    "click .js-downvote": function (event) {
        var website_id = this._id;

        if (Meteor.user()) {
            var user_id = Meteor.user()._id;

            Websites.update({
                _id: website_id
            }, {
                $addToSet: {
                    downVotes: user_id
                },
                $pull: {
                    upVotes: user_id
                }
            });
        } else {
            FlashMessages.sendInfo("You need to sign in if you would like to down vote websites.");
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
                upVotes: [],
                downVotes: []
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