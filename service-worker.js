const CACHE_NAME = "family-app-v2"

const urlsToCache = [
"/",
"/index.html",
"/manifest.json",
"/icon.png",
"/public-config.js"
]

self.addEventListener("install",event=>{

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache=>{
return cache.addAll(urlsToCache)
})

.then(()=>self.skipWaiting())

)

})

self.addEventListener("activate",event=>{

event.waitUntil(
Promise.all([
caches.keys().then(keys=>{
return Promise.all(
keys
.filter(key=>key!==CACHE_NAME)
.map(key=>caches.delete(key))
)
}),
self.clients.claim()
])
)

})

self.addEventListener("fetch",event=>{

if(event.request.method!=="GET"){
return
}

let requestUrl=new URL(event.request.url)
let isHtmlRequest=event.request.mode==="navigate"
||requestUrl.pathname==="/"
||requestUrl.pathname.endsWith("/index.html")

event.respondWith(

isHtmlRequest
?fetch(event.request)
.then(response=>{
let responseClone=response.clone()
caches.open(CACHE_NAME).then(cache=>{
cache.put(event.request,responseClone)
})
return response
})
.catch(()=>{
return caches.match(event.request).then(response=>{
return response || caches.match("/index.html")
})
})
:caches.match(event.request)
.then(response=>{
return response || fetch(event.request).then(networkResponse=>{
if(networkResponse&&networkResponse.status===200&&requestUrl.origin===self.location.origin){
let responseClone=networkResponse.clone()
caches.open(CACHE_NAME).then(cache=>{
cache.put(event.request,responseClone)
})
}
return networkResponse
})
})

)

})
