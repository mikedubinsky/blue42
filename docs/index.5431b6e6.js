async function e(){try{let e=await fetch("https://il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws/questions",{method:"GET",headers:{Host:"il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws"}});if(!e.ok)throw Error("Network response was not ok");return await e.json()}catch(e){return console.error("Error:",e),[{error:"Oops - Sorry! Something went wrong. Can I blame it on politics?"}]}}async function t(e){fetch("https://il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws/questions",{method:"POST",headers:{Host:"il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws",Accept:"*/*",Connection:"keep-alive"},body:JSON.stringify(e)}).then(e=>{if(!e.ok)throw Error("Network response was not ok "+e.statusText);return e.json()}).then(e=>(console.log("DATA: ",e),n(e.message,e.imageUrl,e.voteResults),e.voteResults)).catch(e=>(console.error("Error:",e),n("Oops - Sorry! Something went wrong. Can I blame it on politics?"),{}))}function n(e="",t="",o){let s=document.getElementById("slogan");s.textContent="";let l=document.getElementById("results-placeholder");if(console.log("PollResults: ",o),o&&document.getElementById("vote-results").classList.remove("hidden"),l.classList.remove("placeholder"),t){let n=document.getElementById("aiImage");n.src=t,n.alt=e}s.textContent=e,l.scrollIntoView({behavior:"smooth"})}document.addEventListener("DOMContentLoaded",async()=>{let n=await e(),o=[];console.log("Questions:",n),0===n.length||n[0]?.error||function(e){e.forEach(e=>{let t=document.createElement("div");t.classList.add("slide");let n=document.createElement("p");n.classList.add("question"),n.appendChild(document.createTextNode(e.question)),t.appendChild(n);let o=Math.floor(Math.random()*e.answers.length),s=e.answers[o];e.answers.splice(o,1),o=Math.floor(Math.random()*e.answers.length);let l=e.answers[o];e.answers.splice(o,1),o=Math.floor(Math.random()*e.answers.length);let a=e.answers[o];e.answers.splice(o,1),o=Math.floor(Math.random()*e.answers.length);let r=e.answers[o];e.answers.splice(o,1);let d=document.createElement("div");d.classList.add("buttons");let c=document.createElement("button");c.classList.add("btn"),c.textContent=s,c.value=s,d.appendChild(c);let i=document.createElement("button");i.classList.add("btn"),i.textContent=l,i.value=l,d.appendChild(i);let u=document.createElement("button");u.classList.add("btn"),u.textContent=a,u.value=a,d.appendChild(u);let m=document.createElement("button");m.classList.add("btn"),m.textContent=r,m.value=r,d.appendChild(m),t.appendChild(d),document.getElementById("slides-container").prepend(t);let h=document.getElementById("placeholder-slide");h&&h.remove()})}(n);let s=document.querySelector(".slides"),l=document.querySelectorAll(".slide").length-1,a=0,r=()=>{s.style.transform=`translateX(-${100*a}%)`},d=async e=>{a++,r(),a<l?o.push(e):t(o)};document.querySelectorAll(".btn").forEach(e=>{e.addEventListener("click",function(e){d(e.target.value)})})});
//# sourceMappingURL=index.5431b6e6.js.map
