const planets = [
  {id:"mercury",name:"Mercury",type:"Terrestrial",tag:"THE CLOSEST PLANET",color:"#9b8d80",shadow:"#a89a8c",distance:"57.9 million km",mass:"3.30 × 10²³ kg",diameter:"4,879 km",period:"88 days",temperature:"167 °C",gravity:"3.7 m/s²",moons:"0",description:"The smallest planet in our solar system is also the closest to the Sun. Its heavily cratered surface records billions of years of impacts."},
  {id:"venus",name:"Venus",type:"Terrestrial",tag:"THE VEILED PLANET",color:"#d6a36a",shadow:"#d6a36a",distance:"108.2 million km",mass:"4.87 × 10²⁴ kg",diameter:"12,104 km",period:"225 days",temperature:"464 °C",gravity:"8.87 m/s²",moons:"0",description:"Venus is wrapped in a dense carbon-dioxide atmosphere and thick clouds. Its runaway greenhouse effect makes it the hottest planet."},
  {id:"earth",name:"Earth",type:"Terrestrial",tag:"OUR HOME PLANET",color:"#267ea5",shadow:"#2789bd",distance:"149.6 million km",mass:"5.97 × 10²⁴ kg",diameter:"12,742 km",period:"365.26 days",temperature:"15 °C",gravity:"9.8 m/s²",moons:"1",description:"The only known world to harbour life, Earth is a dynamic planet with vast oceans, a protective atmosphere and a remarkable diversity of living things."},
  {id:"mars",name:"Mars",type:"Terrestrial",tag:"THE RED PLANET",color:"#b85f43",shadow:"#bd654b",distance:"227.9 million km",mass:"6.42 × 10²³ kg",diameter:"6,779 km",period:"687 days",temperature:"−65 °C",gravity:"3.71 m/s²",moons:"2",description:"A cold desert world with a thin atmosphere, Mars is home to giant volcanoes, ancient river valleys and the next frontier for human exploration."},
  {id:"jupiter",name:"Jupiter",type:"Gas giant",tag:"KING OF THE PLANETS",color:"#c59a73",shadow:"#c59a73",distance:"778.6 million km",mass:"1.90 × 10²⁷ kg",diameter:"139,820 km",period:"11.86 years",temperature:"−110 °C",gravity:"24.79 m/s²",moons:"95+",description:"Jupiter is the largest planet in our solar system. Its swirling cloud bands and enormous Great Red Spot reveal a turbulent atmosphere."},
  {id:"saturn",name:"Saturn",type:"Gas giant",tag:"THE RINGED WONDER",color:"#c8ae7e",shadow:"#c8ae7e",distance:"1.43 billion km",mass:"5.68 × 10²⁶ kg",diameter:"116,460 km",period:"29.45 years",temperature:"−140 °C",gravity:"10.44 m/s²",moons:"146+",description:"Saturn is famous for its spectacular rings, made mostly of countless pieces of ice and rock. It is a giant world with a remarkably low density."},
  {id:"uranus",name:"Uranus",type:"Ice giant",tag:"THE SIDEWAYS PLANET",color:"#82c8c9",shadow:"#82c8c9",distance:"2.87 billion km",mass:"8.68 × 10²⁵ kg",diameter:"50,724 km",period:"84 years",temperature:"−195 °C",gravity:"8.69 m/s²",moons:"28",description:"Uranus rotates on its side, giving it extreme seasons. This pale blue ice giant has a cold atmosphere of hydrogen, helium and methane."},
  {id:"neptune",name:"Neptune",type:"Ice giant",tag:"THE WINDY WORLD",color:"#456bd0",shadow:"#456bd0",distance:"4.50 billion km",mass:"1.02 × 10²⁶ kg",diameter:"49,244 km",period:"164.8 years",temperature:"−200 °C",gravity:"11.15 m/s²",moons:"16",description:"Dark, cold and swept by supersonic winds, Neptune is the most distant major planet from the Sun. Its vivid blue colour comes from atmospheric methane."}
];

const apiUrl = "https://api.le-systeme-solaire.net/rest/bodies/?filter=isPlanet,eq,true";
const list = document.getElementById("planetList");
let activePlanet = "earth";
const $ = id => document.getElementById(id);

