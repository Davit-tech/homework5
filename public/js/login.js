const messageContainer = document.querySelector("#message-container");

const loginForm = document.querySelector("#loginForm");
if (loginForm) {
    loginForm.onsubmit = async function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                if (messageContainer) {
                    messageContainer.classList.add("success-message");
                    messageContainer.innerHTML = result.message;

                    setTimeout(() => {
                        window.location.href = `/user/${data.email}`;
                    }, 1000);
                }
            } else {
                if (messageContainer) {
                    messageContainer.classList.add("error-message");
                    messageContainer.innerHTML = result.message;
                }
            }
        } catch (err) {
            console.error(err);
        }
    };
}
