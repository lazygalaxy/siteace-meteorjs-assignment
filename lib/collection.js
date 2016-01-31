Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

Websites.allow({
    update: function (userId, doc) {
        if (Meteor.user()) {
            return true;
        }
    },
    insert: function (userId, doc) {
        if (Meteor.user()) {
            return true;
        }
    }
});

Comments.allow({
    insert: function (userId, doc) {
        if (Meteor.user()) {
            return true;
        }
    }
});
