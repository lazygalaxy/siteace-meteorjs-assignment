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

            console.log(this.upVotes);
            var index = this.upVotes.indexOf(user_id);
            if (user_id == -1) {
                this.upVotes.push(user_id);
            }
            console.log(this.upVotes);

            console.log(this.downVotes);
            var index = this.downVotes.indexOf(user_id);
            if (index > -1) {
                this.downVotes.splice(index, 1);
            }
            console.log(this.downVotes);

            var newVotes = this.upVotes.length - this.downVotes.length;

            Websites.update({
                _id: website_id
            }, {
                $addToSet: {
                    upVotes: user_id
                },
                $pull: {
                    downVotes: user_id
                },
                $set: {
                    votes: newVotes
                }
            });
        } else {
            FlashMessages.sendInfo("You need to sign in if you would like to up vote websites.");
        }

        return false; // prevent the button from reloading the page
    },
    "click .js-downvote": function (event) {
        var website_id = this._id;

        var newVotes = this.upVotes.length - this.downVotes.length;

        if (Meteor.user()) {
            var user_id = Meteor.user()._id;

            var index = this.upVotes.indexOf(user_id);
            if (user_id == -1) {
                this.downVotes.push(user_id);
            }
            var index = this.downVotes.indexOf(user_id);
            if (index > -1) {
                this.upVotes.splice(index, 1);
            }

            Websites.update({
                _id: website_id
            }, {
                $addToSet: {
                    downVotes: user_id
                },
                $pull: {
                    upVotes: user_id
                },
                $set: {
                    votes: newVotes
                }
            });
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
        $("#website_add_form").modal('hide');
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
