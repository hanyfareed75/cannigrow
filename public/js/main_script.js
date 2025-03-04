document.addEventListener('DOMContentLoaded', () => {
        const navbar = document.getElementById('navbar-container');
        fetch('nav.html')
            .then(response => response.text())
            .then(data => {
                navbar.innerHTML = data;
            });
            const meta = document.createElement("meta");
            meta.name = "viewport";
            meta.content = "width=device-width, initial-scale=1.0";
            document.head.appendChild(meta);
            const links = [
              { rel: "stylesheet", href: "css/styles.css" },
              { rel: "stylesheet", href: "css/bootstrap.min.css" },
              { rel: "stylesheet", href: "css/bootstrap-icons.css" },
              { rel: "icon", href: "css/bootstrap-icons.css" },
            ];
            const scripts = [
              "js/jquery-3.3.1.slim.min.js",
              "js/popper.min.js",
              "js/bootstrap.min.js",
              "js/jquery-3.3.1.slim.min.js",
              "js/main_script.js",
            ];
            links.forEach(({ rel, href }) => {
              const link = document.createElement("link");
              link.rel = rel;
              link.href = href;
              document.head.appendChild(link);
            });

            scripts.forEach(({ src }) => {
              const script = document.createElement("script");
              script.defer = true;

              document.head.appendChild(script);
            });
   
    });

   

  
     
     
   