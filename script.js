// ✅ Your Firebase config (from screenshot)
const firebaseConfig = {
  apiKey: "AIzaSyASoXsXkwaS3SomLlyjkboV_DYNa-CHBM",
  authDomain: "mind-refresh-93413.firebaseapp.com",
  projectId: "mind-refresh-93413",
  storageBucket: "mind-refresh-93413.firebasestorage.app",
  messagingSenderId: "828854602932",
  appId: "1:828854602932:web:22134bfc1893d160629be1"
};

// ✅ Initialize Firebase
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
    time: new Date()
  });

  document.getElementById("postInput").value = "";
}

// ✅ Load Posts (real-time)
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
        <img src="https://source.unsplash.com/600x300/?calm,nature" class="img-fluid rounded mb-2">
        <p>${post.text}</p>
      `;

      container.appendChild(div);
    });

  });
