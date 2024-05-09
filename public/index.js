window.onload = async () => {
    const timeout = 2000;
    try {
      const wrapper = document.querySelector(".wrapper");
      const resp = await fetch(
        `????/${
          window.location.href.split("?")[1]
        }`
      );
      if (resp.status === 404) {
        const message = "User not found...";
        document.querySelector("h1").textContent = message;
        const timeoutId = setTimeout(() => {
          window.location.href = "https://goit.global/ua/";
        }, timeout);
      }
      if (resp.status === 200) {
        const message = "Email has been verified successfuly";
        document.querySelector("h1").textContent = message;
       
  
        const timeoutId = setTimeout(() => {
          window.location.href = "http://google.com";
        }, timeout);
      }
    } catch (err) {
      console.log(err);
    }
  };