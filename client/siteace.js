/////
// account configs
/////
Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});

/////
// template helpers
/////

Template.website_list.helpers({
    websites: function () {
        return Websites.find({});
    }
});

Template.website_item.helpers({
    getUser: function (user_id) {
        var user = Meteor.users.findOne({
            _id: user_id
        });
        if (user) {
            return user.username;
        } else {
            return "unknown";
        }
    },
    getVotesCounter: function (website_id) {
        var website = Websites.findOne({
            _id: website_id
        });
        if (website) {
            return 1;
        } else {
            return 0;
        }
    }
});


/////
// template events
/////

Template.website_item.events({
    "click .js-upvote": function (event) {
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Up voting website with id " + website_id);
        // put the code in here to add a vote to a website!

        return false; // prevent the button from reloading the page
    },
    "click .js-downvote": function (event) {

        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Down voting website with id " + website_id);

        // put the code in here to remove a vote from a website!

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
                createdBy: Meteor.user()._id
            });
        }

        return false; // stop the form submit from reloading the page

    }
});
