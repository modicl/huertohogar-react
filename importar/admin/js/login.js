document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("loginForm");
    const errorMsg = document.getElementById("errorMsg");

    form.addEventListener("submit", function(event) {
        
        // La validacion ocurre al apretar el boton!!
        
        if (!form.username.value || !form.password.value) {
            event.preventDefault();
            errorMsg.textContent = "Por favor complete todos los campos.";
            return;
        }
    });
});
