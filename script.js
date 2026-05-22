// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyASoXsXkwaS3SomLlyjkboV_DYNa-CHBM",
  authDomain: "mind-refresh-93413.firebaseapp.com",
  projectId: "mind-refresh-93413",
  storageBucket: "mind-refresh-93413.firebasestorage.app",
  messagingSenderId: "828854602932",
  appId: "1:828854602932:web:22134bfc1893d160629be1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Add Post
function addPost() {
  let text = document.getElementById("postInput").value.trim();

  if (text === "") {
    alert("Write something!");
    return;
  }

  db.collection("posts").add({
  text: text,
  user: "Neha",   // ✅ Add user name
  likes: 0,       // ✅ Add likes
  time: new Date()
});


  document.getElementById("postInput").value = "";
}

// ✅ Load Posts
db.collection("posts")
  .orderBy("time", "desc")
  .onSnapshot(snapshot => {

    let container = document.getElementById("posts");
    container.innerHTML = "";

    snapshot.forEach(doc => {
      let post = doc.data();

      let div = document.createElement("div");
      div.className = "card p-3 mb-3 shadow-sm post-card";

      div.innerHTML = `
        <img src="https://source.unsplash.com/600x300/?nature,calm" 
             class="img-fluid rounded mb-2">

        <p><strong>👤 ${post.user}</strong></p>



        <p>${post.text}</p>

        <input type="text" id="comment-${doc.id}" 
               class="form-control mb-2" 
               placeholder="Write a comment...">

        <button class="btn btn-sm btn-primary mb-2"
                onclick="addComment('${doc.id}')">
          Comment
        </button>

        <div id="comments-${doc.id}" class="mt-2 text-muted"></div>
      `;

      container.appendChild(div);

      // ✅ Load comments for each post
      db.collection("posts")
        .doc(doc.id)
        .collection("comments")
        .orderBy("time")
        .onSnapshot(snapshot => {
          
          let commentBox = document.getElementById(`comments-${doc.id}`);
          if (!commentBox) return;

          commentBox.innerHTML = "";

          snapshot.forEach(c => {
            let data = c.data();

            let p = document.createElement("p");
            p.innerText = "💬 " + data.text;

            commentBox.appendChild(p);
          });
        });

    });

  });

// ✅ Add Comment
function addComment(postId) {
  let input = document.getElementById(`comment-${postId}`);
  let text = input.value.trim();

  if (text === "") return;

  db.collection("posts")
    .doc(postId)
    .collection("comments")
    .add({
      text: text,
      time: new Date()
    });

  input.value = "";
}
function likePost(postId) {
  let postRef = db.collection("posts").doc(postId);

  db.runTransaction((transaction) => {
    return transaction.get(postRef).then((doc) => {
      if (!doc.exists) {
        throw "Document does not exist!";
      }

      let newLikes = (doc.data().likes || 0) + 1;

      transaction.update(postRef, {
        likes: newLikes
      });
    });
  }).then(() => {
    console.log("Like updated ✅");
  }).catch((error) => {
    console.error("Error:", error);
  });
}
function likePost(id) {
  let ref = db.collection("posts").doc(id);

  ref.get().then(doc => {
    let count = doc.data().likes || 0;

    ref.update({
      likes: count + 1
    });
  });
}
