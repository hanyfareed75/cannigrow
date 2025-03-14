async function checkAuthStatus() {
  const response = await fetch("/api/user", { credentials: "include" });
  const data = await response.json();
  const signinbtn=document.getElementById("signinbtn");
console.log(data);
  if (data.authenticated) {
    document.getElementById("profile").innerHTML = `
            <p>Welcome, ${data.user.displayName}</p>
            <img src="${data.user.photo}" width="100" />
            <p>Email: ${data.user.email}</p>
            <a href="/logout">Logout</a>
           
        `
        signinbtn.innerHTML = `<img src="${data.user.photo}" width="36" />;
        <h2>Welcome ${data.user.displayName}</h2>
        `
  } else {
    document.getElementById("profile").innerHTML = `<p>User not logged in</p>`;

  }
}

// Call function when page loads
checkAuthStatus();

async function logout() {
  await fetch("/logout", { credentials: "include" });
  window.location.reload();
}
// الحصول على الزر والعنصر الأساسي
const toggleButton = document.getElementById("darkModeToggle");
const body = document.body;

// التحقق من `localStorage` لمعرفة إذا كان الوضع الليلي مفعل
if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
   
}

// تغيير الوضع عند الضغط على الزر
toggleButton.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
       
    } else {
        body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
        
    }
});
