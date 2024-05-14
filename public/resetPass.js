window.onload = async () => {
    const timeout = 2000;
  
    const recoveryToken = window.location.href.split("?")[1];
 
    try {
    //   const wrapper = document.querySelector(".wrapper");
      const resp = await fetch(
        `https://finalteamproject-backend.onrender.com/api/users/passrecovery/${recoveryToken}`
      );
      if (resp.status === 404) {
        const message = "User not found...";
        document.querySelector("h1").textContent = message;
        // const timeoutId = setTimeout(() => {
        //   window.location.href =
        //     "https://alexbinkovskyy.github.io/finalTeamProject/";
        // }, timeout);
      }
      if (resp.status === 200) {
        const message = "Email has been verified successfuly";
        document.querySelector("h1").textContent = message;
  
        // const timeoutId = setTimeout(() => {
        //   window.location.href =
        //     `https://alexbinkovskyy.github.io/finalTeamProject`;
        // }, timeout);
      }
    } catch (err) {
      console.log(err);
    }
  };
  