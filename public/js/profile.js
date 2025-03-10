(async () => {
    if (!localStorage.getItem("token")) {
        window.location.href = "/user/login";
    } else {
        const userId = "<%= user.id %>";
        const response = await fetch(`/user/${userId}`, {
            method: "GET",
            headers: {
                "token": localStorage.getItem("token"),
                "Content-Type": "application/json"

            },
        });
        console.log(localStorage.getItem("token"));


        if (!response.ok) {
            localStorage.removeItem("token");
            location.href = "/user/login";
        }

        console.log(await response.json());
    }
})();