function renderButtons(){
  list.innerHTML = "";
  planets.forEach((planet,index)=>{
    const button=document.createElement("button");
    button.className="planet-choice"+(planet.id===activePlanet?" selected":"");
    button.dataset.planet=planet.id;
    button.innerHTML=`<span class="choice-dot ${planet.id}-dot"></span><span>${planet.name}</span><span class="choice-number">${String(index+1).padStart(2,"0")}</span>`;
    button.addEventListener("click",()=>selectPlanet(planet.id));
    list.appendChild(button);
  });
}
function selectPlanet(id){
  const planet=planets.find(p=>p.id===id);
  if(!planet)return;
  activePlanet=id;
  renderButtons();
  $("planetIndex").textContent=`PLANET ${String(planets.indexOf(planet)+1).padStart(2,"0")} / 08`;
  $("planetType").textContent=planet.type.toUpperCase();
  $("planetTag").textContent=planet.tag;
  $("planetName").textContent=planet.name;
  $("planetDescription").textContent=planet.description;
  $("distance").textContent=planet.distance;
  $("mass").textContent=planet.mass;
  $("diameter").textContent=planet.diameter;
  $("period").textContent=planet.period;
  $("temperature").textContent=planet.temperature;
  $("gravity").textContent=planet.gravity;
  $("moons").textContent=planet.moons;
  $("typeValue").textContent=planet.type;
  const visual=$("planetVisual");
  visual.className=`planet-visual ${planet.id}`;
  visual.setAttribute("aria-label",`Illustration of ${planet.name}`);
  visual.style.setProperty("--planet-bg",`radial-gradient(circle at 30% 25%, ${lighten(planet.color)}, ${planet.color} 48%, #171a2d 100%)`);
  visual.style.setProperty("--planet-shadow",planet.shadow);
  visual.style.setProperty("--planet-glow",planet.shadow);
}
function lighten(hex){
  const n=parseInt(hex.slice(1),16),r=Math.min(255,((n>>16)&255)+55),g=Math.min(255,((n>>8)&255)+55),b=Math.min(255,(n&255)+55);
  return `rgb(${r},${g},${b})`;
}
async function loadPlanetData(){
  const status=$("dataStatus");
  try{
    const response=await fetch(apiUrl);
    if(!response.ok)throw new Error(`API request failed: ${response.status}`);
    const result=await response.json();
    const bodies=result.bodies||[];
    planets.forEach(p=>{
      const body=bodies.find(b=>b.englishName?.toLowerCase()===p.name.toLowerCase());
      if(!body)return;
      if(body.semimajorAxis)p.distance=formatDistance(body.semimajorAxis);
      if(body.mass?.massValue)p.mass=`${Number(body.mass.massValue).toFixed(2)} × 10${toSuperscript(body.mass.massExponent)} kg`;
      if(body.meanRadius)p.diameter=`${Math.round(body.meanRadius*2)} km`;
      if(body.sideralOrbit)p.period=formatOrbit(body.sideralOrbit);
      if(body.avgTemp!==undefined)p.temperature=`${Math.round(body.avgTemp-273.15)} °C`;
      if(body.gravity)p.gravity=`${Number(body.gravity).toFixed(2)} m/s²`;
      if(Array.isArray(body.moons))p.moons=String(body.moons.length);
      if(body.bodyType)p.type=body.bodyType;
    });
    selectPlanet(activePlanet);
    status.textContent="Live planetary measurements loaded from Solar System OpenData.";
  }catch(error){
    console.warn("Planet API unavailable; using built-in reference data.",error);
    status.textContent="Showing reference data. Live API is temporarily unavailable.";
  }
}
function formatDistance(km){
  if(km>=1e9)return `${(km/1e9).toFixed(2)} billion km`;
  return `${(km/1e6).toFixed(1)} million km`;
}
function formatOrbit(days){
  if(days>=365)return `${(days/365.25).toFixed(2)} years`;
  return `${Number(days.toFixed(2))} days`;
}
function toSuperscript(value){
  const map={"-":"⁻","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
  return String(value).split("").map(c=>map[c]||c).join("");
}

$("themeToggle").addEventListener("click",()=>{
  const light=document.body.classList.toggle("light");
  $("themeIcon").textContent=light?"☾":"☼";
  document.querySelector(".theme-label").textContent=light?"Dark mode":"Light mode";
  $("themeToggle").setAttribute("aria-label",light?"Switch to dark mode":"Switch to light mode");
  try{localStorage.setItem("orbit-theme",light?"light":"dark")}catch(e){}
});
try{
  if(localStorage.getItem("orbit-theme")==="light"){
    document.body.classList.add("light");
    $("themeIcon").textContent="☾";
    document.querySelector(".theme-label").textContent="Dark mode";
  }
}catch(e){}
renderButtons();
selectPlanet("earth");
loadPlanetData();
