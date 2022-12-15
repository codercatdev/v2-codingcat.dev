# JAMStackGR #3-Getting Started with Serverless

[https://codingcat.dev/post/jamstackgr-3-getting-started-with-serverless](https://codingcat.dev/post/jamstackgr-3-getting-started-with-serverless)

> 
> 
> 
> Full Livestream, Video was missing when Keheira was coding. The video above has been edited down to my recap of Keheira's full demo.
> 

## Firebase Functions Serverless CRUD

In the below example there are 4 Firebase Functions that will be created.functions/index.js

```
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

/*
    Endpoint: /helloWorld
*/
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Google Whack");
});

/*
    C - Create
    when user adds txt we push to the database
    Endpoint: /addComment?text=
*/
exports.addComment = functions.https.onRequest(async(request, response) => {
    word = request.query.text
    snap = await admin.database().ref('/Words').push(word)
    response.send("Word Added!")
})

/*
    R - Read
    kinda useless for this but I'm going to write it anyway
    Endpoint: /readComments
*/
exports.readComments = functions.https.onRequest(async(request, response) => {
    var items = []
    //loop thru snapshots>grab children value>push to items
    admin.database().ref('/Words').on('value', snap => {
        snap.forEach(child => {
            items.push(child.val())
        })
    })
    response.send(items)
})

/*
    U - Update
    When user give a word we update it with another word
    Endpoint: /updateComment?old=&new=
*/
//TODO: Fix the foolishness
exports.updateComment = functions.https.onRequest(async(request, response) => {
    og_word = request.query.old
    new_word = request.query.new
    var key = null
    //search db for old
    admin.database().ref('/Words').on('value', snap => {
        snap.forEach(child => {
        if(child.val() === og_word) //check to see if the value is equal to the og text
            key = child.key
        })
    })
    //on successful key
    if(key !== null){
        snap = await admin.database().ref('/Words').child(key).set(new_word)
        response.send("Word Updated!")
    } else { //word not in the database
        response.send("Word not found.")
    }
})

/*
    D - Delete
    Allow user to delete a word
    Endpoint: /deleteComment?text=
*/
exports.deleteComment = functions.https.onRequest(async(request, response) => {
    word = request.query.text
    var key = null
    //loop thru snapshots>compare child value to word>if item exist delete it
    admin.database().ref('/Words').on('value', snap => {
        snap.forEach(child => {
        if(child.val() === word)
            key = child.key
        })
    })
    if(key !== null){
        snap = await admin.database().ref('/Words').child(key).remove()
        response.send("Word Deleted!")
    } else { //word not in the database
        response.send("Word not found.")
    }
})

```

![https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/6d53f22b-34f9-4c10-a925-12cdb713950b.jpg](https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/6d53f22b-34f9-4c10-a925-12cdb713950b.jpg)

Fixing Functions Code

There are a couple of snags in the above code, so we worked through how to update the readComment function. This is because Firebase Functions require

> 
> 
> 
> The first person to see this message and send a pull request to Keheira wins a free AJ t-shirt [https://github.com/BackpackMedia/ServerlessExample/issues](https://github.com/BackpackMedia/ServerlessExample/issues)
> 

```
exports.readComments = functions.https.onRequest(async(request, response) => {
    var items = []
    //loop thru snapshots>grab children value>push to items
    const snapshot = await admin.database().ref('/Words').once('value');
    snapshot.forEach(child => {
        items.push(child.val())
    })
    response.send(items)
})

```