//Initialize the app client
const client = stitch.Stitch.
    initializeDefaultAppClient("blogapp-lcoaa");

// Get a MongoDB Service Client
const mongodb = client.getServiceClient(
    stitch.RemoteMongoClient.factory,
    "mongodb-atlas"
);

// get a reference to blog database
const db = mongodb.db("blog");

//Query and display comments on Pageload
function displayComments() {
    db.collection("comments")
        .find({}, { limit: 1000 })
        .toArray()
        .then(docs => {
            const html = docs.map(doc => `<p class="h3 card-title">${doc.comment}</p><div class="h6 card-text"><small>by UserId:</small> ${doc.owner_id}</div>`);
            document.getElementById("comments").innerHTML = html;
        });
}

//Login with Credentials and display comments
function displayCommentsOnload() {
    client.auth
        .loginWithCredential(new stitch.AnonymousCredential())
        .then(displayComments)
        .catch(console.error);
}

//Add comments
function addComment() {
    const newComment = document.getElementById("new_comment");
    console.log("add comment", client.auth.user.id)
    db.collection("comments")
        .insertOne({ owner_id: client.auth.user.id, comment: newComment.value })
        .then(displayComments);
    newComment.value = "";
}