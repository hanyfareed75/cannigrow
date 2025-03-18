 function validatePassword(password) {
  let result = "";
  if (!password) {
  
    document.getElementById("passwdresult").innerHTML = "Password is required";
    return false;
  }

  if (password.length < 8) {
   
    document.getElementById("passwdresult").innerHTML =
      "Password must be at least 8 characters long";
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
   
    document.getElementById("passwdresult").innerHTML =
      "Password must contain uppercase, lowercase, number, and special character";
    return false;
  }
  document.getElementById("passwdresult").innerHTML = result;
  
  document.getElementById("passwdresult").innerHTML = "Password is valid";
  return true;
}


async function checkemail(email) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/checkemail/" + email
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
      return false;
    }

    const data = await response.json();
    
    document.getElementById("result").innerHTML = data.message;
    return true;
  } catch (error) {
    console.error("Error:", error);
  }
}

export { validatePassword, checkemail };