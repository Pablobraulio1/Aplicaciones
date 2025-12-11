if(!localStorage.getItem("app_session")){window.location.href="index.html"}
document.getElementById("btnLogout").addEventListener("click",function(){
  localStorage.removeItem("app_session");
  window.location.href="index.html";
});

let deferredPrompt;
window.addEventListener("beforeinstallprompt",function(e){
  e.preventDefault();
  deferredPrompt=e;
  document.getElementById("btnInstall").style.display="inline-block";
});
document.getElementById("btnInstall").addEventListener("click",async function(){
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  let choice=await deferredPrompt.userChoice;
  deferredPrompt=null;
  document.getElementById("btnInstall").style.display="none";
});

document.getElementById("btnGetLocation").addEventListener("click",function(){
  let out=document.getElementById("geoOutput");
  if(!navigator.geolocation){out.textContent="Geolocation no soportada";return}
  out.textContent="Obteniendo ubicación...";
  navigator.geolocation.getCurrentPosition(function(pos){
    out.textContent=`Lat: ${pos.coords.latitude.toFixed(6)}, Lon: ${pos.coords.longitude.toFixed(6)}, Prec: ${pos.coords.accuracy}m`;
  },function(err){
    out.textContent="Error: "+err.message;
  },{enableHighAccuracy:true,timeout:10000});
});

let motionHandler;
document.getElementById("btnStartMotion").addEventListener("click",function(){
  let out=document.getElementById("motionOutput");
  if(typeof DeviceMotionEvent!=="undefined" && typeof DeviceMotionEvent.requestPermission==="function"){
    DeviceMotionEvent.requestPermission().then(response=>{
      if(response==="granted"){startMotion();}
      else{out.textContent="Permiso denegado para DeviceMotion";}
    }).catch(()=>{out.textContent="No se pudo solicitar permiso DeviceMotion";});
  } else {
    startMotion();
  }
  function startMotion(){
    motionHandler=function(e){
      let ax=(e.accelerationIncludingGravity.x||0).toFixed(2);
      let ay=(e.accelerationIncludingGravity.y||0).toFixed(2);
      let az=(e.accelerationIncludingGravity.z||0).toFixed(2);
      out.textContent=`Aceleración X:${ax} Y:${ay} Z:${az}`;
    };
    window.addEventListener("devicemotion",motionHandler);
  }
});

document.getElementById("btnStopMotion").addEventListener("click",function(){
  if(motionHandler) window.removeEventListener("devicemotion",motionHandler);
  document.getElementById("motionOutput").textContent="Acelerómetro detenido";
});

document.getElementById("btnRequestNotif").addEventListener("click",function(){
  let out=document.getElementById("notifStatus");
  if(!("Notification" in window)){out.textContent="Notificaciones no soportadas";return}
  Notification.requestPermission().then(function(permission){
    out.textContent="Permiso: "+permission;
  });
});

document.getElementById("btnSendNotif").addEventListener("click",function(){
  if(Notification.permission==="granted"){
    new Notification("Notificación de prueba",{body:"Esta es una notificación local desde la app",tag:"demo-notif"});
  } else {
    document.getElementById("notifStatus").textContent="No hay permiso para notificaciones";
  }
});
