Template.navbar.events({
    'keyup #search-term': function (event) {
        Session.set("search-term", event.target.value)
        return false; // stop the form submit from reloading the page
    },
    'click .js-show-website-form': function (event) {
        if (Meteor.user()) {
            $("#website_add_form").modal('show');
        } else {
            FlashMessages.sendInfo("You need to sign in if you would like to add a website.");
        }
    }
});

Template.website.events({
    "click .js-upvote": function (event) {
        var website_id = this._id;
        if (Meteor.user()) {
            var user_id = Meteor.user()._id;
            if (this.upVotes.indexOf(user_id) == -1) {
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
                FlashMessages.sendSuccess("Thank you for your vote!");
            }
        } else {
            FlashMessages.sendInfo("You need to sign in if you would like to up vote websites.");
        }

        return false; // prevent the button from reloading the page
    },
    "click .js-downvote": function (event) {
        var website_id = this._id;

        if (Meteor.user()) {
            var user_id = Meteor.user()._id;
            if (this.downVotes.indexOf(user_id) == -1) {
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
                FlashMessages.sendSuccess("Thank you for your vote!");
            }
        } else {
            FlashMessages.sendInfo("You need to sign in if you would like to down vote websites.");
        }

        return false; // prevent the button from reloading the page
    }
});

Template.website_add_form.events({
    "click .js-toggle-website-form": function (event) {
        $("#website_add_form").toggle('slow');
    },
    "submit .js-save-website-form": function (event) {
        var url = event.target.url.value;
        var title = event.target.title.value;
        var description = event.target.description.value;

        if (Meteor.user() && url && title && description) {
            Websites.insert({
                title: title,
                url: url,
                description: description,
                createdOn: new Date(),
                createdBy: Meteor.user()._id,
                upVotes: [],
                downVotes: [],
                votes: 0
            });

            $("#website_add_form").modal('hide');
            FlashMessages.sendSuccess("Website added: " + title);
        }

        return false; // stop the form submit from reloading the page
    }
});


Template.comment_add_form.events({
    "submit .js-save-comment-form": function (event) {
        var comment = event.target.comment.value;

        if (Meteor.user() && comment) {
            var website_id = this._id;

            Comments.insert({
                comment: comment,
                createdOn: new Date(),
                createdBy: Meteor.user()._id,
                website_id: website_id
            });
            event.target.comment.value = '';
            FlashMessages.sendSuccess("Thank you for your comment!");
        }

        return false; // stop the form submit from reloading the page

    }
});
