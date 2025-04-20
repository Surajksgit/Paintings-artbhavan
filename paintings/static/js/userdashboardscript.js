
   

    // Push state initially so back button triggers popstate
    history.pushState(null, document.title, location.href);

    window.addEventListener('popstate', function (event) {
        document.getElementById("backConfirmPopup").style.display = "flex";

        // Prevent further back navigation
        history.pushState(null, document.title, location.href);
    });

    function closeBackPopup() {
        document.getElementById("backConfirmPopup").style.display = "none";
    }

