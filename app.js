//Initialize the app client
const client = stitch.Stitch.
    initializeDefaultAppClient("blogapp-lcoaa");

// Get a MongoDB Service Client
const mongodb = client.getServiceClient(
    stitch.RemoteMongoClient.factory,
    "mongodb-atlas"
);

// get a reference to blog database
const db = mongodb.db("blg");

//Query and display comments 
function displayComments() {
    db.collection("coments")
        .find({}, { limit: 100 })
        .toArray()
        .then(docs => {
            const html = docs.map(doc => `
            <div class="card">
            <div class="card-body">
            <h5 class="card-title">${doc.comment}</h5>
            <p class="card-text"><small>UserId: </small>${doc.owner_id}</p>
            </div>
            </div>`);
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
    db.collection("coments")
        .insertOne({ owner_id: client.auth.user.id, comment: newComment.value })
        .then(displayComments);
    newComment.value = "";
}