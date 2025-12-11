let db;
let req=indexedDB.open("AppDB",1);
req.onupgradeneeded=function(e){
  db=e.target.result;
  if(!db.objectStoreNames.contains("usuarios")){
    db.createObjectStore("usuarios",{keyPath:"email"});
  }
};
req.onsuccess=function(e){
  db=e.target.result;
};
req.onerror=function(){};

document.getElementById("registerForm").addEventListener("submit",function(e){
  e.preventDefault();
  let email=document.getElementById("regUser").value.trim();
  let pass=document.getElementById("regPass").value;
  if(!email||!pass){document.getElementById("regMsg").textContent="Completa los datos";return}
  let tx=db.transaction("usuarios","readwrite");
  let store=tx.objectStore("usuarios");
  let getReq=store.get(email);
  getReq.onsuccess=function(){
    if(getReq.result){document.getElementById("regMsg").textContent="Usuario ya existe";return}
    store.add({email:email,password:pass});
    document.getElementById("regMsg").textContent="Registro exitoso";
    document.getElementById("registerForm").reset();
  };
  getReq.onerror=function(){document.getElementById("regMsg").textContent="Error al registrar"}
});

document.getElementById("loginForm").addEventListener("submit",function(e){
  e.preventDefault();
  let email=document.getElementById("loginUser").value.trim();
  let pass=document.getElementById("loginPass").value;
  if(!email||!pass){document.getElementById("loginMsg").textContent="Completa los datos";return}
  let tx=db.transaction("usuarios","readonly");
  let store=tx.objectStore("usuarios");
  let getReq=store.get(email);
  getReq.onsuccess=function(){
    if(!getReq.result){document.getElementById("loginMsg").textContent="Usuario no encontrado";return}
    if(getReq.result.password===pass){
      localStorage.setItem("app_session",email);
      window.location.href="principal.html";
    } else {
      document.getElementById("loginMsg").textContent="Contraseña incorrecta";
    }
  };
  getReq.onerror=function(){document.getElementById("loginMsg").textContent="Error al iniciar sesión"}
});

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").catch(()=>{});
}
